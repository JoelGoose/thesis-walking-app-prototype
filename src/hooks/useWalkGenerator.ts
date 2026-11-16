import {
  getIsochroneWithMeters,
  getIsochroneWithMinutes,
  getWalkingRoute,
} from "@/services/mapbox-api";
import { Coordinate, RouteData } from "@/utils/types";
import { useState } from "react";

export function useWalkGenerator() {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Shared helper to fetch the snapped route once we have a raw destination
  const buildRouteToDestination = async (
    userLocation: Coordinate,
    rawDestination: Coordinate | null,
  ) => {
    if (!rawDestination) {
      throw new Error("Failed to generate destination from Isochrone.");
    }

    const finalRoute = await getWalkingRoute(userLocation, rawDestination);
    if (finalRoute) {
      setRouteData(finalRoute);
    }
  };

  const generateWalkByMinutes = async (
    userLocation: Coordinate,
    minutes: number,
  ) => {
    setIsGenerating(true);
    try {
      const rawDestination = await getIsochroneWithMinutes(
        userLocation,
        minutes,
      );
      await buildRouteToDestination(userLocation, rawDestination);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWalkByMeters = async (
    userLocation: Coordinate,
    meters: number,
  ) => {
    setIsGenerating(true);
    try {
      const rawDestination = await getIsochroneWithMeters(userLocation, meters);
      await buildRouteToDestination(userLocation, rawDestination);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearRoute = () => setRouteData(null);

  const loadSavedRoute = (savedRouteData: RouteData) => {
    setRouteData(savedRouteData);
  };

  return {
    routeData,
    isGenerating,
    generateWalkByMinutes,
    generateWalkByMeters,
    clearRoute,
    loadSavedRoute,
  };
}
