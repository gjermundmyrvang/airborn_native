import { FlatList, View } from "react-native";
import React from "react";
import { ParsedSigmet } from "./types";
import { BottomModal } from "../../components/BottomModal";
import { Text } from "react-native-paper";
import { AIRMET, SIGMET } from "../../constants/constants";

type SigmetInfoProps = {
  visible: boolean;
  onClose: (b: boolean) => void;
  sigmets: ParsedSigmet[];
};

export default function SigmetInfoModal({
  visible,
  onClose,
  sigmets,
}: SigmetInfoProps) {
  return (
    <BottomModal visible={visible} onClose={() => onClose(false)}>
      <Text variant="titleLarge" style={{ marginBottom: 12 }}>
        Sigmet/Airmet Messages
      </Text>
      <FlatList
        data={sigmets}
        keyExtractor={(_, idx) => `msg-${idx}`}
        renderItem={({ item, index }) => (
          <View style={{ marginBottom: 16 }}>
            <Text
              variant="titleMedium"
              style={{
                fontWeight: "bold",
                color: item.type === "SIGMET" ? SIGMET : AIRMET,
              }}
            >
              {item.type} {index + 1}
            </Text>
            <Text variant="bodySmall" selectable>
              {item.message}
            </Text>
          </View>
        )}
      />
    </BottomModal>
  );
}
