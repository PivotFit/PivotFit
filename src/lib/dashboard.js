// Numbers for the Home dashboard widgets, computed from saved history.
// Only relative imports with extensions so this file runs under `node --test`.

import { addDays, dateKey, startOfDay } from "./calendar.js";

function startOfWeek(date) {
  return addDays(startOfDay(date), -new Date(date).getDay());
}

function inRange(entry, from, to) {
  const d = new Date(entry.date);
  return d >= from && d < to;
}

// Workouts and minutes for this week (Sun–Sat) and last week, plus
// consistency against the planned number of sessions.
export function weekComparison(history, plannedPerWeek, now) {
  const thisStart = startOfWeek(now);
  const lastStart = addDays(thisStart, -7);
  const nextStart = addDays(thisStart, 7);

  const summarize = (from, to) => {
    const entries = history.filter((h) => inRange(h, from, to));
    const workouts = entries.length;
    const minutes = entries.reduce((sum, h) => sum + (Number(h.minutes) || 0), 0);
    const consistency =
      plannedPerWeek > 0 ? Math.min(100, Math.round((workouts / plannedPerWeek) * 100)) : 0;
    return { workouts, minutes, consistency };
  };

  return { current: summarize(thisStart, nextStart), previous: summarize(lastStart, thisStart) };
}

// Percent change from `previous` to `current`, rounded. null when there's no
// baseline to compare against (previous is 0).
export function percentChange(current, previous) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

// Workouts per week for the last `weeks` weeks, oldest first, current last.
export function weeklyCounts(history, now, weeks = 8) {
  const thisStart = startOfWeek(now);
  return Array.from({ length: weeks }, (_, i) => {
    const from = addDays(thisStart, -7 * (weeks - 1 - i));
    const to = addDays(from, 7);
    return { start: from, count: history.filter((h) => inRange(h, from, to)).length };
  });
}

// Movement patterns grouped into the heatmap's rows.
export const HEATMAP_GROUPS = [
  { key: "push", label: "Push", patterns: ["horizontal_push", "vertical_push", "triceps", "lateral_raise"] },
  { key: "pull", label: "Pull", patterns: ["horizontal_pull", "vertical_pull", "biceps", "rear_delt"] },
  { key: "legs", label: "Legs", patterns: ["squat", "hinge", "lunge", "calves"] },
  { key: "core", label: "Core", patterns: ["core"] },
];

export const HEAT_LEVELS = [
  { level: 0, label: "None" },
  { level: 1, label: "Low" },
  { level: 2, label: "Medium" },
  { level: 3, label: "High" },
  { level: 4, label: "Best" },
];

// Sets counted when an exercise was finished but no set count was logged.
const DEFAULT_SETS = 3;

function setsFor(exercise) {
  if (!exercise.done) return 0;
  const logged = Number(exercise.sets);
  return logged > 0 ? logged : DEFAULT_SETS;
}

export function heatLevel(sets) {
  if (sets <= 0) return 0;
  if (sets <= 3) return 1;
  if (sets <= 6) return 2;
  if (sets <= 9) return 3;
  return 4;
}

// Sets per muscle group per day for the last `days` days, today last.
export function activityHeatmap(history, now, days = 12) {
  const today = startOfDay(now);
  const dates = Array.from({ length: days }, (_, i) => addDays(today, i - (days - 1)));
  const groupOf = {};
  for (const group of HEATMAP_GROUPS) {
    for (const pattern of group.patterns) groupOf[pattern] = group.key;
  }

  // "groupKey|YYYY-MM-DD" -> sets
  const totals = new Map();
  for (const entry of history) {
    const key = dateKey(entry.date);
    for (const exercise of entry.exercises ?? []) {
      const group = groupOf[exercise.pattern];
      if (!group) continue;
      const k = `${group}|${key}`;
      totals.set(k, (totals.get(k) ?? 0) + setsFor(exercise));
    }
  }

  const rows = HEATMAP_GROUPS.map((group) => ({
    key: group.key,
    label: group.label,
    cells: dates.map((date) => {
      const sets = totals.get(`${group.key}|${dateKey(date)}`) ?? 0;
      return { date, sets, level: heatLevel(sets) };
    }),
  }));

  return { dates, rows };
}

// Seven days centred on today, for the calendar strip.
export function weekStrip(now) {
  const today = startOfDay(now);
  return Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));
}

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// Next `count` planned sessions as dated items, starting today (or tomorrow
// when today's session is already done).
export function upcomingSessions(plan, now, { count = 3, skipToday = false } = {}) {
  const today = startOfDay(now);
  const items = [];
  if (plan.length === 0) return items;
  for (let offset = skipToday ? 1 : 0; items.length < count && offset < 7 * count + 7; offset++) {
    const date = addDays(today, offset);
    const entry = plan.find((p) => p.day === DAY_KEYS[date.getDay()]);
    if (entry) items.push({ ...entry, date, offset });
  }
  return items;
}