import { env } from "@/config/env";
import { Coordinate, RouteData } from "@/utils/types";

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

/**
 * Fetches a walking route, snaps the destination to a reachable path,
 * and grabs turn-by-turn instructions.
 */
export async function getWalkingRoute(
  origin: Coordinate,
  rawDestination: Coordinate,
): Promise<RouteData | null> {
  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${origin.longitude},${origin.latitude};${rawDestination.longitude},${rawDestination.latitude}?steps=true&geometries=geojson&access_token=${env.mapboxAccessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.code === "Ok" && data.routes.length > 0) {
      const route = data.routes[0];

      // waypoints[0] is the snapped origin, waypoints[1] is the snapped destination.
      const snappedDestinationLngLat = data.waypoints[1].location;
      const snappedDestination: Coordinate = {
        longitude: snappedDestinationLngLat[0],
        latitude: snappedDestinationLngLat[1],
      };

      // Extract the route path to draw on the map
      const routeCoordinates: Coordinate[] = route.geometry.coordinates.map(
        (point: [number, number]) => ({
          longitude: point[0],
          latitude: point[1],
        }),
      );

      // Extract turn-by-turn steps from the first "leg" of the journey
      const turnByTurnSteps = route.legs[0].steps;

      return {
        snappedDestination,
        routeCoordinates,
        turnByTurnSteps,
        distanceMeters: route.distance,
        durationSeconds: route.duration,
      };
    } else {
      console.warn("Directions API failed to find a route:", data.message);
    }
  } catch (error) {
    console.error("Failed to fetch walking route:", error);
  }

  return null;
}
