import { env } from "@/config/env";

import Mapbox from "@rnmapbox/maps";
import { StyleSheet } from "react-native";

Mapbox.setAccessToken(env.mapboxAccessToken);

const App = () => {
  return (
    <>
      <Mapbox.MapView style={styles.map} />;
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
