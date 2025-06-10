import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { useTheme } from "react-native-paper";

type BottomModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const BottomModal: React.FC<BottomModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  const { colors } = useTheme();
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropTransitionOutTiming={0}
    >
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        {children}
      </View>
    </Modal>
  );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    zIndex: 10,
  },
  content: {
    height: height * 0.9,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
});
