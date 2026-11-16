import { StyleSheet, Text, View } from "react-native";

interface PedometerOverlayProps {
  steps: number;
}

export function PedometerOverlay({ steps }: PedometerOverlayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Steps</Text>
      <Text style={styles.count}>{steps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60, // Leaves room for the status bar
    left: 20,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 80,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  count: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#bf4040",
  },
});
