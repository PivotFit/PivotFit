import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useUserData } from "../hooks/useUserData";
import {
  DAY_TYPES,
  TIME_SLOTS,
  buildPlan,
  buildWorkout,
  nextPlanDay,
  todayKey,
  weekStats,
} from "../lib/training";
import SetupPrompt from "../components/SetupPrompt";
import WeekStrip from "../components/dashboard/WeekStrip";

function isSameDay(a, b) {
  return a.toDateString() === b.toDateString();
}

function Dashboard() {
  usePageTitle("Home");
  const [profile] = useUserData("profile", null);
  const [ratings] = useUserData("ratings", {});
  const [history] = useUserData("history", []);
  const [session] = useUserData("activeSession", null);
  const [now] = useState(() => new Date());

  const welcome = (
    <section className="welcome">
      <p className="eyebrow">DASHBOARD</p>
      <h1>Ready to train?</h1>
      <p>Stay on track, adjust when you need to, and keep moving forward.</p>
    </section>
  );

  if (!profile) {
    return (
      <main className="dashboard">
        {welcome}
        <SetupPrompt />
      </main>
    );
  }

  const plan = buildPlan(profile);
  const doneToday = history.some(
    (h) => h.day === todayKey(now) && isSameDay(new Date(h.date), now),
  );
  const featured = nextPlanDay(plan, now, { skipToday: doneToday });
  const stats = weekStats(history, plan, now);

  return (
    <main className="dashboard">
      {welcome}

      {session ? (
        <section className="workout-card hero-card">
          <div className="workout-card-header">
            <div>
              <p className="eyebrow">IN PROGRESS</p>
              <h2>{DAY_TYPES[session.type].label}</h2>
            </div>
            <span className="status-badge">Active</span>
          </div>
          <div className="workout-meta">
            <span>
              {session.exercises.filter((e) => e.done || e.skipped).length} of{" "}
              {session.exercises.length} exercises finished
            </span>
          </div>
          <Link to={`/workout/${session.day}`} className="primary-button">
            Resume Workout
          </Link>
        </section>
      ) : (
        featured && (
          <section className="workout-card hero-card">
            <div className="workout-card-header">
              <div>
                <p className="eyebrow">
                  {featured.when === "Today" ? "TODAY'S WORKOUT" : `NEXT WORKOUT · ${featured.when.toUpperCase()}`}
                </p>
                <h2>{DAY_TYPES[featured.type].label}</h2>
              </div>
              <span className="status-badge">{doneToday ? "Done today ✓" : "Scheduled"}</span>
            </div>

            <div className="workout-meta">
              <span>{buildWorkout(profile, featured, ratings).exercises.length} exercises</span>
              <span>•</span>
              <span>~{featured.minutes} min</span>
              <span>•</span>
              <span>{TIME_SLOTS.find((s) => s.key === featured.slot).label}</span>
            </div>

            <Link to={`/workout/${featured.day}`} className="primary-button">
              Start Workout
            </Link>
          </section>
        )
      )}

              <section className="workout-card consistency-card" aria-labelledby="consistency-title">
        <div className="consistency-header">
          <p className="eyebrow" id="consistency-title">CONSISTENCY</p>
          <strong>{stats.consistency}%</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-labelledby="consistency-title"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stats.consistency}
          aria-valuetext={`${stats.consistency}%, ${stats.completed} of ${stats.planned} workouts this week`}
        >
          <div className="progress-fill" style={{ width: `${stats.consistency}%` }} />
        </div>
        <p className="consistency-note">
          {stats.completed} of {stats.planned} planned {stats.planned === 1 ? "workout" : "workouts"} done
          this week
        </p>
      

      <WeekStrip profile={profile} plan={plan} history={history} now={now} />
      </section>

      <p className="dashboard-footnote">
        <Link to="/plan">See your full week →</Link>
      </p>
    </main>
  );
}

export default Dashboard;
