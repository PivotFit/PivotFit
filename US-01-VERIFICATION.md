# US-01 implementation and verification

Branch: `feature/us-01-workout-generation`

## Implementation

- #17: native single-choice goal controls for Strength, Hypertrophy, and General Fitness. Checked styling and selected-goal text identify the choice. Editing does not generate a workout.
- #18: 45-minute default, whole-minute range 10–120, immediate accessible validation, multiple equipment checkboxes, Bodyweight default. React state preserves all inputs while editing.
- #19: explicit Generate Workout button, deterministic local catalog subset, complete equipment requirement matching, goal-specific sets/reps, time-budgeted exercise count and sets, readable output, empty state, and regeneration. Previous output stays labeled with its original inputs until regenerated.

## Files

- `src/components/workout/StarterWorkout.jsx`: setup and generated plan UI.
- `src/lib/starterWorkout.js`: input validation, catalog subset, prescriptions and generator.
- `src/lib/starterWorkout.test.js`: focused Node tests.
- `src/pages/Plan.jsx`: starter setup before the existing weekly plan/setup prompt.
- `src/App.css`: scoped responsive controls and checked/focus styling.
- `package.json`: npm test script; no new dependencies.
- `US-01-VERIFICATION.md`: this report.

## Acceptance checks

| Criterion | Evidence | Result |
| --- | --- | --- |
| Three goals, exactly one selected, visibly identified | Browser selected each goal; checked state and selected text updated | Pass |
| Editing does not generate | Browser changed goal/time/equipment before first click; initial prompt remained | Pass |
| Duration and multiple equipment choices | Browser added/removed gym equipment and changed duration; other inputs retained | Pass |
| Invalid duration rejected | Browser entered 0: feedback shown and button disabled; tests cover blank, fractional, nonnumeric and out-of-range values | Pass |
| Bodyweight only | Browser generated General Fitness + 30 minutes + Bodyweight | Pass |
| Generate readable names/sets/reps | Browser generated Strength + 60 minutes + gym equipment, Hypertrophy + 45 minutes + dumbbells, General Fitness + 30 minutes + bodyweight | Pass |
| All equipment requirements satisfied | Tests check all 1,024 equipment subsets; browser examples contained compatible exercises | Pass |
| Goal and duration adaptation | Tests compare prescriptions for every goal and workload at 10 versus 60 minutes | Pass |
| Deterministic results | Tests compare repeated calls with identical inputs | Pass |
| Empty state | Browser removed all equipment and generated; explanatory message shown. Tests also cover bench-only | Pass |
| Edit and regenerate | Browser changed strength/gym to hypertrophy/dumbbells then general/bodyweight; generated result updated | Pass |
| Responsive controls | Browser inspected 390 × 844 viewport; controls wrapped and document did not exceed viewport width | Pass |
| Existing navigation and weekly plan | Browser navigated Home, completed existing onboarding, saved a one-day plan, viewed weekly exercises, opened Monday workout preview | Pass |
| Live authentication | Existing development bypass active; auth code/routes untouched | Not tested against Supabase |

## Commands

- `npm install --no-audit --no-fund`: completed after retry with network access.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm test`: 6 tests passed; no pre-existing test script was present.
- `git diff --check`: passed.

## Limitations and next steps

Recommendations are previews; saving or starting a generated starter workout is outside these tickets. Setup state lasts while the page is mounted, not across navigation/reload. Time is an estimate, including five minutes for warm-up plus per-set work/rest and transitions. The small curated catalog may have no match for some equipment-only setups; users receive an empty state. No external APIs, services, or database migrations were added.

No pre-existing lint/build failures were observed. Real sign-in/sign-out and account recovery still need team verification with configured Supabase credentials. Review the PR and accept the issues before merging; nothing was deployed or merged and issues remain open.
