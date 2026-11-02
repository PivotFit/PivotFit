import { DAYS, DAY_TYPES } from "../../lib/training";
import { addDays, createTracker, dateKey, dayStatus, startOfDay } from "../../lib/calendar";

// Same statuses as the Progress calendar, so both pages agree on what a day means.
const STATUS = {
  done: { label: "Workout done", mark: "✓" },
  "made-up": { label: "Done another day this week", mark: "✓" },
  missed: { label: "Missed", mark: "•" },
  planned: { label: "Planned", mark: "" },
  rest: { label: "Rest day", mark: "" },
  none: { label: "Before you started", mark: "" },
};

// The current week (Sunday–Saturday) as a row of days: which ones are planned,
// which were completed, and where today is.
function WeekStrip({ profile, plan, history, now }) {
  const tracker = createTracker({
    schedule: profile.schedule,
    history,
    planCreatedAt: profile.updatedAt,
    today: now,
  });
  const weekStart = addDays(startOfDay(now), -now.getDay());
  const today = dateKey(now);

  const days = DAYS.map((day, i) => {
    const date = addDays(weekStart, i);
    const planned = plan.find((p) => p.day === day.key);
    return {
      key: day.key,
      short: day.short,
      label: day.label,
      date,
      // "Push Day" -> "Push", to fit under each day.
      type: planned ? DAY_TYPES[planned.type].label.split(" ")[0] : "Rest",
      status: dayStatus(date, tracker),
      isToday: dateKey(date) === today,
    };
  });

  const range = `${days[0].date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} – ${days[6].date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;

  return (
    <section className="workout-card week-card" aria-labelledby="week-title">
      <div className="week-card-header">
        <p className="eyebrow" id="week-title">THIS WEEK</p>
        <span className="week-range">{range}</span>
      </div>

      <ol className="week-strip">
        {days.map((day) => (
          <li
            key={day.key}
            className={`week-day ${day.status}${day.isToday ? " today" : ""}`}
            title={`${day.label}: ${STATUS[day.status].label}`}
          >
            <span className="week-day-name" aria-hidden="true">{day.short}</span>
            <span className="week-day-date" aria-hidden="true">{day.date.getDate()}</span>
            <span className="week-day-mark" aria-hidden="true">{STATUS[day.status].mark}</span>
            <span className="week-day-type" aria-hidden="true">{day.type}</span>
            <span className="sr-only">
              {day.label} {day.date.getDate()}
              {day.isToday ? " (today)" : ""}: {day.type === "Rest" ? "" : `${day.type}, `}
              {STATUS[day.status].label}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default WeekStrip;