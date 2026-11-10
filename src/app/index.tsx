import { env } from "@/config/env";

import Mapbox from "@rnmapbox/maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

Mapbox.setAccessToken(env.mapboxAccessToken);

const App = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const requestLocationPermission = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (isMounted) {
          setHasLocationPermission(status === Location.PermissionStatus.GRANTED);
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

  return (
    <Mapbox.MapView style={styles.map}>
      {hasLocationPermission && (
        <Mapbox.UserLocation visible showsUserHeadingIndicator />
      )}
    </Mapbox.MapView>
  );
};

export default App;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
