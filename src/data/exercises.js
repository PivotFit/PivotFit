// Starter exercise library. Hardcoded for now; move to Supabase later.
//
// Every exercise belongs to one movement pattern. Swaps stay within the same
// pattern so the workout keeps its original purpose ("adapt instead of
// abandon"). Within a pattern, exercises are listed in rough order of
// preference, which breaks ties when ranking.
//
// difficulty: 1 = easy to learn, 2 = moderate, 3 = advanced.
// unit: "seconds" for timed holds; reps otherwise.

export const PATTERNS = {
  horizontal_push: { label: "Horizontal push", muscles: "Chest, triceps", compound: true },
  vertical_push: { label: "Vertical push", muscles: "Shoulders, triceps", compound: true },
  horizontal_pull: { label: "Horizontal pull", muscles: "Upper back, biceps", compound: true },
  vertical_pull: { label: "Vertical pull", muscles: "Lats, biceps", compound: true },
  squat: { label: "Squat", muscles: "Quads, glutes", compound: true },
  hinge: { label: "Hip hinge", muscles: "Hamstrings, glutes", compound: true },
  lunge: { label: "Single-leg", muscles: "Quads, glutes", compound: true },
  triceps: { label: "Triceps", muscles: "Triceps", compound: false },
  biceps: { label: "Biceps", muscles: "Biceps", compound: false },
  lateral_raise: { label: "Side delts", muscles: "Shoulders", compound: false },
  rear_delt: { label: "Rear delts", muscles: "Rear shoulders, upper back", compound: false },
  calves: { label: "Calves", muscles: "Calves", compound: false },
  core: { label: "Core", muscles: "Abs, obliques", compound: false },
};

export const LOCATIONS = {
  home: {
    label: "Home",
    description: "Bodyweight, dumbbells, and resistance bands",
    equipment: ["bodyweight", "dumbbell", "band"],
  },
  commercial: {
    label: "Commercial Gym",
    description: "Full gym: machines, cables, barbells, and more",
    equipment: [
      "bodyweight", "dumbbell", "band", "barbell", "bench", "rack",
      "pullup_bar", "kettlebell", "cable", "machine",
    ],
  },
  private: {
    label: "Private Gym",
    description: "Smaller setup: free weights, bench, rack, and pull-up bar",
    equipment: [
      "bodyweight", "dumbbell", "band", "barbell", "bench", "rack",
      "pullup_bar", "kettlebell",
    ],
  },
};

// Equipment where logging a weight makes sense.
export const WEIGHTED_EQUIPMENT = ["barbell", "dumbbell", "kettlebell", "cable", "machine"];

export const EXERCISES = [
  // Horizontal push
  { id: "barbell-bench-press", name: "Barbell bench press", pattern: "horizontal_push", equipment: ["barbell", "bench", "rack"], difficulty: 2 },
  { id: "dumbbell-bench-press", name: "Dumbbell bench press", pattern: "horizontal_push", equipment: ["dumbbell", "bench"], difficulty: 1 },
  { id: "incline-dumbbell-press", name: "Incline dumbbell press", pattern: "horizontal_push", equipment: ["dumbbell", "bench"], difficulty: 2 },
  { id: "machine-chest-press", name: "Machine chest press", pattern: "horizontal_push", equipment: ["machine"], difficulty: 1 },
  { id: "dumbbell-floor-press", name: "Dumbbell floor press", pattern: "horizontal_push", equipment: ["dumbbell"], difficulty: 1 },
  { id: "push-up", name: "Push-up", pattern: "horizontal_push", equipment: ["bodyweight"], difficulty: 1 },
  { id: "band-chest-press", name: "Band chest press", pattern: "horizontal_push", equipment: ["band"], difficulty: 1 },

  // Vertical push
  { id: "barbell-overhead-press", name: "Barbell overhead press", pattern: "vertical_push", equipment: ["barbell", "rack"], difficulty: 2 },
  { id: "dumbbell-shoulder-press", name: "Dumbbell shoulder press", pattern: "vertical_push", equipment: ["dumbbell"], difficulty: 1 },
  { id: "machine-shoulder-press", name: "Machine shoulder press", pattern: "vertical_push", equipment: ["machine"], difficulty: 1 },
  { id: "arnold-press", name: "Arnold press", pattern: "vertical_push", equipment: ["dumbbell"], difficulty: 2 },
  { id: "band-overhead-press", name: "Band overhead press", pattern: "vertical_push", equipment: ["band"], difficulty: 1 },
  { id: "pike-push-up", name: "Pike push-up", pattern: "vertical_push", equipment: ["bodyweight"], difficulty: 3 },

  // Horizontal pull
  { id: "barbell-row", name: "Barbell row", pattern: "horizontal_pull", equipment: ["barbell"], difficulty: 2 },
  { id: "seated-cable-row", name: "Seated cable row", pattern: "horizontal_pull", equipment: ["cable"], difficulty: 1 },
  { id: "chest-supported-row", name: "Chest-supported machine row", pattern: "horizontal_pull", equipment: ["machine"], difficulty: 1 },
  { id: "one-arm-dumbbell-row", name: "One-arm dumbbell row", pattern: "horizontal_pull", equipment: ["dumbbell"], difficulty: 1 },
  { id: "dumbbell-bent-over-row", name: "Dumbbell bent-over row", pattern: "horizontal_pull", equipment: ["dumbbell"], difficulty: 2 },
  { id: "inverted-row", name: "Inverted row", pattern: "horizontal_pull", equipment: ["barbell", "rack"], difficulty: 2 },
  { id: "band-row", name: "Band row", pattern: "horizontal_pull", equipment: ["band"], difficulty: 1 },

  // Vertical pull
  { id: "lat-pulldown", name: "Lat pulldown", pattern: "vertical_pull", equipment: ["cable"], difficulty: 1 },
  { id: "pull-up", name: "Pull-up", pattern: "vertical_pull", equipment: ["pullup_bar"], difficulty: 3 },
  { id: "chin-up", name: "Chin-up", pattern: "vertical_pull", equipment: ["pullup_bar"], difficulty: 3 },
  { id: "assisted-pull-up", name: "Assisted pull-up machine", pattern: "vertical_pull", equipment: ["machine"], difficulty: 1 },
  { id: "band-lat-pulldown", name: "Band lat pulldown", pattern: "vertical_pull", equipment: ["band"], difficulty: 1 },
  { id: "dumbbell-pullover", name: "Dumbbell floor pullover", pattern: "vertical_pull", equipment: ["dumbbell"], difficulty: 1 },

  // Squat
  { id: "barbell-back-squat", name: "Barbell back squat", pattern: "squat", equipment: ["barbell", "rack"], difficulty: 2 },
  { id: "leg-press", name: "Leg press", pattern: "squat", equipment: ["machine"], difficulty: 1 },
  { id: "front-squat", name: "Front squat", pattern: "squat", equipment: ["barbell", "rack"], difficulty: 3 },
  { id: "hack-squat", name: "Hack squat", pattern: "squat", equipment: ["machine"], difficulty: 2 },
  { id: "goblet-squat", name: "Goblet squat", pattern: "squat", equipment: ["dumbbell"], difficulty: 1 },
  { id: "dumbbell-sumo-squat", name: "Dumbbell sumo squat", pattern: "squat", equipment: ["dumbbell"], difficulty: 1 },
  { id: "band-squat", name: "Band squat", pattern: "squat", equipment: ["band"], difficulty: 1 },
  { id: "bodyweight-squat", name: "Bodyweight squat", pattern: "squat", equipment: ["bodyweight"], difficulty: 1 },

  // Hinge
  { id: "romanian-deadlift", name: "Romanian deadlift", pattern: "hinge", equipment: ["barbell"], difficulty: 2 },
  { id: "barbell-deadlift", name: "Barbell deadlift", pattern: "hinge", equipment: ["barbell"], difficulty: 3 },
  { id: "dumbbell-rdl", name: "Dumbbell Romanian deadlift", pattern: "hinge", equipment: ["dumbbell"], difficulty: 1 },
  { id: "kettlebell-swing", name: "Kettlebell swing", pattern: "hinge", equipment: ["kettlebell"], difficulty: 2 },
  { id: "back-extension", name: "Back extension", pattern: "hinge", equipment: ["machine"], difficulty: 1 },
  { id: "single-leg-rdl", name: "Single-leg Romanian deadlift", pattern: "hinge", equipment: ["bodyweight"], difficulty: 2 },
  { id: "glute-bridge", name: "Glute bridge", pattern: "hinge", equipment: ["bodyweight"], difficulty: 1 },
  { id: "band-good-morning", name: "Band good morning", pattern: "hinge", equipment: ["band"], difficulty: 1 },

  // Single-leg
  { id: "dumbbell-walking-lunge", name: "Dumbbell walking lunge", pattern: "lunge", equipment: ["dumbbell"], difficulty: 2 },
  { id: "bulgarian-split-squat", name: "Bulgarian split squat", pattern: "lunge", equipment: ["bodyweight"], difficulty: 2 },
  { id: "dumbbell-step-up", name: "Dumbbell step-up", pattern: "lunge", equipment: ["dumbbell", "bench"], difficulty: 1 },
  { id: "reverse-lunge", name: "Reverse lunge", pattern: "lunge", equipment: ["bodyweight"], difficulty: 1 },

  // Triceps
  { id: "cable-pushdown", name: "Cable triceps pushdown", pattern: "triceps", equipment: ["cable"], difficulty: 1 },
  { id: "skull-crusher", name: "Skull crusher", pattern: "triceps", equipment: ["barbell", "bench"], difficulty: 2 },
  { id: "dumbbell-overhead-extension", name: "Dumbbell overhead extension", pattern: "triceps", equipment: ["dumbbell"], difficulty: 1 },
  { id: "bench-dip", name: "Bench dip", pattern: "triceps", equipment: ["bodyweight"], difficulty: 1 },
  { id: "close-grip-push-up", name: "Close-grip push-up", pattern: "triceps", equipment: ["bodyweight"], difficulty: 2 },
  { id: "band-pushdown", name: "Band triceps pushdown", pattern: "triceps", equipment: ["band"], difficulty: 1 },

  // Biceps
  { id: "barbell-curl", name: "Barbell curl", pattern: "biceps", equipment: ["barbell"], difficulty: 1 },
  { id: "cable-curl", name: "Cable curl", pattern: "biceps", equipment: ["cable"], difficulty: 1 },
  { id: "dumbbell-curl", name: "Dumbbell curl", pattern: "biceps", equipment: ["dumbbell"], difficulty: 1 },
  { id: "hammer-curl", name: "Hammer curl", pattern: "biceps", equipment: ["dumbbell"], difficulty: 1 },
  { id: "band-curl", name: "Band curl", pattern: "biceps", equipment: ["band"], difficulty: 1 },

  // Side delts
  { id: "dumbbell-lateral-raise", name: "Dumbbell lateral raise", pattern: "lateral_raise", equipment: ["dumbbell"], difficulty: 1 },
  { id: "cable-lateral-raise", name: "Cable lateral raise", pattern: "lateral_raise", equipment: ["cable"], difficulty: 2 },
  { id: "machine-lateral-raise", name: "Machine lateral raise", pattern: "lateral_raise", equipment: ["machine"], difficulty: 1 },
  { id: "band-lateral-raise", name: "Band lateral raise", pattern: "lateral_raise", equipment: ["band"], difficulty: 1 },

  // Rear delts
  { id: "face-pull", name: "Face pull", pattern: "rear_delt", equipment: ["cable"], difficulty: 1 },
  { id: "reverse-pec-deck", name: "Reverse pec deck", pattern: "rear_delt", equipment: ["machine"], difficulty: 1 },
  { id: "reverse-dumbbell-fly", name: "Reverse dumbbell fly", pattern: "rear_delt", equipment: ["dumbbell"], difficulty: 1 },
  { id: "band-pull-apart", name: "Band pull-apart", pattern: "rear_delt", equipment: ["band"], difficulty: 1 },

  // Calves
  { id: "machine-calf-raise", name: "Standing calf raise machine", pattern: "calves", equipment: ["machine"], difficulty: 1 },
  { id: "dumbbell-calf-raise", name: "Dumbbell calf raise", pattern: "calves", equipment: ["dumbbell"], difficulty: 1 },
  { id: "bodyweight-calf-raise", name: "Single-leg calf raise", pattern: "calves", equipment: ["bodyweight"], difficulty: 1 },

  // Core
  { id: "cable-crunch", name: "Cable crunch", pattern: "core", equipment: ["cable"], difficulty: 1 },
  { id: "hanging-knee-raise", name: "Hanging knee raise", pattern: "core", equipment: ["pullup_bar"], difficulty: 2 },
  { id: "plank", name: "Plank", pattern: "core", equipment: ["bodyweight"], difficulty: 1, unit: "seconds" },
  { id: "dead-bug", name: "Dead bug", pattern: "core", equipment: ["bodyweight"], difficulty: 1 },
  { id: "side-plank", name: "Side plank", pattern: "core", equipment: ["bodyweight"], difficulty: 1, unit: "seconds" },
];

export const EXERCISES_BY_ID = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
