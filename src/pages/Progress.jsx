import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useUserData } from "../hooks/useUserData";
import { bestStreak, createTracker, currentStreak } from "../lib/calendar";
import SetupPrompt from "../components/SetupPrompt";
import StreakCalendar from "../components/progress/StreakCalendar";

function Progress() {
  usePageTitle("Progress");
  const [profile] = useUserData("profile", null);
  const [history] = useUserData("history", []);
  const [now] = useState(() => new Date());

  const header = (
    <section className="welcome">
      <p className="eyebrow">PROGRESS</p>
      <h1>Stay consistent</h1>
      <p>Your streak counts planned workouts in a row. Rest days never break it.</p>
    </section>
  );

  if (!profile) {
    return (
      <main className="dashboard">
        {header}
        <SetupPrompt />
      </main>
    );
  }

  // Past days are judged against the current schedule; tracking starts at the
  // first saved workout or when the plan was saved, whichever came first.
  const tracker = createTracker({
    schedule: profile.schedule,
    history,
    planCreatedAt: profile.updatedAt,
    today: now,
  });
  const current = currentStreak(tracker);
  const best = bestStreak(tracker);

  return (
    <main className="dashboard">
      {header}

      <section className="dashboard-grid streak-stats">
        <article className="stat-card">
          <p className="eyebrow">CURRENT STREAK</p>
          <strong>{current}</strong>
          <span>
            {current > 0
              ? `Planned ${current === 1 ? "workout" : "workouts"} in a row`
              : "Finish your next planned workout to start one"}
          </span>
        </article>

        <article className="stat-card">
          <p className="eyebrow">BEST STREAK</p>
          <strong>{best}</strong>
          <span>{best > 0 && best === current ? "Your best run 🔥" : "Your longest run"}</span>
        </article>

        <article className="stat-card">
          <p className="eyebrow">TOTAL</p>
          <strong>{history.length}</strong>
          <span>{history.length === 1 ? "Workout completed" : "Workouts completed"}</span>
        </article>
      </section>

      <StreakCalendar tracker={tracker} />
    </main>
  );
}

export default Progress;
