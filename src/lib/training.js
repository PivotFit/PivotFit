import { EXERCISES, EXERCISES_BY_ID, LOCATIONS, PATTERNS } from "../data/exercises";

export const DAYS = [
  { key: "sun", short: "Sun", label: "Sunday" },
  { key: "mon", short: "Mon", label: "Monday" },
  { key: "tue", short: "Tue", label: "Tuesday" },
  { key: "wed", short: "Wed", label: "Wednesday" },
  { key: "thu", short: "Thu", label: "Thursday" },
  { key: "fri", short: "Fri", label: "Friday" },
  { key: "sat", short: "Sat", label: "Saturday" },
];

export const DAYS_BY_KEY = Object.fromEntries(DAYS.map((d) => [d.key, d]));

export const TIME_SLOTS = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
];

export const DURATIONS = [30, 45, 60, 90];
export const DEFAULT_DURATION = 45;
export const MAX_TRAINING_DAYS = 6;

export const EXPERIENCE_LEVELS = {
  beginner: {
    label: "Beginner",
    years: "0–1 years",
    sets: 3,
    compoundReps: "10–12",
    isolationReps: "12–15",
    effort: "Stop each set with 3–4 reps left in the tank.",
    maxDifficulty: 2,
  },
  novice: {
    label: "Novice",
    years: "2–3 years",
    sets: 3,
    compoundReps: "8–12",
    isolationReps: "10–15",
    effort: "Stop each set with 2–3 reps left in the tank.",
    maxDifficulty: 3,
  },
  intermediate: {
    label: "Intermediate",
    years: "3–4 years",
    sets: 4,
    compoundReps: "6–10",
    isolationReps: "10–15",
    effort: "Stop each set with 1–2 reps left in the tank.",
    maxDifficulty: 3,
  },
  expert: {
    label: "Expert",
    years: "4+ years",
    sets: 4,
    compoundReps: "5–8",
    isolationReps: "8–12",
    effort: "Push close to failure, 0–1 reps left in the tank.",
    maxDifficulty: 3,
  },
};

export const DAY_TYPES = {
  push: { label: "Push Day" },
  pull: { label: "Pull Day" },
  legs: { label: "Leg Day" },
  upper: { label: "Upper Body" },
  lower: { label: "Lower Body" },
  full: { label: "Full Body" },
};

// Movement patterns per day type, most important first. Shorter workouts take
// the first few; repeated patterns get a different exercise the second time.
const DAY_TEMPLATES = {
  push: ["horizontal_push", "vertical_push", "triceps", "lateral_raise", "horizontal_push", "triceps"],
  pull: ["vertical_pull", "horizontal_pull", "biceps", "rear_delt", "horizontal_pull", "biceps"],
  legs: ["squat", "hinge", "lunge", "calves", "core", "squat"],
  upper: ["horizontal_push", "horizontal_pull", "vertical_push", "vertical_pull", "biceps", "triceps"],
  lower: ["squat", "hinge", "lunge", "core", "calves", "hinge"],
  full: ["squat", "horizontal_push", "horizontal_pull", "hinge", "vertical_push", "core"],
};

const EXERCISE_COUNT_BY_DURATION = { 30: 3, 45: 4, 60: 5, 90: 6 };

// Split by number of training days per week.
const SPLITS = {
  1: ["full"],
  2: ["full", "full"],
  3: ["push", "pull", "legs"],
  4: ["upper", "lower", "upper", "lower"],
  5: ["push", "pull", "legs", "upper", "lower"],
  6: ["push", "pull", "legs", "push", "pull", "legs"],
};

// How each summary rating changes an exercise's score for future sessions.
export const RATINGS = [
  { value: 2, emoji: "🤩", label: "Loved it" },
  { value: 1, emoji: "🙂", label: "Good" },
  { value: -1, emoji: "😐", label: "Meh" },
  { value: -3, emoji: "🙅", label: "Not for me" },
];

const DISLIKED_SCORE = -3;

// profile.schedule: { mon: { slot: "evening", minutes: 30 }, ... }
// Returns the week's training days in order, each with its assigned day type.
export function buildPlan(profile) {
  const trainingDays = DAYS.filter((d) => profile.schedule[d.key]);
  const split =
    profile.experience === "beginner" && trainingDays.length === 3
      ? ["full", "full", "full"]
      : SPLITS[trainingDays.length] ?? [];

  return trainingDays.map((day, i) => ({
    day: day.key,
    type: split[i],
    ...profile.schedule[day.key],
  }));
}

function availableExercises(profile) {
  const equipment = LOCATIONS[profile.location].equipment;
  const { maxDifficulty } = EXPERIENCE_LEVELS[profile.experience];
  return EXERCISES.filter(
    (e) =>
      e.difficulty <= maxDifficulty &&
      e.equipment.every((item) => equipment.includes(item)),
  );
}

// Best first: liked exercises up, disliked ones to the bottom. Beginners lean
// toward easier movements, experts toward harder ones; ties keep library order.
function rankExercises(exercises, profile, ratings) {
  const lean = { beginner: -1, expert: 1 }[profile.experience] ?? 0;
  const score = (e) => {
    const rating = ratings[e.id] ?? 0;
    if (rating <= DISLIKED_SCORE) return -100;
    return rating * 10 + lean * e.difficulty;
  };
  return [...exercises].sort((a, b) => score(b) - score(a));
}

export function prescriptionFor(exerciseId, profile) {
  const exercise = EXERCISES_BY_ID[exerciseId];
  const level = EXPERIENCE_LEVELS[profile.experience];
  const reps =
    exercise.unit === "seconds"
      ? "30–60 s"
      : PATTERNS[exercise.pattern].compound
        ? level.compoundReps
        : level.isolationReps;
  return { sets: level.sets, reps };
}

export function buildWorkout(profile, planDay, ratings = {}) {
  const available = availableExercises(profile);
  const count = EXERCISE_COUNT_BY_DURATION[planDay.minutes] ?? 4;
  const used = new Set();

  const exercises = DAY_TEMPLATES[planDay.type]
    .slice(0, count)
    .map((pattern) => {
      const candidates = rankExercises(
        available.filter((e) => e.pattern === pattern && !used.has(e.id)),
        profile,
        ratings,
      );
      if (candidates.length === 0) return null;

      const [pick, ...backups] = candidates;
      used.add(pick.id);
      return {
        pattern,
        exerciseId: pick.id,
        backupIds: backups.slice(0, 3).map((e) => e.id),
        ...prescriptionFor(pick.id, profile),
      };
    })
    .filter(Boolean);

  return { ...planDay, exercises };
}

// Alternatives for an exercise that can't be done right now: same movement
// pattern, not already in the session, and not already marked unavailable.
export function swapOptions(session, index, profile, ratings = {}) {
  const current = session.exercises[index];
  const inSession = new Set(session.exercises.map((e) => e.exerciseId));
  const unavailable = new Set(session.unavailableIds);

  return rankExercises(
    availableExercises(profile).filter(
      (e) =>
        e.pattern === current.pattern &&
        !inSession.has(e.id) &&
        !unavailable.has(e.id),
    ),
    profile,
    ratings,
  ).slice(0, 3);
}

export function workoutTitle(planDay) {
  return `${DAYS_BY_KEY[planDay.day].label} | ${DAY_TYPES[planDay.type].label} | ${planDay.minutes} min`;
}

// Next planned workout from `now`, today included unless skipToday is set.
export function nextPlanDay(plan, now, { skipToday = false } = {}) {
  const today = now.getDay();
  for (let offset = skipToday ? 1 : 0; offset < 8; offset++) {
    const day = DAYS[(today + offset) % 7];
    const entry = plan.find((p) => p.day === day.key);
    if (entry) {
      const when = offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : day.label;
      return { ...entry, when };
    }
  }
  return null;
}

export function todayKey(now) {
  return DAYS[now.getDay()].key;
}

function startOfWeek(now) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

export function weekStats(history, plan, now) {
  const weekStart = startOfWeek(now);
  const completed = history.filter((h) => new Date(h.date) >= weekStart).length;
  const consistency =
    plan.length > 0 ? Math.min(100, Math.round((completed / plan.length) * 100)) : 0;
  return { completed, planned: plan.length, consistency };
}
