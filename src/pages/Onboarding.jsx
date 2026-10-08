import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCATIONS } from "../data/exercises";
import { useUserData } from "../hooks/useUserData";
import {
  DAY_TYPES,
  DAYS,
  DAYS_BY_KEY,
  DEFAULT_DURATION,
  DURATIONS,
  EXPERIENCE_LEVELS,
  MAX_TRAINING_DAYS,
  TIME_SLOTS,
  buildPlan,
} from "../lib/training";

const STEPS = ["Experience", "Where", "Availability", "Your plan"];

function Onboarding() {
  const navigate = useNavigate();
  const [profile, setProfile] = useUserData("profile", null);
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState(profile?.experience ?? null);
  const [location, setLocation] = useState(profile?.location ?? null);
  const [schedule, setSchedule] = useState(profile?.schedule ?? {});
  const [scheduleNote, setScheduleNote] = useState("");

  const trainingDayCount = Object.keys(schedule).length;
  const canContinue = [
    experience !== null,
    location !== null,
    trainingDayCount > 0,
    true,
  ][step];

  function toggleSlot(dayKey, slot) {
    setScheduleNote("");
    const current = schedule[dayKey];

    if (current?.slot === slot) {
      const next = { ...schedule };
      delete next[dayKey];
      setSchedule(next);
      return;
    }

    if (!current && trainingDayCount >= MAX_TRAINING_DAYS) {
      setScheduleNote(
        `Pick up to ${MAX_TRAINING_DAYS} days. At least one rest day helps you recover.`,
      );
      return;
    }

    setSchedule({
      ...schedule,
      [dayKey]: { slot, minutes: current?.minutes ?? DEFAULT_DURATION },
    });
  }

  function setMinutes(dayKey, minutes) {
    setSchedule({ ...schedule, [dayKey]: { ...schedule[dayKey], minutes } });
  }

  function handleSave() {
    setProfile({ experience, location, schedule, updatedAt: new Date().toISOString() });
    navigate("/plan");
  }

  return (
    <main className="dashboard onboarding">
      <ol className="stepper" aria-label="Setup progress">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={i === step ? "current" : i < step ? "complete" : ""}
            aria-current={i === step ? "step" : undefined}
          >
            {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section>
          <p className="eyebrow">STEP 1 OF 4</p>
          <h1 className="page-title">What's your experience?</h1>
          <p className="page-subtitle">
            Your sets, reps, and effort targets are tailored to your level.
          </p>

          <div className="choice-grid choice-grid-4" role="radiogroup" aria-label="Experience level">
            {Object.entries(EXPERIENCE_LEVELS).map(([key, level]) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={experience === key}
                className="choice-card"
                onClick={() => setExperience(key)}
              >
                <span className="choice-dot" aria-hidden="true" />
                <strong>{level.label}</strong>
                <span>{level.years}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section>
          <p className="eyebrow">STEP 2 OF 4</p>
          <h1 className="page-title">Where do you train?</h1>
          <p className="page-subtitle">
            We only recommend exercises that fit the equipment you'll have.
          </p>

          <div className="choice-grid choice-grid-3" role="radiogroup" aria-label="Training location">
            {Object.entries(LOCATIONS).map(([key, place]) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={location === key}
                className="choice-card"
                onClick={() => setLocation(key)}
              >
                <strong>{place.label}</strong>
                <span>{place.description}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <p className="eyebrow">STEP 3 OF 4</p>
          <h1 className="page-title">When can you train?</h1>
          <p className="page-subtitle">
            Tap the time of day you're free on each day you want to train, then
            choose how long you have.
          </p>

          <div className="availability-scroll">
            <table className="availability-grid">
              <thead>
                <tr>
                  <td />
                  {DAYS.map((day) => (
                    <th key={day.key} scope="col">
                      <abbr title={day.label}>{day.short}</abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot.key}>
                    <th scope="row">{slot.label}</th>
                    {DAYS.map((day) => {
                      const selected = schedule[day.key]?.slot === slot.key;
                      return (
                        <td key={day.key}>
                          <button
                            type="button"
                            className="slot-button"
                            aria-pressed={selected}
                            aria-label={`${day.label} ${slot.label}`}
                            onClick={() => toggleSlot(day.key, slot.key)}
                          >
                            {selected ? "✓" : ""}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {scheduleNote && <p className="form-note" role="status">{scheduleNote}</p>}

          {trainingDayCount > 0 && (
            <div className="duration-list">
              <p className="eyebrow">HOW LONG DO YOU HAVE?</p>
              {DAYS.filter((day) => schedule[day.key]).map((day) => (
                <div key={day.key} className="duration-row">
                  <span>
                    <strong>{day.label}</strong>{" "}
                    <span className="muted">
                      · {TIME_SLOTS.find((s) => s.key === schedule[day.key].slot).label}
                    </span>
                  </span>
                  <div className="segmented" role="radiogroup" aria-label={`${day.label} duration`}>
                    {DURATIONS.map((minutes) => (
                      <button
                        key={minutes}
                        type="button"
                        role="radio"
                        aria-checked={schedule[day.key].minutes === minutes}
                        onClick={() => setMinutes(day.key, minutes)}
                      >
                        {minutes} min
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {step === 3 && (
        <section>
          <p className="eyebrow">STEP 4 OF 4</p>
          <h1 className="page-title">Your weekly plan</h1>
          <p className="page-subtitle">
            Based on {trainingDayCount} training {trainingDayCount === 1 ? "day" : "days"} a
            week at {LOCATIONS[location].label.toLowerCase()} for a{" "}
            {EXPERIENCE_LEVELS[experience].label.toLowerCase()}.
          </p>

          <ul className="plan-list">
            {buildPlan({ experience, location, schedule }).map((entry) => (
              <li key={entry.day} className="plan-row">
                <strong>{DAYS_BY_KEY[entry.day].label}</strong>
                <span>{DAY_TYPES[entry.type].label}</span>
                <span className="muted">
                  {TIME_SLOTS.find((s) => s.key === entry.slot).label} · {entry.minutes} min
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="step-actions">
        {step > 0 && (
          <button type="button" className="secondary-button" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            className="primary-button"
            disabled={!canContinue}
            onClick={() => setStep(step + 1)}
          >
            Continue
          </button>
        ) : (
          <button type="button" className="primary-button" onClick={handleSave}>
            Save plan
          </button>
        )}
      </div>
    </main>
  );
}

export default Onboarding;
