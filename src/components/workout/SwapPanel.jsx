import { useEffect, useRef } from "react";
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

// Modal for swapping the exercise at `index`. Keyboard focus stays inside the
// dialog while it's open and returns to the exercise card when it closes
// (WCAG 2.4.3).
function SwapPanel({ index, item, options, onPick, onSkip, onClose }) {
  const exercise = EXERCISES_BY_ID[item.exerciseId];
  const pattern = PATTERNS[item.pattern];
  const panelRef = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    panelRef.current.querySelector("button")?.focus();

    return () => {
      // Wait for the card to re-render: after a pick the old Swap button is
      // gone, so fall back to the same card's first action (Swap or Undo).
      // Skip if a dialog is open again (React dev mode mounts effects twice).
      requestAnimationFrame(() => {
        if (document.querySelector('[role="dialog"]')) return;
        if (opener?.isConnected && opener !== document.body && !opener.closest('[role="dialog"]')) {
          opener.focus();
        } else {
          const card = document.querySelectorAll(".exercise-card")[index];
          card?.querySelector(".exercise-actions button")?.focus();
        }
      });
    };
  }, [index]);

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key !== "Tab") return;

    const buttons = [...panelRef.current.querySelectorAll("button:not([disabled])")];
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="swap-backdrop" onClick={onClose}>
      <div
        ref={panelRef}
        className="swap-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="swap-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <p className="eyebrow">WORKOUT UNAVAILABLE?</p>
        <h2 id="swap-title">Swap out {exercise.name}</h2>
        <p className="muted">
          These keep the same goal: {pattern.label.toLowerCase()} ({pattern.muscles.toLowerCase()}).
        </p>

        {options.length > 0 ? (
          <ul className="swap-options">
            {options.map((option) => (
              <li key={option.id}>
                <button type="button" onClick={() => onPick(option.id)}>
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
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SwapPanel;
