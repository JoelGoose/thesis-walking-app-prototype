import { env } from "@/config/env";
import { Coordinate } from "@/utils/types";
import Mapbox from "@rnmapbox/maps";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";

import { RouteOverlay } from "@/components/RouteOverlay";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useWalkGenerator } from "@/hooks/useWalkGenerator";

Mapbox.setAccessToken(env.mapboxAccessToken);

export default function App() {
  const { hasLocationPermission } = useLocationPermission();
  const { routeData, isGenerating, generateWalk } = useWalkGenerator();

  // We need to track the user's location so we can pass it to the generator
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);

  const handleGeneratePress = () => {
    if (userLocation) {
      generateWalk(userLocation, 15); // Ask for a 15-minute walk
    }
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map}>
        <Mapbox.Camera followUserLocation={!routeData} zoomLevel={14} />

        {hasLocationPermission && (
          <Mapbox.UserLocation
            visible
            showsUserHeadingIndicator
            onUpdate={(location) => {
              // Mapbox returns longitude first in coords array
              setUserLocation({
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
              });
            }}
          />
        )}

        {/* Handles all the line and pin rendering */}
        <RouteOverlay routeData={routeData} />
      </Mapbox.MapView>

      {/* Floating UI overlay for the button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isGenerating ? "Generating..." : "Generate Walk"}
          onPress={handleGeneratePress}
          disabled={!userLocation || isGenerating}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
