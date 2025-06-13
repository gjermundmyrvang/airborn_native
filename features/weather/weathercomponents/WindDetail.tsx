import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { WeatherDetail } from "./WeatherDetail";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { degreesToCompass } from "../../../utils/geoUtils";

type WindDetailProps = {
  speed?: number;
  direction?: number;
  unit?: string;
};

export const WindDetail = ({
  speed,
  direction,
  unit = "m/s",
}: WindDetailProps) => {
  const { colors } = useTheme();

  const arrowRotation = direction !== undefined ? (direction + 180) % 360 : 0;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <WeatherDetail
        icon="weather-windy"
        value={speed}
        unit={unit}
        textSize="titleMedium"
      />
      {direction !== undefined && (
        <>
          <Text variant="titleMedium">
            {`${direction}° ${degreesToCompass(direction)}`}
          </Text>
          <MaterialCommunityIcons
            name="arrow-up"
            size={20}
            color={colors.primary}
            style={{ transform: [{ rotate: `${arrowRotation}deg` }] }}
          />
        </>
      )}
    </View>
  );
};
