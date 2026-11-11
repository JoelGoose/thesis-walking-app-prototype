import {
  getIsochroneWithMinutes,
  getWalkingRoute,
} from "@/services/mapbox-api";
import { Coordinate, RouteData } from "@/utils/types";
import { useState } from "react";

export function useWalkGenerator() {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWalk = async (
    userLocation: Coordinate,
    minutes: number = 20,
  ) => {
    setIsGenerating(true);
    try {
      // Get a random reachable point via Isochrone
      const rawDestination = await getIsochroneWithMinutes(
        userLocation,
        minutes,
      );

      if (!rawDestination) {
        throw new Error("Failed to generate destination");
      }

      // Fetch the snapped route and turn-by-turn data
      const finalRoute = await getWalkingRoute(userLocation, rawDestination);

      if (finalRoute) {
        setRouteData(finalRoute);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearRoute = () => setRouteData(null);

  return { routeData, isGenerating, generateWalk, clearRoute };
}
