import { StyleSheet } from "react-native";
import { AnimatedFAB, useTheme } from "react-native-paper";

type FABProps = {
  visible: boolean;
  extended: boolean;
  label: string;
  onPress: () => void;
};

export const MyFAB = ({ visible, extended, label, onPress }: FABProps) => {
  const { colors } = useTheme();
  return (
    <AnimatedFAB
      icon="airplane"
      label={extended ? label : ""}
      extended={extended}
      onPress={onPress}
      visible={visible}
      style={[styles.fabStyle, { backgroundColor: colors.background }]}
      color={colors.onBackground}
    />
  );
};

const styles = StyleSheet.create({
  fabStyle: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
