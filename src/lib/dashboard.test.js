import test from "node:test";
import assert from "node:assert/strict";
import {
  activityHeatmap,
  heatLevel,
  percentChange,
  upcomingSessions,
  weekComparison,
  weekStrip,
  weeklyCounts,
} from "./dashboard.js";

// Wednesday, November 18, 2026 at noon. Week starts Sunday Nov 15.
const now = new Date(2026, 10, 18, 12);
const at = (month, day, hour = 18) => new Date(2026, month, day, hour).toISOString();

test("weekComparison splits this week and last week", () => {
  const history = [
    { date: at(10, 9), minutes: 45 }, // last week (Mon)
    { date: at(10, 16), minutes: 30 }, // this week
    { date: at(10, 17), minutes: 60 }, // this week
    { date: at(10, 1), minutes: 45 }, // two weeks ago, ignored
  ];
  const result = weekComparison(history, 3, now);
  assert.deepEqual(result.current, { workouts: 2, minutes: 90, consistency: 67 });
  assert.deepEqual(result.previous, { workouts: 1, minutes: 45, consistency: 33 });
});

test("weekComparison caps consistency and handles no plan", () => {
  const history = [at(10, 15), at(10, 16), at(10, 17)].map((date) => ({ date }));
  assert.equal(weekComparison(history, 2, now).current.consistency, 100);
  assert.equal(weekComparison(history, 0, now).current.consistency, 0);
  assert.equal(weekComparison(history, 2, now).current.minutes, 0);
});

test("percentChange", () => {
  assert.equal(percentChange(3, 2), 50);
  assert.equal(percentChange(1, 2), -50);
  assert.equal(percentChange(2, 0), null);
  assert.equal(percentChange(0, 0), null);
});

test("weeklyCounts returns oldest first with current week last", () => {
  const history = [{ date: at(10, 16) }, { date: at(10, 17) }, { date: at(10, 10) }];
  const weeks = weeklyCounts(history, now, 4);
  assert.equal(weeks.length, 4);
  assert.deepEqual(
    weeks.map((w) => w.count),
    [0, 0, 1, 2],
  );
  assert.equal(weeks[3].start.getDate(), 15);
});

test("heatLevel thresholds", () => {
  assert.deepEqual([0, 1, 3, 4, 6, 7, 9, 10, 20].map(heatLevel), [0, 1, 1, 2, 2, 3, 3, 4, 4]);
});

test("activityHeatmap groups sets by muscle group and day", () => {
  const history = [
    {
      date: at(10, 18, 8),
      exercises: [
        { pattern: "horizontal_push", done: true, sets: "4" },
        { pattern: "triceps", done: true, sets: "" }, // no sets logged -> 3
        { pattern: "squat", done: false, sets: "5" }, // not done -> 0
        { pattern: "core", done: true, sets: "2" },
      ],
    },
    { date: at(10, 1), exercises: [{ pattern: "squat", done: true, sets: "3" }] }, // out of range
  ];
  const map = activityHeatmap(history, now, 12);
  assert.equal(map.dates.length, 12);
  assert.equal(map.dates[11].getDate(), 18);
  const byKey = Object.fromEntries(map.rows.map((r) => [r.key, r.cells[11]]));
  assert.equal(byKey.push.sets, 7);
  assert.equal(byKey.push.level, 3);
  assert.equal(byKey.legs.sets, 0);
  assert.equal(byKey.core.level, 1);
  assert.ok(map.rows.every((r) => r.cells[0].sets === 0));
});

test("weekStrip is centred on today", () => {
  const days = weekStrip(now).map((d) => d.getDate());
  assert.deepEqual(days, [15, 16, 17, 18, 19, 20, 21]);
});

test("upcomingSessions lists the next planned days", () => {
  const plan = [
    { day: "mon", type: "push", minutes: 45, slot: "evening" },
    { day: "wed", type: "pull", minutes: 45, slot: "evening" },
    { day: "fri", type: "legs", minutes: 45, slot: "evening" },
  ];
  const next = upcomingSessions(plan, now);
  assert.deepEqual(
    next.map((s) => [s.type, s.date.getDate()]),
    [
      ["pull", 18],
      ["legs", 20],
      ["push", 23],
    ],
  );
  const skipped = upcomingSessions(plan, now, { skipToday: true, count: 2 });
  assert.deepEqual(
    skipped.map((s) => s.date.getDate()),
    [20, 23],
  );
  assert.deepEqual(upcomingSessions([], now), []);
});