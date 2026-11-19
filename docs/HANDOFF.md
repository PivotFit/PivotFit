# Handoff

Everything a new team needs to pick up PivotFit. Read the [README](../README.md) first for what works, how to run it, and how it's deployed.

State as of the `wrap-up-submission` tag (November 2026): `main` builds, lint passes, and all 19 unit tests pass. The live site on Railway deploys from `main`.

## Known issues

| Issue | Impact | Where to look |
|---|---|---|
| **Workout data is browser-only.** Plans, history, ratings and active workouts are in `localStorage`. | Clearing site data or switching devices loses everything; the Progress calendar starts over. | `src/lib/userData.js`, `src/hooks/useUserData.js` |
| **The starter workout is a dead end.** US-01 generates a workout but it can't be saved, started, or turned into a weekly plan. Its form also sits above the weekly plan on the Workouts tab, which crowds that page. | Users get two different "plan" experiences that don't talk to each other. | `src/components/workout/StarterWorkout.jsx`, `src/pages/Plan.jsx` |
| **Two workout generators.** `src/lib/training.js` (onboarding plan) and `src/lib/starterWorkout.js` (US-01) were built separately, with different inputs, catalogs and prescriptions. | Fixes and new exercises have to be made twice. | Both files; `src/data/exercises.js` |
| **#17, #18, #19 are still open** although PR #50 implemented them and `US-01-VERIFICATION.md` shows every check passing. | The board overstates remaining work. | Verify against their criteria, then close them and #6 |
| **Duplicate issue titles.** "Show recent exercise performance" exists as #36 (closed duplicate) and #37 (open, the real one). | Minor confusion. | Use #37 |
| **Stale Vercel deployment** at pivot-fit.vercel.app still serves an old build without the security headers. | Users could land on an outdated, less secure copy. | Vercel project settings (org owner) |
| **Gmail SMTP limits.** About 500 emails/day, and Google may suspend the account under abuse. | Signup and password-reset emails stop if limits are hit. Emails often land in spam (the app warns users). | Supabase **Authentication > Emails / Rate Limits** |
| **Exercise catalog is small.** Some equipment-only setups (e.g. bench only) produce an empty starter workout; location equipment lists are unvalidated guesses. | Fewer swap alternatives than users expect. | `src/data/exercises.js` |
| **No end-to-end tests in the repo.** Browser regression checks were run during development but were not committed. Only `src/lib` logic has unit tests. | UI regressions are caught by hand. | Add Playwright tests (see "Next steps") |

## Open questions

1. **Where should workout data live?** Moving to Supabase tables (with row-level security, like `profiles`) is the obvious step, but needs a schema for plans, sessions and history, plus a one-time import from `localStorage`.
2. **Should the two generators merge?** Is the US-01 starter workout a separate "quick workout" feature, or the first step of onboarding?
3. **What does "keeps the point of the workout" mean to users?** Swaps currently match movement pattern and equipment. We never tested with real users whether a swap feels like it preserves the workout's purpose.
4. **Do users describe their situation in our terms?** Onboarding asks for experience level and location. We don't know whether people think in those categories or in "I have 20 minutes and a pair of dumbbells."
5. **Hosting ownership.** Railway's GitHub app and the org settings need an org owner. Who owns the Supabase, Railway, Cloudflare and Gmail accounts after handoff? (Credentials are not in this repo; get them from the current team.)

## Unplanted seeds from Widening the Lens

We planted our main seed: a PIVOT prototype where each exercise has a button that swaps it for one working the same muscles with the equipment still available. That became the Swap feature. These pieces of it were **not** built:

- **Energy level as an input.** Classmates' annotations on our "Postcard from the Future" pointed out that people often have the time but not the energy (after work or class). We planned a low / normal / high energy input that adjusts volume and intensity. Not implemented anywhere.
- **The crowded-campus-gym user test.** We planned to watch 3 people use the swap flow in a "the bench just got taken" scenario, to learn whether swaps keep the point of the workout and whether people can describe their situation without gym jargon. Never run. It answers open questions 3 and 4.
- **Plain-language setup.** The seed asked for setup with no "Push/Pull/Legs" jargon. Onboarding avoids it, but the weekly plan still labels days by split ("Push Day", "Pull Day", "Upper Body") rather than by what the user gets out of them.
- **Pivoting a whole session, not just one exercise.** The Postcard's core moment is the session adapting mid-workout ("the plan changed, keep the purpose"). Today you swap exercises one at a time. This is US-02 (#7, #20–#22) and US-04 (#9, #26–#28).

## What we'd do next

In priority order:

1. **Run the campus-gym user test** (one afternoon, 3 people). It's cheap and decides how to build the next items.
2. **Build the "Change plans" pivot flow** (US-02: #20 → #21 → #22), including **"less time"** (US-04: #26–#28) and an **energy** option. This is the product's reason to exist.
3. **Move workout data to Supabase.** Add tables plus RLS policies in a new migration under `supabase/migrations/`, and switch `useUserData` to read and write there.
4. **Unify the generators** and let a starter workout be saved and started.
5. **Workout history and exercise progress** (#33, #34, #35, #37, #38); the data is already being saved.
6. **Commit browser tests** (Playwright) for onboarding → workout → swap → save at phone width.
7. **Housekeeping:** close #17–#19 and #6 after verifying, retire the Vercel deployment, and confirm who owns each external account.
