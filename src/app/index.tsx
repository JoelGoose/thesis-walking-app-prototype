import { env } from "@/config/env";
import { stepsToMeters } from "@/utils/conversions";
import { Coordinate, PromptMode } from "@/utils/types";
import Mapbox from "@rnmapbox/maps";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";

import { RouteOverlay } from "@/components/RouteOverlay";
import { WalkPromptModal } from "@/components/WalkPromptModal";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useWalkGenerator } from "@/hooks/useWalkGenerator";

Mapbox.setAccessToken(env.mapboxAccessToken);

export default function App() {
  const { hasLocationPermission } = useLocationPermission();
  const {
    routeData,
    isGenerating,
    generateWalkByMinutes,
    generateWalkByMeters,
  } = useWalkGenerator();

  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [promptMode, setPromptMode] = useState<PromptMode>(null);

  // This function gets called by the Modal when the user hits "Generate"
  const handleConfirmGenerate = (numericValue: number) => {
    if (!userLocation) return;

    const currentMode = promptMode;
    setPromptMode(null); // Close the modal immediately

    if (currentMode === "minutes") {
      const clampedMinutes = Math.min(Math.round(numericValue), 60);
      void generateWalkByMinutes(userLocation, clampedMinutes);
    } else if (currentMode === "steps") {
      const meters = stepsToMeters(numericValue);
      const clampedMeters = Math.min(meters, 100000);
      void generateWalkByMeters(userLocation, clampedMeters);
    }
  };

  const isDisabled = !userLocation || isGenerating;

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map}>
        <Mapbox.Camera followUserLocation={!routeData} zoomLevel={14} />

        {hasLocationPermission && (
          <Mapbox.UserLocation
            visible
            showsUserHeadingIndicator
            onUpdate={(location) => {
              setUserLocation({
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
              });
            }}
          />
        )}

        <RouteOverlay routeData={routeData} />
      </Mapbox.MapView>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title={isGenerating ? "Generating..." : "Walk by Time"}
            onPress={() => setPromptMode("minutes")}
            disabled={isDisabled}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title={isGenerating ? "Generating..." : "Walk by Steps"}
            onPress={() => setPromptMode("steps")}
            disabled={isDisabled}
          />
        </View>
      </View>
      <WalkPromptModal
        mode={promptMode}
        onClose={() => setPromptMode(null)}
        onSubmit={handleConfirmGenerate}
      />
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
    flexDirection: "row",
    gap: 12,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonWrapper: {
    minWidth: 130,
  },
});
