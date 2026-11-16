import { PromptMode } from "@/utils/types";
import { useEffect, useState } from "react";
import { Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";

interface WalkPromptModalProps {
  mode: PromptMode;
  onClose: () => void;
  onSubmit: (value: number) => void;
}

export function WalkPromptModal({
  mode,
  onClose,
  onSubmit,
}: WalkPromptModalProps) {
  const [inputValue, setInputValue] = useState("");

  // Clear the input every time the modal is opened
  useEffect(() => {
    if (mode !== null) {
      setInputValue("");
    }
  }, [mode]);

  const handleConfirm = () => {
    const numericValue = Number(inputValue);
    if (numericValue > 0) {
      onSubmit(numericValue);
    }
  };

  return (
    <Modal
      visible={mode !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {mode === "minutes"
              ? "Enter Walk Duration (Minutes)"
              : "Enter Target Step Count"}
          </Text>

          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder={mode === "minutes" ? "e.g. 20 (max 60)" : "e.g. 3000"}
            placeholderTextColor={"#CBCBCB"}
            value={inputValue}
            onChangeText={setInputValue}
            autoFocus
          />

          <View style={styles.modalActions}>
            <Button title="Cancel" color="#666" onPress={onClose} />
            <Button
              title="Generate"
              onPress={handleConfirm}
              disabled={!inputValue || Number(inputValue) <= 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
});
