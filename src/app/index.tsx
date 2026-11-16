import { env } from "@/config/env";
import { stepsToMeters } from "@/utils/conversions";
import { Coordinate, PromptMode } from "@/utils/types";
import Mapbox from "@rnmapbox/maps";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { PedometerOverlay } from "@/components/PedometerOverlay";
import { RouteOverlay } from "@/components/RouteOverlay";
import { WalkActionButtons } from "@/components/WalkActionButtons";
import { WalkPromptModal } from "@/components/WalkPromptModal";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { usePedometer } from "@/hooks/usePedometer";
import { useWalkGenerator } from "@/hooks/useWalkGenerator";

Mapbox.setAccessToken(env.mapboxAccessToken);

export default function App() {
  const { hasLocationPermission } = useLocationPermission();
  const {
    routeData,
    isGenerating,
    generateWalkByMinutes,
    generateWalkByMeters,
    clearRoute,
  } = useWalkGenerator();

  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [promptMode, setPromptMode] = useState<PromptMode>(null);
  const [isActiveWalk, setIsActiveWalk] = useState(false);

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
