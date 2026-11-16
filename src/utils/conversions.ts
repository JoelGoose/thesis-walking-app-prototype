const AVERAGE_STEP_LENGTH_METERS = 0.75;

export function stepsToMeters(steps: number): number {
  return Math.round(steps * AVERAGE_STEP_LENGTH_METERS);
}
