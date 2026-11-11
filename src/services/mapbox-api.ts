import { env } from "@/config/env";
import { Coordinate } from "@/utils/types";

/**
 * Helper function to fetch the Mapbox URL, parse the LineString response,
 * and return a random coordinate from the boundary.
 */
async function fetchRandomIsochronePoint(
  url: string,
): Promise<Coordinate | null> {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      // Because the response is a LineString, coordinates is an array of [lng, lat] pairs
      const boundaryPoints = data.features[0].geometry.coordinates;

      if (boundaryPoints && boundaryPoints.length > 0) {
        const randomIndex = Math.floor(Math.random() * boundaryPoints.length);
        const randomDestination = boundaryPoints[randomIndex];

        // Mapbox returns arrays as [longitude, latitude].
        return {
          longitude: randomDestination[0],
          latitude: randomDestination[1],
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch isochrone:", error);
  }

  return null;
}

export async function getIsochroneWithMeters(
  coordinate: Coordinate,
  meters: number,
): Promise<Coordinate | null> {
  const url = `https://api.mapbox.com/isochrone/v1/mapbox/walking/${coordinate.longitude},${coordinate.latitude}?contours_meters=${meters}&access_token=${env.mapboxAccessToken}`;
  return fetchRandomIsochronePoint(url);
}

export async function getIsochroneWithMinutes(
  coordinate: Coordinate,
  minutes: number,
): Promise<Coordinate | null> {
  const url = `https://api.mapbox.com/isochrone/v1/mapbox/walking/${coordinate.longitude},${coordinate.latitude}?contours_minutes=${minutes}&access_token=${env.mapboxAccessToken}`;
  return fetchRandomIsochronePoint(url);
}
