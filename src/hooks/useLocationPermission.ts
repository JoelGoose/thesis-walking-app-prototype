// src/hooks/useLocationPermission.ts
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useLocationPermission() {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (isMounted) {
          setHasLocationPermission(
            status === Location.PermissionStatus.GRANTED,
          );
        }
      } catch (error) {
        console.error("Failed to request location permission.", error);
      }
    };

    void requestLocationPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  return { hasLocationPermission };
}
