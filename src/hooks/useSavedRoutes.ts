import { RouteData, SavedRoute } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const ROUTES_STORAGE_KEY = "@saved_routes";

export function useSavedRoutes() {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);

  useEffect(() => {
    loadSavedRoutes();
  }, []);

  const loadSavedRoutes = async () => {
    try {
      const stored = await AsyncStorage.getItem(ROUTES_STORAGE_KEY);
      if (stored) {
        setSavedRoutes(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load saved routes from storage", error);
    }
  };

  const saveRoute = async (routeData: RouteData) => {
    try {
      const newRoute: SavedRoute = {
        id: Date.now().toString(),
        createdAt: Date.now(),
        routeData,
      };

      const updatedRoutes = [newRoute, ...savedRoutes];
      await AsyncStorage.setItem(
        ROUTES_STORAGE_KEY,
        JSON.stringify(updatedRoutes),
      );
      setSavedRoutes(updatedRoutes);

      return true;
    } catch (error) {
      console.error("Failed to save route", error);
      return false;
    }
  };

  const deleteRoute = async (id: string) => {
    try {
      const updatedRoutes = savedRoutes.filter((route) => route.id !== id);
      await AsyncStorage.setItem(
        ROUTES_STORAGE_KEY,
        JSON.stringify(updatedRoutes),
      );
      setSavedRoutes(updatedRoutes);
      return true;
    } catch (error) {
      console.error("Failed to delete route", error);
      return false;
    }
  };

  return { savedRoutes, saveRoute, deleteRoute };
}
