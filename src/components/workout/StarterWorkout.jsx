import { useState } from "react";

const GOALS = {
  strength: "Strength",
  hypertrophy: "Hypertrophy",
  general: "General Fitness",
};

function StarterWorkout() {
  const [goal, setGoal] = useState("general");

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
    </section>
  );
}

export default StarterWorkout;
