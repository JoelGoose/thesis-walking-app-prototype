import { RouteData } from "@/utils/types";
import { RNNavigationView } from "@rnmapbox/navigation";
import { StyleSheet, View } from "react-native";

interface TurnByTurnViewProps {
  routeData: RouteData;
  onExit: () => void;
}

export function TurnByTurnView({ routeData, onExit }: TurnByTurnViewProps) {
  // Mapbox Navigation expects the destination (and optionally origin) to calculate the active guidance
  const destination = [
    routeData.snappedDestination.longitude,
    routeData.snappedDestination.latitude,
  ] as [number, number];

  return (
    <View style={styles.container}>
      <RNNavigationView
        waypoints={[destination]}
        onCancel={onExit} // This hooks the built-in "End" button directly to your app's state
        onArrive={onExit} // Automatically exit navigation when they reach the destination
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
