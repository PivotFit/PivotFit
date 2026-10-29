// Validation for the actual sets / reps / weight a user logs during a workout.
// Empty is allowed (logging is optional). Returns an error message, or "".

const RULES = {
  sets: { label: "Sets", max: 50, whole: true },
  reps: { label: "Reps", max: 500, whole: true },
  seconds: { label: "Seconds", max: 3600, whole: true },
  weight: { label: "Weight", max: 2000, whole: false, unit: " lb" },
};

const WHOLE = /^\d+$/;
const DECIMAL = /^\d+(\.\d{1,2})?$/;

/**
 * @param {"sets" | "reps" | "seconds" | "weight"} field
 * @param {string} value raw text from the input
 */
export function logFieldError(field, value) {
  const rule = RULES[field];
  const text = String(value ?? "").trim();
  if (text === "") return "";

  const range = `from 0 to ${rule.max.toLocaleString("en-US")}${rule.unit ?? ""}`;
  if (rule.whole && !WHOLE.test(text)) return `${rule.label} must be a whole number ${range}.`;
  if (!rule.whole && !DECIMAL.test(text)) return `${rule.label} must be a number ${range}, like 45 or 22.5.`;
  if (Number(text) > rule.max) return `${rule.label} must be ${range}.`;
  return "";
}
