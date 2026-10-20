import { useState } from "react";
import { EQUIPMENT, GOALS, durationError, generateStarterWorkout } from "../../lib/starterWorkout";

function StarterWorkout() {
  const [goal, setGoal] = useState("general");
  const [minutes, setMinutes] = useState("45");
  const [equipment, setEquipment] = useState(["bodyweight"]);
  const [workout, setWorkout] = useState(null);
  const error = durationError(minutes);
  const changed = workout && (goal !== workout.goal || Number(minutes) !== workout.minutes ||
    equipment.join() !== workout.equipment.join());

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
      <button type="button" className="primary-button" disabled={Boolean(error)}
        onClick={() => setWorkout(generateStarterWorkout({ goal, minutes, equipment }))}>
        Generate Workout
      </button>
      <div aria-live="polite" aria-atomic="true">
        {!workout ? <p>Choose your setup, then generate your starter workout.</p> : (
          <>
            <h3>{GOALS[workout.goal]} · {workout.minutes} minutes</h3>
            <p>Equipment: {workout.equipment.map((item) => EQUIPMENT[item]).join(", ") || "None selected"}</p>
            {changed && <p>Setup changed. Select Generate Workout to update this plan.</p>}
            {workout.exercises.length === 0 ? (
              <p>No compatible exercises found. Select Bodyweight or add available equipment and generate again.</p>
            ) : (
              <ol className="program-list">
                {workout.exercises.map((exercise) => (
                  <li className="program-item" key={exercise.id}>
                    <strong>{exercise.name}</strong>
                    <p>{exercise.sets} sets × {exercise.reps} reps</p>
                  </li>
                ))}
              </ol>
            )}
            <p className="muted">Workload uses estimated work and rest time with five minutes reserved for warm-up. Adjust your pace as needed.</p>
          </>
        )}
      </div>
    </section>
  );
}

export default StarterWorkout;
