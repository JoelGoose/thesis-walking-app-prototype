import { Coordinate } from "./types";

const AVERAGE_STEP_LENGTH_METERS = 0.75;

export function stepsToMeters(steps: number): number {
  return Math.round(steps * AVERAGE_STEP_LENGTH_METERS);
}

export const getRouteBounds = (coordinates: Coordinate[]) => {
  let minLng = Infinity,
    minLat = Infinity;
  let maxLng = -Infinity,
    maxLat = -Infinity;

  coordinates.forEach((coord) => {
    if (coord.longitude < minLng) minLng = coord.longitude;
    if (coord.longitude > maxLng) maxLng = coord.longitude;
    if (coord.latitude < minLat) minLat = coord.latitude;
    if (coord.latitude > maxLat) maxLat = coord.latitude;
  });

  return {
    ne: [maxLng, maxLat] as [number, number], // NorthEast corner
    sw: [minLng, minLat] as [number, number], // SouthWest corner
  };
};
