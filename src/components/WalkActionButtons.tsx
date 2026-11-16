import { PromptMode } from "@/utils/types";
import { Button, StyleSheet, View } from "react-native";

interface WalkActionButtonsProps {
  isActiveWalk: boolean;
  hasRoute: boolean;
  isGenerating: boolean;
  isDisabled: boolean;
  onStartWalk: () => void;
  onCancelWalk: () => void;
  onCompleteWalk: () => void;
  onPromptMode: (mode: PromptMode) => void;
}

export function WalkActionButtons({
  isActiveWalk,
  hasRoute,
  isGenerating,
  isDisabled,
  onStartWalk,
  onCancelWalk,
  onCompleteWalk,
  onPromptMode,
}: WalkActionButtonsProps) {
  return (
    <View style={styles.uiContainer}>
      {isActiveWalk ? (
        // --- ACTIVE WALK UI ---
        <View style={styles.row}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Cancel Walk"
              color="#bf4040"
              onPress={onCancelWalk}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Complete Walk"
              color="#4caf50"
              onPress={onCompleteWalk}
            />
          </View>
        </View>
      ) : (
        // --- PLANNING UI ---
        <View style={styles.column}>
          {/* Show Start button only when a route has been generated */}
          {hasRoute && (
            <View style={styles.startWalkWrapper}>
              <Button
                title="Start Walk"
                color="#007AFF"
                onPress={onStartWalk}
              />
            </View>
          )}

          <View style={styles.row}>
            <View style={styles.buttonWrapper}>
              <Button
                title={isGenerating ? "Generating..." : "Walk by Time"}
                onPress={() => onPromptMode("minutes")}
                disabled={isDisabled}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title={isGenerating ? "Generating..." : "Walk by Steps"}
                onPress={() => onPromptMode("steps")}
                disabled={isDisabled}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  uiContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flexDirection: "column",
    gap: 12,
  },
  buttonWrapper: {
    minWidth: 130,
  },
  startWalkWrapper: {
    width: "100%",
  },
});
