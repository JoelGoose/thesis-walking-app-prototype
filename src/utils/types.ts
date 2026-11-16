export type Coordinate = { longitude: number; latitude: number };
export interface RouteData {
  snappedDestination: Coordinate;
  routeCoordinates: Coordinate[]; // The line to draw on the map
  turnByTurnSteps: any[]; // Save this for your future navigation feature
  distanceMeters: number;
  durationSeconds: number;
}
export type PromptMode = "minutes" | "steps" | null;
