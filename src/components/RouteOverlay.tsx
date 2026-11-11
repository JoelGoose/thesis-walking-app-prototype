import { RouteData } from "@/utils/types";
import Mapbox from "@rnmapbox/maps";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface RouteOverlayProps {
  routeData: RouteData | null;
}

export const RouteOverlay = ({ routeData }: RouteOverlayProps) => {
  // Memoize the GeoJSON so it doesn't recalculate on every minor re-render
  const routeGeoJSON = useMemo(() => {
    if (!routeData) return null;

    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            // Mapbox expects arrays of [longitude, latitude]
            coordinates: routeData.routeCoordinates.map((c) => [
              c.longitude,
              c.latitude,
            ]),
          },
        },
      ],
    };
  }, [routeData]);

  if (!routeData || !routeGeoJSON) return null;

  return (
    <>
      {/* Draw the Route Line */}
      <Mapbox.ShapeSource id="route-source" shape={routeGeoJSON}>
        <Mapbox.LineLayer
          id="route-line-layer"
          style={{
            lineColor: "#bf4040", // primary color
            lineWidth: 5,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      </Mapbox.ShapeSource>

      {/* Draw the Destination Pin */}
      <Mapbox.PointAnnotation
        id="destination-pin"
        coordinate={[
          routeData.snappedDestination.longitude,
          routeData.snappedDestination.latitude,
        ]}
      >
        <View style={styles.pin} />
      </Mapbox.PointAnnotation>
    </>
  );
};

const styles = StyleSheet.create({
  pin: {
    height: 20,
    width: 20,
    backgroundColor: "#bf4040",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "white",
  },
});
