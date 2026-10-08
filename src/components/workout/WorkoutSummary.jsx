import { EXERCISES_BY_ID } from "../../data/exercises";
import { RATINGS, workoutTitle } from "../../lib/training";

function WorkoutSummary({ session, onRate, onSave, onBack }) {
  const done = session.exercises.filter((e) => e.done);
  const skipped = session.exercises.filter((e) => !e.done);
  const swaps = session.exercises.filter((e) => e.done && e.swappedFrom).length;

  return (
    <section className="workout-card summary">
      <p className="eyebrow">SUMMARY</p>
      <h1 className="page-title">{workoutTitle(session)}</h1>

      <p className="goal-kept">
        <strong>
          Workout goal kept: {done.length} of {session.exercises.length}
        </strong>{" "}
        movement patterns trained
        {swaps > 0 && `, ${swaps} by adapting with a swap`}.
      </p>

      {done.length > 0 && (
        <>
          <h2 className="summary-heading">How did each exercise feel?</h2>
          <p className="muted">
            Ratings shape your next sessions. Exercises you mark 🙅 won't be
            recommended again.
          </p>

          <ul className="rating-list">
            {done.map((item) => {
              const name = EXERCISES_BY_ID[item.exerciseId].name;
              return (
                <li key={item.exerciseId}>
                  <span>{name}</span>
                  <div className="rating-buttons" role="radiogroup" aria-label={`Rate ${name}`}>
                    {RATINGS.map((rating) => (
                      <button
                        key={rating.value}
                        type="button"
                        role="radio"
                        aria-checked={session.ratings[item.exerciseId] === rating.value}
                        aria-label={rating.label}
                        title={rating.label}
                        onClick={() => onRate(item.exerciseId, rating.value)}
                      >
                        <span aria-hidden="true">{rating.emoji}</span>
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {skipped.length > 0 && (
        <p className="muted">
          Skipped: {skipped.map((e) => EXERCISES_BY_ID[e.exerciseId].name).join(", ")}
        </p>
      )}

      <div className="step-actions">
        <button type="button" className="secondary-button" onClick={onBack}>
          Back to workout
        </button>
        <button type="button" className="primary-button" onClick={onSave}>
          Save workout
        </button>
      </div>
    </section>
  );
}

export default WorkoutSummary;
