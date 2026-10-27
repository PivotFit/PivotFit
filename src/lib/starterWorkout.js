import { EXERCISES_BY_ID } from "../data/exercises.js";
export const EQUIPMENT = {
  bodyweight: "Bodyweight", dumbbell: "Dumbbells", band: "Resistance bands",
  barbell: "Barbell", bench: "Bench", rack: "Rack", pullup_bar: "Pull-up bar",
  kettlebell: "Kettlebell", cable: "Cable station", machine: "Gym machines",
};

export function durationError(value) {
  const minutes = Number(value);
  return String(value).trim() === "" || !Number.isInteger(minutes) || minutes < 10 || minutes > 120
    ? "Enter a whole number of minutes from 10 to 120."
    : "";
}


export const GOALS = {
  strength: "Strength", hypertrophy: "Hypertrophy", general: "General Fitness",
};

// Reuse a small subset of the shared catalog. Every listed movement has explicit
// equipment requirements (no bench dips or elevated split squats as bodyweight).
const CATALOG = [
  "barbell-back-squat", "goblet-squat", "band-squat", "bodyweight-squat",
  "barbell-bench-press", "dumbbell-floor-press", "band-chest-press", "push-up",
  "barbell-row", "one-arm-dumbbell-row", "band-row", "seated-cable-row",
  "romanian-deadlift", "dumbbell-rdl", "band-good-morning", "glute-bridge",
  "dumbbell-shoulder-press", "band-overhead-press", "machine-shoulder-press",
  "reverse-lunge", "dead-bug",
].map((id) => EXERCISES_BY_ID[id]);

const PRESCRIPTIONS = {
  strength: { sets: 4, reps: "4–6", setMinutes: 3 },
  hypertrophy: { sets: 3, reps: "8–12", setMinutes: 2 },
  general: { sets: 2, reps: "10–15", setMinutes: 1.5 },
};


export function generateStarterWorkout({ goal, minutes, equipment }) {
  if (durationError(minutes)) throw new Error(durationError(minutes));
  if (!Object.hasOwn(PRESCRIPTIONS, goal)) throw new Error("Select a fitness goal.");
  if (!Array.isArray(equipment)) throw new Error("Select available equipment.");
  const prescription = PRESCRIPTIONS[goal];
  // Reserve five minutes for warm-up. Each exercise includes a transition minute
  // plus estimated work/rest per set. For short sessions, reduce sets first.
  const budget = Number(minutes) - 5;
  const sets = Math.min(prescription.sets, Math.max(1,
    Math.floor((budget - 1) / prescription.setMinutes)));
  const count = Math.min(6, Math.floor(budget / (sets * prescription.setMinutes + 1)));
  const usedPatterns = new Set();
  const exercises = CATALOG.filter((exercise) => {
    if (usedPatterns.has(exercise.pattern) ||
      !exercise.equipment.every((item) => equipment.includes(item))) return false;
    usedPatterns.add(exercise.pattern);
    return true;
  }).slice(0, count).map((exercise) => ({
    ...exercise, sets, reps: prescription.reps,
  }));
  return { goal, minutes: Number(minutes), equipment: [...equipment], exercises };
}
