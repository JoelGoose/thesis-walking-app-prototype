// src/components/TurnByTurnView.tsx
import { RouteData } from "@/utils/types";
import Navigation, { RNNavigationView, Route } from "@rnmapbox/navigation"; // <-- Add Navigation and Route to imports
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface TurnByTurnViewProps {
  routeData: RouteData;
  onExit: () => void;
}

export function TurnByTurnView({ routeData, onExit }: TurnByTurnViewProps) {
  // Store the active native route in state
  const [navRoute, setNavRoute] = useState<Route | null>(null);

  useEffect(() => {
    let activeRoute: Route | null = null;

    async function fetchWalkingProfile() {
      try {
        const origin = routeData.routeCoordinates[0];
        const destination = routeData.snappedDestination;

        // 1. Manually request the route using the walking profile
        const { main } = await Navigation.requestRoutes({
          waypoints: [
            [origin.longitude, origin.latitude],
            {
              coordinate: [destination.longitude, destination.latitude],
              name: "Goal",
            },
          ],
          profile: "walking",
          units: "metric",
        });

        activeRoute = main;
        setNavRoute(main);
      } catch (error) {
        console.error("Failed to fetch walking navigation route:", error);
      }
    }

    void fetchWalkingProfile();

    return () => {
      // 3. Clean up native memory when the navigation view unmounts
      if (activeRoute) {
        activeRoute.release();
      }
    };
  }, [routeData]);

  // Show a brief loading screen while Mapbox calculates the walking path
  if (!navRoute) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Calculating walking route...</Text>
      </View>
    );
  }

  // 2. Pass the fetched `navRoute` into the `route` prop instead of `waypoints`
  return (
    <View style={styles.container}>
      <RNNavigationView
        style={{ flex: 1 }}
        route={navRoute}
        onArrive={({ isFinalDestination }) => {
          if (isFinalDestination) {
            onExit();
          }
        }}
        onCancel={() => onExit()}
        onError={({ code, message }) => {
          console.error(`Navigation Error [${code}]: ${message}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
