import test from "node:test";
import assert from "node:assert/strict";
import { EQUIPMENT, GOALS, durationError, generateStarterWorkout } from "./starterWorkout.js";

const generate = (goal = "general", minutes = 30, equipment = ["bodyweight"]) =>
  generateStarterWorkout({ goal, minutes, equipment });

test("representative workouts are deterministic and only use available equipment", () => {
  for (const [goal, minutes, equipment] of [
    ["strength", 60, Object.keys(EQUIPMENT)],
    ["hypertrophy", 45, ["dumbbell"]],
    ["general", 30, ["bodyweight"]],
  ]) {
    const workout = generate(goal, minutes, equipment);
    assert.deepEqual(workout, generate(goal, minutes, equipment));
    assert.ok(workout.exercises.length > 0);
    for (const exercise of workout.exercises) {
      assert.ok(exercise.name && exercise.sets > 0 && exercise.reps);
      assert.ok(exercise.equipment.every((item) => equipment.includes(item)));
    }
  }
});

test("invalid durations are rejected and valid boundaries work", () => {
  for (const minutes of ["", " ", 0, -1, 9, 121, 30.5, "abc", Infinity, NaN]) {
    assert.ok(durationError(minutes));
    assert.throws(() => generate("general", minutes));
  }
  for (const minutes of [10, "45", 120]) {
    assert.equal(durationError(minutes), "");
    assert.ok(generate("general", minutes).exercises.length);
  }
});

test("empty and incompatible equipment produce an empty result", () => {
  assert.deepEqual(generate("general", 30, []).exercises, []);
  assert.deepEqual(generate("general", 30, ["bench"]).exercises, []);
});

test("goals change prescriptions and longer workouts increase workload", () => {
  const reps = new Set();
  for (const goal of Object.keys(GOALS)) {
    const short = generate(goal, 10);
    const long = generate(goal, 60);
    const workload = (workout) => workout.exercises.reduce((sum, item) => sum + item.sets, 0);
    assert.ok(workload(long) > workload(short));
    reps.add(long.exercises[0].reps);
  }
  assert.equal(reps.size, 3);
});

test("regeneration uses new inputs without mutating earlier results", () => {
  const original = generate();
  const snapshot = structuredClone(original);
  const updated = generate("hypertrophy", 45, ["dumbbell"]);
  assert.deepEqual(original, snapshot);
  assert.notDeepEqual(updated, original);
  assert.throws(() => generate("unknown"));
});

test("every equipment subset respects all exercise requirements", () => {
  const keys = Object.keys(EQUIPMENT);
  for (let mask = 0; mask < 2 ** keys.length; mask++) {
    const equipment = keys.filter((_, index) => mask & (1 << index));
    for (const exercise of generate("strength", 60, equipment).exercises) {
      assert.ok(exercise.equipment.every((item) => equipment.includes(item)));
    }
  }
});
