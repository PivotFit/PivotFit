import { useState } from "react";
import { Link } from "react-router-dom";
import { EXERCISES_BY_ID, LOCATIONS } from "../data/exercises";
import { useUserData } from "../hooks/useUserData";
import {
  DAY_TYPES,
  DAYS,
  EXPERIENCE_LEVELS,
  TIME_SLOTS,
  buildPlan,
  buildWorkout,
  todayKey,
} from "../lib/training";
import SetupPrompt from "../components/SetupPrompt";

function Plan() {
  const [profile] = useUserData("profile", null);
  const [ratings] = useUserData("ratings", {});
  const [now] = useState(() => new Date());

  if (!profile) {
    return (
      <main className="dashboard">
        <SetupPrompt />
      </main>
    );
  }

  const plan = buildPlan(profile);
  const today = todayKey(now);

  return (
    <main className="dashboard">
      <section className="welcome page-header">
        <div>
          <p className="eyebrow">WEEKLY PLAN</p>
          <h1>Your workouts</h1>
          <p>
            {EXPERIENCE_LEVELS[profile.experience].label} ·{" "}
            {LOCATIONS[profile.location].label} · {plan.length} days a week
          </p>
        </div>
        <Link to="/onboarding" className="secondary-button">
          Edit preferences
        </Link>
      </section>

      <div className="week-list">
        {DAYS.map((day) => {
          const entry = plan.find((p) => p.day === day.key);
          const isToday = day.key === today;

          if (!entry) {
            return (
              <article key={day.key} className="day-card rest">
                <div className="day-card-header">
                  <h2>{day.label}</h2>
                  {isToday && <span className="status-badge">Today</span>}
                </div>
                <p className="muted">Rest day</p>
              </article>
            );
          }

          const workout = buildWorkout(profile, entry, ratings);
          return (
            <article key={day.key} className={isToday ? "day-card today" : "day-card"}>
              <div className="day-card-header">
                <div>
                  <h2>{day.label}</h2>
                  <p className="day-card-type">
                    {DAY_TYPES[entry.type].label} ·{" "}
                    {TIME_SLOTS.find((s) => s.key === entry.slot).label} · {entry.minutes} min
                  </p>
                </div>
                {isToday && <span className="status-badge">Today</span>}
              </div>

              <ul className="exercise-preview">
                {workout.exercises.map((item) => (
                  <li key={item.exerciseId}>
                    <span>{EXERCISES_BY_ID[item.exerciseId].name}</span>
                    <span className="muted">
                      {item.sets} × {item.reps}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to={`/workout/${day.key}`} className="primary-button">
                Start workout
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default Plan;
