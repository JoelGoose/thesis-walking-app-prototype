import { env } from "@/config/env";
import { stepsToMeters } from "@/utils/conversions";
import { Coordinate, PromptMode, RouteData } from "@/utils/types";
import Mapbox from "@rnmapbox/maps";
import { useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";

import { PedometerOverlay } from "@/components/PedometerOverlay";
import { RouteOverlay } from "@/components/RouteOverlay";
import { SavedRoutesModal } from "@/components/SavedRoutesModal";
import { WalkActionButtons } from "@/components/WalkActionButtons";
import { WalkPromptModal } from "@/components/WalkPromptModal";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { usePedometer } from "@/hooks/usePedometer";
import { useSavedRoutes } from "@/hooks/useSavedRoutes";
import { useWalkGenerator } from "@/hooks/useWalkGenerator";

Mapbox.setAccessToken(env.mapboxAccessToken);

export default function App() {
  const { hasLocationPermission } = useLocationPermission();
  const { savedRoutes, saveRoute, deleteRoute } = useSavedRoutes();
  const {
    routeData,
    isGenerating,
    generateWalkByMinutes,
    generateWalkByMeters,
    clearRoute,
    loadSavedRoute,
  } = useWalkGenerator();

  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [promptMode, setPromptMode] = useState<PromptMode>(null);
  const [isActiveWalk, setIsActiveWalk] = useState(false);
  const [isSavedModalVisible, setIsSavedModalVisible] = useState(false);

  const { steps } = usePedometer(isActiveWalk);

  const handleConfirmGenerate = (numericValue: number) => {
    if (!userLocation) return;
    const currentMode = promptMode;
    setPromptMode(null);

    if (currentMode === "minutes") {
      const clampedMinutes = Math.min(Math.round(numericValue), 60);
      void generateWalkByMinutes(userLocation, clampedMinutes);
    } else if (currentMode === "steps") {
      const meters = stepsToMeters(numericValue);
      const clampedMeters = Math.min(meters, 100000);
      void generateWalkByMeters(userLocation, clampedMeters);
    }
  };

  const handleStartWalk = () => setIsActiveWalk(true);

  const handleCancelWalk = () => {
    console.log("Walk cancelled!");
    setIsActiveWalk(false);
    clearRoute();
  };

  const handleCompleteWalk = () => {
    console.log("Walk completed!");
    setIsActiveWalk(false);
    clearRoute();
  };

  const handleSaveRoute = async () => {
    if (!routeData) return;
    const success = await saveRoute(routeData);
    if (success) {
      Alert.alert("Success", "Route saved to your library.");
    }
  };

  const handleSelectSavedRoute = (selectedRouteData: RouteData) => {
    loadSavedRoute(selectedRouteData);
    setIsSavedModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map}>
        <Mapbox.Camera followUserLocation={!routeData} zoomLevel={5} />

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

      {isActiveWalk && <PedometerOverlay steps={steps} />}

      <View style={styles.topRightContainer}>
        {isActiveWalk ? (
          <Button
            title="Save Route"
            color="#bf4040"
            onPress={handleSaveRoute}
          />
        ) : (
          <Button
            title="Load Route"
            color="#666"
            onPress={() => setIsSavedModalVisible(true)}
          />
        )}
      </View>

      <WalkActionButtons
        isActiveWalk={isActiveWalk}
        hasRoute={!!routeData}
        isGenerating={isGenerating}
        isDisabled={!userLocation || isGenerating}
        onStartWalk={handleStartWalk}
        onCancelWalk={handleCancelWalk}
        onCompleteWalk={handleCompleteWalk}
        onPromptMode={setPromptMode}
      />

      <WalkPromptModal
        mode={promptMode}
        onClose={() => setPromptMode(null)}
        onSubmit={handleConfirmGenerate}
      />

      <SavedRoutesModal
        isVisible={isSavedModalVisible}
        savedRoutes={savedRoutes}
        onClose={() => setIsSavedModalVisible(false)}
        onSelectRoute={handleSelectSavedRoute}
        onDeleteRoute={deleteRoute}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  topRightContainer: {
    position: "absolute",
    top: 60, // Align with PedometerOverlay height
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden", // Ensures button respects border radius
  },
});
