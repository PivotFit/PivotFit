# PivotFit

**Adaptive Workout & Fitness Tracking Web Application**

## Live Application

PivotFit is currently deployed as a live web application.

**Live Site:** https://pivot-fit.vercel.app/

The application is under active development and will continue to evolve throughout the semester.

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

## Core Features

- Create and save workouts
- Start and complete active workout sessions
- Record exercises, sets, reps, and weight
- Recommend exercise substitutions when equipment is unavailable
- Adjust workouts when available workout time changes
- Track workout history and personal progress
- Display progress through a simple dashboard
- Track whether the primary goal of the original workout was still achieved
- Responsive design for desktop and mobile devices
- Clear, accessible, and user-friendly navigation

## Project Goal

The goal of PivotFit is to create a responsive and accessible fitness application that goes beyond simply recording workouts. PivotFit helps users continue training when real-world circumstances interfere with their original plan by providing practical alternatives that preserve the intent of the workout as closely as possible.

## Development

PivotFit is being developed as a team project using:

- React
- Vite
- JavaScript
- CSS
- Git and GitHub
- Vercel

Development follows a collaborative Git workflow where features and changes are developed on separate branches, reviewed through pull requests, and merged into the `main` branch.

Changes merged into `main` are deployed to the live application through Vercel.

## Running the Project Locally

Clone the repository and install the project dependencies:

    git clone https://github.com/dgreen81-MSU/PivotFit.git
    cd PivotFit
    npm install

Start the development server:

    npm run dev

Then open the local URL provided by Vite in your browser.

## Authentication Setup (Supabase)

PivotFit uses [Supabase](https://supabase.com) for user accounts and data storage. One team member creates the Supabase project; everyone else only needs the URL and publishable key.

1. **Create a Supabase project** at https://supabase.com/dashboard.
2. **Run the database migration:** open **SQL Editor** in the Supabase dashboard, paste the contents of `supabase/migrations/20261008000000_profiles_and_account_deletion.sql`, and run it. This creates the `profiles` table, the signup trigger, and the `delete_account()` function.
3. **Configure auth URLs:** in **Authentication > URL Configuration**:
   - Set **Site URL** to `https://pivot-fit.vercel.app`
   - Add these **Redirect URLs**:
     - `http://localhost:5173/**`
     - `https://pivot-fit.vercel.app/**`
4. **Set local environment variables:** copy `.env.example` to `.env.local` and fill in the values from **Project Settings > API Keys**. Use the *publishable* (or legacy *anon*) key, **never** the secret/service_role key. `.env.local` is gitignored.
5. **Set Vercel environment variables:** add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the Vercel project settings, then redeploy.

Email confirmation is on by default in Supabase, so new users must click the link in their email before logging in. Supabase's built-in email sender is rate-limited and meant for development. Configure a custom SMTP provider before real users sign up.

### Legal pages

The Terms of Service (`/terms`) and Privacy Policy (`/privacy`) are drafts and are not legal advice. Before launch, update the placeholders in `src/lib/legal.js` (contact email, governing state). When either document changes, bump `TERMS_VERSION` so each user's accepted version is recorded correctly.

## Current Status

PivotFit is in active development. The current version establishes the initial application structure and user interface. Features will be implemented and refined incrementally throughout the semester as the team continues development.