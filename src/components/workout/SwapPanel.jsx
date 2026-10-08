import { EXERCISES_BY_ID, PATTERNS } from "../../data/exercises";

const EQUIPMENT_LABELS = {
  bodyweight: "Bodyweight",
  dumbbell: "Dumbbells",
  band: "Band",
  barbell: "Barbell",
  bench: "Bench",
  rack: "Rack",
  pullup_bar: "Pull-up bar",
  kettlebell: "Kettlebell",
  cable: "Cable",
  machine: "Machine",
};

function SwapPanel({ item, options, onPick, onSkip, onClose }) {
  const exercise = EXERCISES_BY_ID[item.exerciseId];
  const pattern = PATTERNS[item.pattern];

  return (
    <div className="swap-backdrop" onClick={onClose}>
      <div
        className="swap-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="swap-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <p className="eyebrow">WORKOUT UNAVAILABLE?</p>
        <h2 id="swap-title">Swap out {exercise.name}</h2>
        <p className="muted">
          These keep the same goal: {pattern.label.toLowerCase()} ({pattern.muscles.toLowerCase()}).
        </p>

        {options.length > 0 ? (
          <ul className="swap-options">
            {options.map((option, i) => (
              <li key={option.id}>
                <button type="button" autoFocus={i === 0} onClick={() => onPick(option.id)}>
                  <strong>{option.name}</strong>
                  <span className="muted">
                    {option.equipment.map((e) => EQUIPMENT_LABELS[e]).join(" + ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="form-note">
            No other {pattern.label.toLowerCase()} exercises fit your equipment
            right now. You can skip this one.
          </p>
        )}

        <div className="swap-actions">
          <button type="button" className="text-button" onClick={onSkip}>
            Skip this exercise
          </button>
          <button
            type="button"
            className="secondary-button"
            autoFocus={options.length === 0}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SwapPanel;
