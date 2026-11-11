import { env } from "@/config/env";
import { useLocationPermission } from "@/hooks/useLocationPermission";

import Mapbox from "@rnmapbox/maps";
import { StyleSheet } from "react-native";

Mapbox.setAccessToken(env.mapboxAccessToken);

const App = () => {
  const { hasLocationPermission } = useLocationPermission();

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
