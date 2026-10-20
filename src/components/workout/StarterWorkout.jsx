import { useState } from "react";
import { EQUIPMENT, durationError } from "../../lib/starterWorkout";

const GOALS = {
  strength: "Strength",
  hypertrophy: "Hypertrophy",
  general: "General Fitness",
};

function StarterWorkout() {
  const [goal, setGoal] = useState("general");
  const [minutes, setMinutes] = useState("45");
  const [equipment, setEquipment] = useState(["bodyweight"]);
  const error = durationError(minutes);

  function toggleEquipment(value) {
    setEquipment((current) => current.includes(value)
      ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <section className="workout-card starter-workout" aria-labelledby="starter-title">
      <p className="eyebrow">WORKOUT SETUP</p>
      <h2 id="starter-title">Create a starter workout</h2>
      <fieldset>
        <legend>Fitness goal</legend>
        <div className="starter-options">
          {Object.entries(GOALS).map(([value, label]) => (
            <label key={value} className="starter-option">
              <input type="radio" name="fitness-goal" value={value}
                checked={goal === value} onChange={() => setGoal(value)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <p>Selected goal: <strong>{GOALS[goal]}</strong></p>
      <label htmlFor="starter-minutes">Available time (minutes)</label>
      <input id="starter-minutes" className="starter-minutes" type="number"
        min="10" max="120" step="1" value={minutes}
        aria-invalid={Boolean(error)} aria-describedby="starter-duration-help"
        onChange={(event) => setMinutes(event.target.value)} />
      <p id="starter-duration-help" role={error ? "alert" : undefined}>
        {error || "Choose 10–120 minutes, including time for warm-up and rest."}
      </p>
      <fieldset>
        <legend>Available equipment</legend>
        <p>Select only Bodyweight for a workout without equipment.</p>
        <div className="starter-options">
          {Object.entries(EQUIPMENT).map(([value, label]) => (
            <label key={value} className="starter-option">
              <input type="checkbox" checked={equipment.includes(value)}
                onChange={() => toggleEquipment(value)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}

export default StarterWorkout;
