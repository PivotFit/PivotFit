import { useState } from "react";
import { dateKey, dayStatus, monthSummary, monthWeeks } from "../../lib/calendar";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const STATUS = {
  done: { label: "Workout done", mark: "✓" },
  "made-up": { label: "Planned workout done another day this week", mark: "✓" },
  missed: { label: "Planned workout missed", mark: "•" },
  planned: { label: "Workout planned", mark: "" },
  rest: { label: "Rest day", mark: "" },
  none: { label: "Before you started", mark: "" },
};

function StreakCalendar({ tracker }) {
  const [month, setMonth] = useState(() => ({
    year: tracker.today.getFullYear(),
    month: tracker.today.getMonth(),
  }));

  const isCurrentMonth =
    month.year === tracker.today.getFullYear() && month.month === tracker.today.getMonth();
  const title = new Date(month.year, month.month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const summary = monthSummary(month.year, month.month, tracker);
  const todayKey = dateKey(tracker.today);

  function shift(delta) {
    const next = new Date(month.year, month.month + delta, 1);
    setMonth({ year: next.getFullYear(), month: next.getMonth() });
  }

  return (
    <section className="workout-card calendar-card" aria-labelledby="calendar-title">
      <div className="calendar-header">
        <button type="button" className="calendar-nav" onClick={() => shift(-1)} aria-label="Previous month">
          ‹
        </button>
        <h2 id="calendar-title" aria-live="polite">
          {title}
        </h2>
        <button
          type="button"
          className="calendar-nav"
          onClick={() => shift(1)}
          disabled={isCurrentMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <table className="calendar-grid">
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th key={day} scope="col">
                <abbr title={day}>{day[0]}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthWeeks(month.year, month.month).map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => {
                if (!day) return <td key={j} />;
                const status = dayStatus(day, tracker);
                const isToday = dateKey(day) === todayKey;
                const label = `${day.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}${isToday ? " (today)" : ""}: ${STATUS[status].label}`;
                return (
                  <td key={j}>
                    <div
                      className={`cal-day ${status}${isToday ? " today" : ""}`}
                      role="img"
                      aria-label={label}
                      title={label}
                    >
                      <span>{day.getDate()}</span>
                      <span className="cal-mark" aria-hidden="true">
                        {STATUS[status].mark}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="calendar-summary">
        <strong>{summary.workouts}</strong> {summary.workouts === 1 ? "workout" : "workouts"} ·{" "}
        <strong>{summary.restDays}</strong> rest {summary.restDays === 1 ? "day" : "days"}
        {summary.missed > 0 && (
          <>
            {" "}· <strong>{summary.missed}</strong> missed
          </>
        )}
        {isCurrentMonth && " so far"}
      </p>

      <ul className="calendar-legend" aria-label="Legend">
        <li><span className="cal-swatch done" aria-hidden="true" />Done</li>
        <li><span className="cal-swatch made-up" aria-hidden="true" />Made up that week</li>
        <li><span className="cal-swatch planned" aria-hidden="true" />Planned</li>
        <li><span className="cal-swatch missed" aria-hidden="true" />Missed</li>
        <li><span className="cal-swatch rest" aria-hidden="true" />Rest day</li>
      </ul>
    </section>
  );
}

export default StreakCalendar;
