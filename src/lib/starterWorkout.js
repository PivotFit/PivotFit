export const EQUIPMENT = {
  bodyweight: "Bodyweight", dumbbell: "Dumbbells", band: "Resistance bands",
  barbell: "Barbell", bench: "Bench", rack: "Rack", pullup_bar: "Pull-up bar",
  kettlebell: "Kettlebell", cable: "Cable station", machine: "Gym machines",
};

export function durationError(value) {
  const minutes = Number(value);
  return String(value).trim() === "" || !Number.isInteger(minutes) || minutes < 10 || minutes > 120
    ? "Enter a whole number of minutes from 10 to 120."
    : "";
}
