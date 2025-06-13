import { View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

type WeatherDetailProps = {
  label?: string;
  icon?: string;
  value?: number | string;
  unit?: string;
  fallback?: string;
  textSize?: "titleSmall" | "titleMedium" | "bodyMedium" | "bodySmall";
};

export const WeatherDetail = ({
  label,
  icon,
  value,
  unit,
  fallback = "N/A",
  textSize = "titleSmall",
}: WeatherDetailProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      {icon && <Icon source={icon} size={16} color={colors.primary} />}
      <Text variant={textSize}>
        {label && <Text style={{ fontWeight: "bold" }}>{label}: </Text>}
        {value !== undefined && value !== null
          ? `${value}${unit ? ` ${unit}` : ""}`
          : fallback}
      </Text>
    </View>
  );
};
