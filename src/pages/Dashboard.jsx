import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useUserData } from "../hooks/useUserData";
import { DAY_TYPES, TIME_SLOTS, buildPlan, buildWorkout, todayKey } from "../lib/training";
import { createTracker, currentStreak, bestStreak, dateKey } from "../lib/calendar";
import {
  HEAT_LEVELS,
  activityHeatmap,
  percentChange,
  upcomingSessions,
  weekComparison,
  weekStrip,
  weeklyCounts,
} from "../lib/dashboard";
import {
  ArrowUpRightIcon,
  BoltIcon,
  CalendarIcon,
  ChartIcon,
  CheckCircleIcon,
  ClockIcon,
  DumbbellIcon,
  FlameIcon,
  TargetIcon,
} from "../components/Icons";



function greetingFor(now)
{
  const hour = now.getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 18) return "Good afternoon,";
  return "Good evening,";
}


function slotLabel(key)
{
  return TIME_SLOTS.find((s) => s.key === key)?.label ?? "";
}


function relativeDay(offset, date)
{
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  return date.toLocaleDateString(undefined, { weekday: "long" });
}


function CardHeader({ icon: Icon, title, id, action })
{
  return (
    <div className="card-head">
      <span className="card-icon">
        <Icon size={18} />
      </span>
      <h2 id={id}>{title}</h2>
      {action}
    </div>
  );
}


function PillLink({ to, children, label })
{
  return (
    <Link to={to} className={children ? "pill-link" : "pill-link icon-only"} aria-label={label} title={label}>
      {children}
      <ArrowUpRightIcon size={14} />
    </Link>
  );
}


function Delta({ value, unit = "%", suffix = "from last week" })
{
  if (value === null) return <p className="delta">No data from last week yet</p>;
  const sign = value > 0 ? "+" : "";
  const tone = value > 0 ? "up" : value < 0 ? "down" : "flat";
  return (
    <p className="delta">
      <span className={`delta-value ${tone}`}>
        {sign}
        {value}
        {unit}
      </span>{" "}
      {suffix}
    </p>
  );
}


function StatTile({ area, icon, title, value, children, to = "/progress" })
{
  const id = `tile-${area}`;
  return (
    <article className={`bento-card stat-tile ${area}`} aria-labelledby={id}>
      <CardHeader icon={icon} title={title} id={id} action={<PillLink to={to} label={`${title} details`} />} />
      <strong className="tile-value">{value}</strong>
      {children}
    </article>
  );
}


function HeroCard({ profile, ratings, session, featured, doneToday })
{
  let eyebrow, title, meta, cta, to, progress;

  if (!profile)
  {
    eyebrow = "Get started";
    title = "Let's build your plan";
    meta = ["Tell us your experience, where you train, and when you're free."];
    cta = "Set up my plan";
    to = "/onboarding";
  } else if (session) {
    const finished = session.exercises.filter((e) => e.done || e.skipped).length;
    eyebrow = "In progress";
    title = DAY_TYPES[session.type].label;
    meta = [`${finished} of ${session.exercises.length} exercises finished`];
    progress = session.exercises.length ? finished / session.exercises.length : 0;
    cta = "Resume workout";
    to = `/workout/${session.day}`;
  } else if (featured) {
    eyebrow = featured.when === "Today" ? "Today's workout" : `Next up · ${featured.when}`;
    title = DAY_TYPES[featured.type].label;
    meta = [
      `${buildWorkout(profile, featured, ratings).exercises.length} exercises`,
      `~${featured.minutes} min`,
      slotLabel(featured.slot),
    ];
    cta = doneToday ? "Start early" : "Start workout";
    to = `/workout/${featured.day}`;
  } else {
    eyebrow = "Rest";
    title = "No workouts planned";
    meta = ["Add training days to your plan to see them here."];
    cta = "Edit my plan";
    to = "/onboarding";
  }

  return (
    <section className="bento-card hero-card b-hero" aria-labelledby="hero-title">
      
      <div className="hero-content">
        <p className="hero-eyebrow">
          {doneToday && !session ? <CheckCircleIcon size={16} /> : <BoltIcon size={16} />}
          {doneToday && !session ? "Today's workout done" : eyebrow}
        </p>
        <h2 id="hero-title">{title}</h2>
        <ul className="hero-meta">
          {meta.filter(Boolean).map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        {progress !== undefined && (
          <div
            className="hero-progress"
            role="progressbar"
            aria-label="Workout progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <span style={{ width: `${progress * 100}%` }} />
          </div>
        )}
        <Link to={to} className="hero-button">
          {cta}
        </Link>
      </div>
    </section>
  );
}


function WeeksCard({ history, now })
{
  const weeks = weeklyCounts(history, now, 8);
  const max = Math.max(1, ...weeks.map((w) => w.count));
  return (
    <section className="bento-card weeks-card b-weeks" aria-labelledby="weeks-title">
      <CardHeader
        icon={DumbbellIcon}
        title="Workouts"
        id="weeks-title"
        action={<PillLink to="/progress" label="Workout history">History</PillLink>}
      />
      <strong className="tile-value">{history.length}</strong>
      <p className="muted small">All-time sessions logged</p>
      <ol className="week-bars" aria-label="Workouts per week, last 8 weeks">
        {weeks.map((w, i) => {
          const current = i === weeks.length - 1;
          const label = `Week of ${w.start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}: ${w.count} ${w.count === 1 ? "workout" : "workouts"}`;
          return (
            <li key={i} className={current ? "current" : ""} title={label} aria-label={label}>
              <span className="bar" style={{ height: `${Math.max(6, (w.count / max) * 100)}%` }}>
                {current && <span className="bar-tip" aria-hidden="true">{w.count}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}


function CalendarCard({ plan, history, now, doneToday })
{
  const days = weekStrip(now);
  const planned = new Set(plan.map((p) => p.day));
  const trained = new Set(history.map((h) => dateKey(h.date)));
  const todayK = dateKey(now);
  const upcoming = upcomingSessions(plan, now, { count: 3, skipToday: doneToday });
  const month = now.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <section className="bento-card calendar-mini b-cal" aria-labelledby="cal-title">
      <h2 id="cal-title" className="cal-mini-title">{month}</h2>
      <ol className="day-strip">
        {days.map((d) => {
          const k = dateKey(d);
          const dayKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d.getDay()];
          const state = trained.has(k) ? "trained" : planned.has(dayKey) ? "planned" : "";
          const label = `${d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}${
            k === todayK ? " (today)" : ""
          }${state === "trained" ? ": workout done" : state === "planned" ? ": workout planned" : ""}`;
          return (
            <li key={k} className={`${k === todayK ? "today " : ""}${state}`} aria-label={label} title={label}>
              <span className="dow" aria-hidden="true">
                {d.toLocaleDateString(undefined, { weekday: "short" })}
              </span>
              <span className="dom" aria-hidden="true">{d.getDate()}</span>
              <span className="dot" aria-hidden="true" />
            </li>
          );
        })}
      </ol>

      {upcoming.length > 0 ? (
        <ul className="upcoming-list" aria-label="Upcoming workouts">
          {upcoming.map((s) => (
            <li key={dateKey(s.date)}>
              <Link to={`/workout/${s.day}`} className="upcoming-item">
                <span className="upcoming-title">{DAY_TYPES[s.type].label}</span>
                <span className="upcoming-sub">
                  {s.minutes} min · {slotLabel(s.slot)}
                </span>
                <span className="upcoming-when">
                  <ClockIcon size={14} />
                  {relativeDay(s.offset, s.date)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted small">Nothing planned yet.</p>
      )}

      <Link to="/plan" className="primary-button small-button">
        <CalendarIcon size={16} />
        View full week
      </Link>
    </section>
  );
}


function HeatmapCard({ history, now })
{
  const { dates, rows } = activityHeatmap(history, now, 12);
  return (
    <section className="bento-card heatmap-card b-heat" aria-labelledby="heat-title">
      <CardHeader
        icon={ChartIcon}
        title="Weekly activity"
        id="heat-title"
        action={<PillLink to="/progress" label="Activity details">View all</PillLink>}
      />
      <ul className="heat-legend" aria-label="Legend: sets per muscle group">
        {HEAT_LEVELS.slice(1).map((l) => (
          <li key={l.level}>
            <span className={`heat-swatch l${l.level}`} aria-hidden="true" />
            {l.label}
          </li>
        ))}
      </ul>
      <div className="heat-scroll">
        <table className="heatmap">
          <caption className="visually-hidden">Sets completed per muscle group, last 12 days</caption>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                {row.cells.map((cell) => {
                  const label = `${row.label}, ${cell.date.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}: ${cell.sets} ${cell.sets === 1 ? "set" : "sets"}`;
                  return (
                    <td key={dateKey(cell.date)}>
                      <span className={`heat-cell l${cell.level}`} title={label} aria-label={label} role="img" />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              {dates.map((d) => (
                <th key={dateKey(d)} scope="col" className={dateKey(d) === dateKey(now) ? "today" : ""}>
                  {d.getDate()}
                </th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}


function Dashboard()
{
  usePageTitle("Home");
  const [profile] = useUserData("profile", null);
  const [ratings] = useUserData("ratings", {});
  const [history] = useUserData("history", []);
  const [session] = useUserData("activeSession", null);
  const [now] = useState(() => new Date());

  const greeting = (
    <header className="home-greeting">
      <h1>
        <span>{greetingFor(now)}</span> what are we training today?
      </h1>
    </header>
  );

  if (!profile) {
    return (
      <main className="dashboard home">
        {greeting}
        <div className="bento bento-setup">
          <HeroCard profile={null} />
        </div>
      </main>
    );
  }

  const plan = buildPlan(profile);
  const doneToday = history.some((h) => h.day === todayKey(now) && dateKey(h.date) === dateKey(now));
  const [next] = upcomingSessions(plan, now, { count: 1, skipToday: doneToday });
  const featured = next && { ...next, when: relativeDay(next.offset, next.date) };

  const { current, previous } = weekComparison(history, plan.length, now);
  const tracker = createTracker({
    schedule: profile.schedule,
    history,
    planCreatedAt: profile.updatedAt,
    today: now,
  });
  const streak = currentStreak(tracker);
  const best = bestStreak(tracker);

  return (
    <main className="dashboard home">
      {greeting}

      <div className="bento">
        <WeeksCard history={history} now={now} />

        <HeroCard
          profile={profile}
          ratings={ratings}
          session={session}
          featured={featured}
          doneToday={doneToday}
        />

        <CalendarCard plan={plan} history={history} now={now} doneToday={doneToday} />

        <StatTile area="b-s1" icon={TargetIcon} title="This week" value={`${current.workouts}/${plan.length}`}>
          <Delta value={percentChange(current.workouts, previous.workouts)} />
        </StatTile>

        <StatTile area="b-s2" icon={CheckCircleIcon} title="Consistency" value={`${current.consistency}%`}>
          <Delta
            value={previous.workouts || current.workouts ? current.consistency - previous.consistency : null}
            unit=" pts"
          />
        </StatTile>

        <StatTile
          area="b-s3"
          icon={ClockIcon}
          title="Training time"
          value={current.minutes >= 60 ? `${(current.minutes / 60).toFixed(1)}h` : `${current.minutes}m`}
        >
          <Delta value={percentChange(current.minutes, previous.minutes)} />
        </StatTile>

        <StatTile area="b-s4" icon={FlameIcon} title="Streak" value={streak}>
          <p className="delta">
            {streak > 0 && streak === best ? (
              <span className="delta-value up">Personal best</span>
            ) : (
              <>
                Best: <span className="delta-value flat">{best}</span>
              </>
            )}{" "}
            planned in a row
          </p>
        </StatTile>

        <HeatmapCard history={history} now={now} />
      </div>
    </main>
  );
}

export default Dashboard;