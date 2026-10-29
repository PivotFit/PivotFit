import test from "node:test";
import assert from "node:assert/strict";
import {
  bestStreak,
  createTracker,
  currentStreak,
  dateKey,
  dayStatus,
  monthSummary,
  monthWeeks,
} from "./calendar.js";

// October 2026: Oct 1 is a Thursday. Schedule: Mon / Wed / Fri.
const schedule = {
  mon: { slot: "evening", minutes: 45 },
  wed: { slot: "evening", minutes: 45 },
  fri: { slot: "evening", minutes: 45 },
};
const at = (day, hour = 18) => new Date(2026, 9, day, hour).toISOString();
const session = (day, planDay) => ({ date: at(day), day: planDay });
const tracker = (history, today, planCreatedAt = at(1, 9)) =>
  createTracker({ schedule, history, planCreatedAt, today: new Date(2026, 9, today, 12) });

test("rest days never break a streak", () => {
  // Fri 2, Mon 5, Wed 7, Fri 9 — with rest days in between.
  const t = tracker([session(2, "fri"), session(5, "mon"), session(7, "wed"), session(9, "fri")], 10);
  assert.equal(currentStreak(t), 4);
  assert.equal(dayStatus(new Date(2026, 9, 3), t), "rest");
  assert.equal(dayStatus(new Date(2026, 9, 6), t), "rest");
});

test("a missed planned workout breaks the streak", () => {
  // Fri 2 done, Mon 5 missed, Wed 7 and Fri 9 done.
  const t = tracker([session(2, "fri"), session(7, "wed"), session(9, "fri")], 10);
  assert.equal(dayStatus(new Date(2026, 9, 5), t), "missed");
  assert.equal(currentStreak(t), 2);
  assert.equal(bestStreak(t), 2);
});

test("today's unfinished workout doesn't break the streak yet", () => {
  // Today is Mon 12; Fri 9 and Wed 7 done, today not done yet.
  const t = tracker([session(7, "wed"), session(9, "fri")], 12, at(6, 9));
  assert.equal(dayStatus(new Date(2026, 9, 12), t), "planned");
  assert.equal(currentStreak(t), 2);
});

test("a workout made up later in the same week keeps the streak", () => {
  // Monday's session done on Tuesday 6.
  const t = tracker([session(2, "fri"), session(6, "mon"), session(7, "wed")], 8);
  assert.equal(dayStatus(new Date(2026, 9, 5), t), "made-up");
  assert.equal(dayStatus(new Date(2026, 9, 6), t), "done");
  assert.equal(currentStreak(t), 3);
});

test("days before tracking started are never missed", () => {
  const t = tracker([session(14, "wed")], 15, at(13, 9));
  assert.equal(dayStatus(new Date(2026, 9, 5), t), "none");
  assert.equal(dayStatus(new Date(2026, 9, 12), t), "none");
  assert.equal(currentStreak(t), 1);
});

test("best streak survives a later break", () => {
  // Fri 2, Mon 5, Wed 7, Fri 9 done; Mon 12 missed; Wed 14 done.
  const history = [session(2, "fri"), session(5, "mon"), session(7, "wed"), session(9, "fri"), session(14, "wed")];
  const t = tracker(history, 15);
  assert.equal(currentStreak(t), 1);
  assert.equal(bestStreak(t), 4);
});

test("no history gives zero streaks and no misses", () => {
  // Tracking starts today (Thu 15, a rest day), so earlier days don't count.
  const t = createTracker({ schedule, history: [], today: new Date(2026, 9, 15, 12) });
  assert.equal(currentStreak(t), 0);
  assert.equal(bestStreak(t), 0);
  assert.deepEqual(monthSummary(2026, 9, t), { workouts: 0, restDays: 1, missed: 0 });
});

test("month summary counts workouts, rest days and misses up to today", () => {
  // Plan from Thu 1, today Sat 10. Planned: Fri 2, Mon 5 (missed), Wed 7, Fri 9.
  // Rest days: Thu 1, Sat 3, Sun 4, Tue 6, Thu 8, Sat 10.
  const t = tracker([session(2, "fri"), session(7, "wed"), session(9, "fri")], 10);
  assert.deepEqual(monthSummary(2026, 9, t), { workouts: 3, restDays: 6, missed: 1 });
});

test("month grid starts on Sunday and covers every day", () => {
  const weeks = monthWeeks(2026, 9);
  assert.ok(weeks.every((week) => week.length === 7));
  const days = weeks.flat().filter(Boolean);
  assert.equal(days.length, 31);
  assert.equal(weeks[0].findIndex(Boolean), 4); // Oct 1, 2026 is a Thursday
  assert.equal(dateKey(days[30]), "2026-10-31");
});
