# PivotFit

**Adaptive Workout & Fitness Tracking Web Application**

**Live site:** https://pivotfit-production.up.railway.app/ (hosted on Railway, deploys from `main`)

> New to this project? Read [docs/HANDOFF.md](docs/HANDOFF.md) for open work and next steps, [docs/WORKING-AGREEMENT.md](docs/WORKING-AGREEMENT.md) for how we worked with our genAI teammate, and paste [docs/ONBOARDING-PROMPT.md](docs/ONBOARDING-PROMPT.md) into a fresh AI chat to bring it up to speed.

## Product Vision

**For:**  
College students, travelers, home-gym users, and beginner to intermediate gym-goers.

**Who:**  
Want to stay consistent with their fitness goals but may face limited time, unavailable equipment, or changing workout conditions.

**PivotFit is:**  
An adaptive workout and fitness tracking web application.

**That:**  
Allows users to create, track, and adjust workouts while preserving the original workout goal, muscle groups, and movement patterns.

**Unlike:**  
Traditional fitness tracking applications that assume users can complete their planned workout exactly as written.

**Our product:**  
Helps users adapt instead of abandoning their workout by recommending appropriate exercise substitutions and adjustments based on their current situation.

## Primary Stakeholders

- College students
- Travelers
- Home-gym users
- Beginner and intermediate gym-goers
- People exercising in crowded gyms
- People with limited workout time or equipment

## What Makes PivotFit Different?

PivotFit is designed to help users **adapt their workout in real time when their original plan is no longer possible**.

For example, if a user is scheduled to perform a barbell bench press but all of the benches are occupied, PivotFit can quickly suggest appropriate alternatives, such as a dumbbell press or another comparable movement. The user can select an alternative and continue their workout without losing the original purpose of the exercise.

Rather than simply suggesting another exercise, PivotFit aims to recommend alternatives based on factors such as:

- Muscle group
- Movement pattern
- Available equipment
- Exercise difficulty
- Available workout time
- Original workout goal

The goal is simple: **adapt instead of abandon.**

## What Works vs. What's Stubbed Out

Status as of the `wrap-up-submission` tag (November 2026). Issue numbers refer to this repository's GitHub issues.

### Works

| Area | What it does | Where |
|---|---|---|
| Accounts | Sign up, email confirmation, log in, "Remember me", forgot/reset password, log out, delete account | `src/pages/Login.jsx`, `Signup.jsx`, `Profile.jsx`; `supabase/migrations/` |
| Bot protection | Cloudflare Turnstile captcha on signup, login and password reset (enforced server-side by Supabase) | `src/components/Captcha.jsx`, `src/lib/captcha.js` |
| Onboarding | Experience level → location (home / commercial gym / private gym) → weekly availability (time slot + 30–90 min per day) → generated weekly plan (Full Body, Push/Pull/Legs, Upper/Lower) | `src/pages/Onboarding.jsx`, `src/lib/training.js` |
| Starter workout (US-01) | Pick a goal, minutes (10–120) and equipment; generates a deterministic workout. Preview only | `src/components/workout/StarterWorkout.jsx`, `src/lib/starterWorkout.js` |
| Active workout | Preview → log sets/reps/weight with validation → finish → rate exercises → save | `src/pages/Workout.jsx`, `src/components/workout/` |
| **Swap (the core "pivot")** | Swap button or press-and-hold on any exercise; offers up to 3 alternatives with the same movement pattern and available equipment | `src/components/workout/SwapPanel.jsx`, `swapOptions()` in `src/lib/training.js` |
| Workout recovery | An unfinished workout is saved and can be resumed or discarded | `src/pages/Workout.jsx` |
| Progress | Month calendar (done / made up / planned / missed / rest) with current and best streak | `src/pages/Progress.jsx`, `src/lib/calendar.js` |
| Mobile + accessibility | Tested at 320–390 px and in WebKit; WCAG 2.2 AA (axe-core: 0 violations across 19 pages and states) | `src/App.css`, `src/hooks/usePageTitle.js` |
| Security | CSP, anti-framing, HSTS and other headers via `serve.json`; `npm audit` clean | `serve.json`, `package.json` |

### Stubbed out or partial

- **Workout data lives in the browser, not the database.** Profiles, plans, history, ratings and the active workout are in `localStorage`, namespaced by user id (`src/lib/userData.js`). Only the account and consent record (`profiles` table) are in Supabase. Data does not follow a user to another device.
- **The starter workout is preview only.** It can't be saved or started, and it isn't connected to the weekly plan (#17–#19 / US-01 #6).
- **Not built:** the "Change plans" pivot flow (#20–#22, US-02), shortening a workout when time runs out (#26–#28, US-04), workout history list/details (#33, #34), exercise-level progress charts (#35, #37, #38), saved profile preferences (#39–#41), and marking individual sets complete (#30).
- **Exercise catalog is small and hand-curated** (`src/data/exercises.js`). Equipment lists per location are reasonable guesses, not validated with users.
- **Dev-only login bypass** (`src/lib/devAuth.js`): when Supabase isn't configured, you're signed in as a fake user with a yellow banner. It is stripped from production builds.

## Tech Stack

React 19 + Vite, React Router, plain CSS, Supabase (auth + Postgres), Cloudflare Turnstile, `serve` for production hosting on Railway. Tests use Node's built-in test runner (no extra dependencies).

## Running the Project Locally

Requires Node.js 20+.

    git clone https://github.com/PivotFit/PivotFit.git
    cd PivotFit
    npm install
    npm run dev

Open the local URL Vite prints (usually http://localhost:5173). **Without a `.env.local`, the app starts in dev mode** with a fake signed-in user, so you can work on every page without Supabase.

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm test` | Unit tests (`src/lib/*.test.js`: workout generation, streaks, log validation) |
| `npm run lint` | ESLint |
| `npm run build` | Production build into `dist/` |
| `npm start` | Serves `dist/` with the security headers in `serve.json` (what Railway runs) |

## Authentication Setup (Supabase)

PivotFit uses [Supabase](https://supabase.com) for user accounts. One team member owns the Supabase project; everyone else only needs the URL and publishable key.

1. **Create a Supabase project** at https://supabase.com/dashboard.
2. **Run the database migration:** open **SQL Editor**, paste `supabase/migrations/20261008000000_profiles_and_account_deletion.sql`, and run it. This creates the `profiles` table, the signup trigger, and the `delete_account()` function.
3. **Configure auth URLs** in **Authentication > URL Configuration**:
   - **Site URL:** `https://pivotfit-production.up.railway.app`
   - **Redirect URLs:** `http://localhost:5173/**` and `https://pivotfit-production.up.railway.app/**`
4. **Email:** Supabase's built-in sender only reaches members of the Supabase org. The project uses Gmail SMTP from the team account (**Authentication > Emails > SMTP Settings**, `smtp.gmail.com`, port 587, Gmail app password). Keep **Authentication > Rate Limits** modest (about 30 emails/hour).
5. **Password policy:** **Authentication > Providers > Email**, minimum length 8 (the signup form also enforces this).
6. **Captcha (optional):** in **Authentication > Attack Protection**, enable Cloudflare Turnstile with the *secret* key; put the *site* key in `VITE_TURNSTILE_SITE_KEY`.
7. **Local environment:** copy `.env.example` to `.env.local` and fill in the values from **Project Settings > API Keys**. Use the *publishable* key, **never** the secret/service_role key. `.env.local` is gitignored.

## Deployment (Railway)

The Railway service deploys `main` automatically: it runs `npm run build`, then `npm start`.

- **Variables** (set before the build, since Vite bakes them in): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_TURNSTILE_SITE_KEY`.
- **GitHub access:** Railway's GitHub app must be installed on the **PivotFit** organization with access to this repo. Only org owners can install it. If Railway shows "Could not load branches / Auto deploy unavailable", that access is missing.
- **Don't click "Eject"** in Railway's source settings: it forks the repo instead of fixing the connection.
- An older Vercel deployment (https://pivot-fit.vercel.app) still responds but is not maintained. See [docs/HANDOFF.md](docs/HANDOFF.md).

## Legal Pages

The Terms of Service (`/terms`) and Privacy Policy (`/privacy`) are drafts and are not legal advice. Contact email, governing state and version live in `src/lib/legal.js`. When either document changes, bump `TERMS_VERSION` so each user's accepted version is recorded. If you add a third-party service (fonts, analytics, a new host), add it to the Privacy Policy.

## Contributing

Work from GitHub issues (user stories `US-xx` with task issues underneath). Branch per feature, open a PR to `main`, and close an issue only after checking every acceptance criterion. Run `npm run lint`, `npm test` and `npm run build` before pushing.
