import { useEffect, useRef, useState } from "react";
import { EXERCISES_BY_ID, PATTERNS, WEIGHTED_EQUIPMENT } from "../../data/exercises";

const HOLD_MS = 600;
const MOVE_TOLERANCE_PX = 10;

// One exercise in an active workout. Press and hold the card (or tap Swap)
// to mark it unavailable and pick a backup.
function ExerciseCard({ item, backups, lastWeight, onChange, onSwap }) {
  const exercise = EXERCISES_BY_ID[item.exerciseId];
  const pattern = PATTERNS[item.pattern];
  const weighted = exercise.equipment.some((e) => WEIGHTED_EQUIPMENT.includes(e));
  const unitLabel = exercise.unit === "seconds" ? "Seconds" : "Reps";
  const finished = item.done || item.skipped;

  const [holding, setHolding] = useState(false);
  const holdTimer = useRef(null);
  const holdStart = useRef(null);

  useEffect(() => () => clearTimeout(holdTimer.current), []);

  function cancelHold() {
    clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setHolding(false);
  }

  function handlePointerDown(event) {
    // Let inputs and buttons inside the card work normally.
    if (finished || event.target.closest("input, button")) return;

    holdStart.current = { x: event.clientX, y: event.clientY };
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      setHolding(false);
      // Haptic buzz where supported (Android); iPhone browsers ignore it.
      navigator.vibrate?.(60);
      onSwap();
    }, HOLD_MS);
  }

  function handlePointerMove(event) {
    if (!holdTimer.current) return;
    const dx = event.clientX - holdStart.current.x;
    const dy = event.clientY - holdStart.current.y;
    if (Math.hypot(dx, dy) > MOVE_TOLERANCE_PX) cancelHold();
  }

  function updateLog(field, value) {
    onChange({ log: { ...item.log, [field]: value } });
  }

  const className = ["exercise-card", item.done && "done", item.skipped && "skipped", holding && "holding"]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={className}
      style={{ "--hold-ms": `${HOLD_MS}ms` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onContextMenu={(e) => holding && e.preventDefault()}
    >
      <div className="exercise-card-header">
        <div>
          <h3>
            {item.done && <span aria-hidden="true">✓ </span>}
            {exercise.name}
            {item.skipped && <span className="muted"> (skipped)</span>}
          </h3>
          <p className="muted">
            {pattern.label} · {pattern.muscles}
          </p>
          {item.swappedFrom && (
            <p className="swap-note">
              Swapped in for {EXERCISES_BY_ID[item.swappedFrom].name}
            </p>
          )}
        </div>
        <span className="target">
          {item.sets} × {item.reps}
        </span>
      </div>

      {!finished && (
        <>
          <div className="log-fields">
            <label>
              Sets
              <input
                type="number"
                inputMode="numeric"
                min="0"
                placeholder={String(item.sets)}
                value={item.log.sets}
                onChange={(e) => updateLog("sets", e.target.value)}
              />
            </label>
            <label>
              {unitLabel}
              <input
                type="number"
                inputMode="numeric"
                min="0"
                placeholder={item.reps.replace(" s", "")}
                value={item.log.reps}
                onChange={(e) => updateLog("reps", e.target.value)}
              />
            </label>
            {weighted && (
              <label>
                Weight (lb)
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  placeholder={lastWeight ? `Last: ${lastWeight}` : "lb"}
                  value={item.log.weight}
                  onChange={(e) => updateLog("weight", e.target.value)}
                />
              </label>
            )}
          </div>

          {backups.length > 0 && (
            <p className="backups muted">
              Backups ready: {backups.map((e) => e.name).join(", ")}
            </p>
          )}
        </>
      )}

      <div className="exercise-actions">
        {finished ? (
          <button
            type="button"
            className="text-button"
            onClick={() => onChange({ done: false, skipped: false })}
          >
            Undo
          </button>
        ) : (
          <>
            <button type="button" className="secondary-button" onClick={onSwap}>
              Swap
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => onChange({ done: true })}
            >
              Done
            </button>
          </>
        )}
      </div>

      {!finished && <p className="hold-hint">Equipment taken? Press and hold to swap.</p>}
    </article>
  );
}

export default ExerciseCard;
