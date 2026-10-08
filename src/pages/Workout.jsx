import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { EXERCISES_BY_ID } from "../data/exercises";
import { useUserData } from "../hooks/useUserData";
import {
  DAYS_BY_KEY,
  buildPlan,
  buildWorkout,
  nextPlanDay,
  prescriptionFor,
  swapOptions,
  workoutTitle,
} from "../lib/training";
import SetupPrompt from "../components/SetupPrompt";
import ExerciseCard from "../components/workout/ExerciseCard";
import SwapPanel from "../components/workout/SwapPanel";
import WorkoutSummary from "../components/workout/WorkoutSummary";

const RATING_LIMIT = 6;

function Workout() {
  const { day } = useParams();
  const navigate = useNavigate();
  const [profile] = useUserData("profile", null);
  const [ratings, setRatings] = useUserData("ratings", {});
  const [history, setHistory] = useUserData("history", []);
  const [session, setSession] = useUserData("activeSession", null);
  const [swapIndex, setSwapIndex] = useState(null);
  const [upNext, setUpNext] = useState(undefined);

  if (!profile) {
    return (
      <main className="dashboard">
        <SetupPrompt />
      </main>
    );
  }

  // Just saved: show the "up next" screen.
  if (upNext !== undefined) {
    return (
      <main className="dashboard">
        <section className="workout-card summary">
          <p className="eyebrow">WORKOUT SAVED</p>
          <h1 className="page-title">Nice work 💪</h1>
          {upNext ? (
            <>
              <p className="muted">Up next</p>
              <h2>{workoutTitle(upNext)}</h2>
              <p className="muted">{upNext.when}</p>
            </>
          ) : (
            <p className="muted">No more workouts planned.</p>
          )}
          <Link to="/" className="primary-button">
            Back to dashboard
          </Link>
        </section>
      </main>
    );
  }

  // Only one workout can be in progress; send other days to it.
  if (session && session.day !== day) {
    return <Navigate to={`/workout/${session.day}`} replace />;
  }

  const plan = buildPlan(profile);
  const planDay = plan.find((p) => p.day === day);

  if (!session && !planDay) {
    return (
      <main className="dashboard">
        <section className="workout-card">
          <p className="eyebrow">REST DAY</p>
          <h2>No workout planned for {DAYS_BY_KEY[day]?.label ?? "this day"}</h2>
          <Link to="/plan" className="primary-button">
            See your weekly plan
          </Link>
        </section>
      </main>
    );
  }

  function updateExercise(index, changes) {
    setSession({
      ...session,
      exercises: session.exercises.map((e, i) => (i === index ? { ...e, ...changes } : e)),
    });
  }

  function handleStart() {
    const workout = buildWorkout(profile, planDay, ratings);
    setSession({
      ...workout,
      id: crypto.randomUUID(),
      startedAt: new Date().toISOString(),
      stage: "active",
      unavailableIds: [],
      ratings: {},
      exercises: workout.exercises.map((e) => ({
        ...e,
        log: { sets: "", reps: "", weight: "" },
        done: false,
        skipped: false,
        swappedFrom: null,
      })),
    });
  }

  function handlePickSwap(exerciseId) {
    const current = session.exercises[swapIndex];
    setSession({
      ...session,
      unavailableIds: [...session.unavailableIds, current.exerciseId],
      exercises: session.exercises.map((e, i) =>
        i === swapIndex
          ? {
              ...e,
              ...prescriptionFor(exerciseId, profile),
              exerciseId,
              swappedFrom: e.swappedFrom ?? e.exerciseId,
              log: { ...e.log, weight: "" },
            }
          : e,
      ),
    });
    setSwapIndex(null);
  }

  function handleSkip() {
    setSession({
      ...session,
      unavailableIds: [...session.unavailableIds, session.exercises[swapIndex].exerciseId],
      exercises: session.exercises.map((e, i) =>
        i === swapIndex ? { ...e, skipped: true, done: false } : e,
      ),
    });
    setSwapIndex(null);
  }

  function handleDiscard() {
    if (!window.confirm("End this workout without saving it?")) return;
    setSession(null);
    navigate("/plan");
  }

  function handleSave() {
    const finishedAt = new Date();
    setHistory([
      ...history,
      {
        id: session.id,
        date: finishedAt.toISOString(),
        day: session.day,
        type: session.type,
        minutes: session.minutes,
        exercises: session.exercises.map((e) => ({
          exerciseId: e.exerciseId,
          pattern: e.pattern,
          done: e.done,
          swappedFrom: e.swappedFrom,
          sets: e.log.sets,
          reps: e.log.reps,
          weight: e.log.weight,
          rating: session.ratings[e.exerciseId] ?? null,
        })),
      },
    ]);

    const nextRatings = { ...ratings };
    for (const [exerciseId, value] of Object.entries(session.ratings)) {
      const total = (nextRatings[exerciseId] ?? 0) + value;
      nextRatings[exerciseId] = Math.max(-RATING_LIMIT, Math.min(RATING_LIMIT, total));
    }
    setRatings(nextRatings);

    setSession(null);
    setUpNext(nextPlanDay(plan, finishedAt, { skipToday: true }));
  }

  // Not started yet: show the day's program with backups ready.
  if (!session) {
    const preview = buildWorkout(profile, planDay, ratings);
    return (
      <main className="dashboard workout-page">
        <section className="welcome">
          <p className="eyebrow">TODAY'S PROGRAM</p>
          <h1 className="page-title">{workoutTitle(planDay)}</h1>
          <p>{preview.exercises.length} exercises, each with backups ready if equipment is taken.</p>
        </section>

        <ol className="program-list">
          {preview.exercises.map((item) => (
            <li key={item.exerciseId} className="program-item">
              <div className="program-item-main">
                <strong>{EXERCISES_BY_ID[item.exerciseId].name}</strong>
                <span className="target">
                  {item.sets} × {item.reps}
                </span>
              </div>
              {item.backupIds.length > 0 && (
                <p className="backups muted">
                  Backups: {item.backupIds.map((id) => EXERCISES_BY_ID[id].name).join(", ")}
                </p>
              )}
            </li>
          ))}
        </ol>

        <button type="button" className="primary-button" onClick={handleStart}>
          Begin workout
        </button>
      </main>
    );
  }

  if (session.stage === "summary") {
    return (
      <main className="dashboard workout-page">
        <WorkoutSummary
          session={session}
          onRate={(exerciseId, value) =>
            setSession({ ...session, ratings: { ...session.ratings, [exerciseId]: value } })
          }
          onBack={() => setSession({ ...session, stage: "active" })}
          onSave={handleSave}
        />
      </main>
    );
  }

  const lastWeights = {};
  for (const entry of history) {
    for (const e of entry.exercises) {
      if (e.weight) lastWeights[e.exerciseId] = e.weight;
    }
  }
  const finishedCount = session.exercises.filter((e) => e.done || e.skipped).length;

  return (
    <main className="dashboard workout-page">
      <section className="welcome">
        <p className="eyebrow">IN PROGRESS</p>
        <h1 className="page-title">{workoutTitle(session)}</h1>
        <p>
          {finishedCount} of {session.exercises.length} exercises finished
        </p>
      </section>

      <div className="exercise-list">
        {session.exercises.map((item, index) => (
          <ExerciseCard
            key={`${index}-${item.exerciseId}`}
            item={item}
            backups={swapOptions(session, index, profile, ratings)}
            lastWeight={lastWeights[item.exerciseId]}
            onChange={(changes) => updateExercise(index, changes)}
            onSwap={() => setSwapIndex(index)}
          />
        ))}
      </div>

      <div className="step-actions">
        <button type="button" className="text-button" onClick={handleDiscard}>
          End without saving
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={() => setSession({ ...session, stage: "summary" })}
        >
          Finish workout
        </button>
      </div>

      {swapIndex !== null && (
        <SwapPanel
          item={session.exercises[swapIndex]}
          options={swapOptions(session, swapIndex, profile, ratings)}
          onPick={handlePickSwap}
          onSkip={handleSkip}
          onClose={() => setSwapIndex(null)}
        />
      )}
    </main>
  );
}

export default Workout;
