import { RouteData, SavedRoute } from "@/utils/types";
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SavedRoutesModalProps {
  isVisible: boolean;
  savedRoutes: SavedRoute[];
  onClose: () => void;
  onSelectRoute: (routeData: RouteData) => void;
  onDeleteRoute: (id: string) => void;
}

export function SavedRoutesModal({
  isVisible,
  savedRoutes,
  onClose,
  onSelectRoute,
  onDeleteRoute,
}: SavedRoutesModalProps) {
  const renderItem = ({ item }: { item: SavedRoute }) => {
    const route = item.routeData;
    const startCoord = route.routeCoordinates[0];
    const endCoord = route.snappedDestination;
    const minutes = Math.round(route.durationSeconds / 60);
    const dateStr = new Date(item.createdAt).toLocaleDateString();

    return (
      <TouchableOpacity
        style={styles.routeCard}
        onPress={() => onSelectRoute(route)}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.dateText}>{dateStr}</Text>
            <Text style={styles.statsText}>
              {minutes} min • {route.distanceMeters}m
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onDeleteRoute(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.coordText}>
          Start: {startCoord.latitude.toFixed(4)},{" "}
          {startCoord.longitude.toFixed(4)}
        </Text>
        <Text style={styles.coordText}>
          Finish: {endCoord.latitude.toFixed(4)},{" "}
          {endCoord.longitude.toFixed(4)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved Routes</Text>
          <Button title="Close" onPress={onClose} />
        </View>
        {savedRoutes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              You haven't saved any routes yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={savedRoutes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 20, fontWeight: "bold" },
  listContent: { padding: 16, gap: 12 },
  routeCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Ensures button aligns nicely with text
    marginBottom: 8,
  },
  dateText: { fontWeight: "600", color: "#333" },
  statsText: { fontWeight: "bold", color: "#bf4040" },
  coordText: { fontSize: 12, color: "#666", marginTop: 2 },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#ffebee",
    borderRadius: 4,
  },
  deleteText: {
    color: "#d32f2f",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#666", fontSize: 16 },
});
