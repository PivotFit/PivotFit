// Streak and calendar rules for the Progress page.
//
// A streak counts planned workouts completed in a row:
// - Rest days (days not in the schedule) never break or extend it.
// - A planned workout counts as completed if that plan day's session was done
//   any day in the same week (Sunday–Saturday), so shifting a workout by a
//   day doesn't break the streak.
// - Today's workout doesn't break the streak until the day is over.
// - Nothing before the user started (first workout or plan creation) counts.
//
// No imports from training.js so this file runs under `node --test`.

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const MAX_LOOKBACK_DAYS = 730;

export function startOfDay(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date) {
  return addDays(startOfDay(date), -new Date(date).getDay());
}

// Local "YYYY-MM-DD", for comparing calendar days.
export function dateKey(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/**
 * Precomputes lookups for one user.
 * @param {{ schedule: object, history: Array<{date: string, day: string}>,
 *           planCreatedAt?: string, today?: Date }} input
 */
export function createTracker({ schedule, history, planCreatedAt, today = new Date() }) {
  const todayStart = startOfDay(today);
  const trainedDates = new Set(history.map((entry) => dateKey(entry.date)));
  // "weekStartKey|planDay" for every completed session.
  const credited = new Set(
    history.map((entry) => `${dateKey(startOfWeek(entry.date))}|${entry.day}`),
  );

  const candidates = [
    ...history.map((entry) => startOfDay(entry.date)),
    planCreatedAt ? startOfDay(planCreatedAt) : null,
  ].filter(Boolean);
  const start = candidates.length
    ? new Date(Math.min(...candidates.map((d) => d.getTime())))
    : todayStart;

  const isScheduled = (date) => Boolean(schedule[DAY_KEYS[date.getDay()]]);
  const isCredited = (date) =>
    credited.has(`${dateKey(startOfWeek(date))}|${DAY_KEYS[date.getDay()]}`);

  return { today: todayStart, start, trainedDates, isScheduled, isCredited };
}

/**
 * Status of one calendar day:
 * "done"     trained that day
 * "made-up"  planned day whose session was done another day that week
 * "missed"   planned, in the past, not done
 * "planned"  planned, today or later, not done yet
 * "rest"     not a planned day (on or after the start)
 * "none"     before tracking started
 */
export function dayStatus(date, tracker) {
  const day = startOfDay(date);
  const trained = tracker.trainedDates.has(dateKey(day));

  if (trained) return "done";
  if (day < tracker.start) return "none";
  if (tracker.isScheduled(day)) {
    if (tracker.isCredited(day)) return "made-up";
    return day >= tracker.today ? "planned" : "missed";
  }
  return "rest";
}

export function currentStreak(tracker) {
  let streak = 0;
  for (let i = 0; i < MAX_LOOKBACK_DAYS; i++) {
    const day = addDays(tracker.today, -i);
    if (day < tracker.start) break;
    if (!tracker.isScheduled(day)) continue;
    if (tracker.isCredited(day)) streak++;
    else if (i === 0) continue; // today isn't over yet
    else break;
  }
  return streak;
}

export function bestStreak(tracker) {
  let best = 0;
  let run = 0;
  for (let day = tracker.start; day <= tracker.today; day = addDays(day, 1)) {
    if (!tracker.isScheduled(day)) continue;
    if (tracker.isCredited(day)) {
      run++;
      best = Math.max(best, run);
    } else if (day < tracker.today) {
      run = 0;
    }
  }
  return best;
}

// Weeks (Sunday first) covering a month; days outside the month are null.
export function monthWeeks(year, month) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array(first.getDay()).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
}

// Counts for a month, only up to today.
export function monthSummary(year, month, tracker) {
  const summary = { workouts: 0, restDays: 0, missed: 0 };
  for (const day of monthWeeks(year, month).flat()) {
    if (!day || day > tracker.today) continue;
    const status = dayStatus(day, tracker);
    if (status === "done") summary.workouts++;
    else if (status === "rest") summary.restDays++;
    else if (status === "missed") summary.missed++;
  }
  return summary;
}
