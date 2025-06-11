import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Icon, Text, useTheme } from "react-native-paper";
import { LatLon } from "../../types/CommonTypes";
import { useSunriseQuery } from "./useSunriseQuery";
import { toTime } from "../../utils/dateTimeConverter";

type SunriseProps = {
  place: LatLon;
};

export default function Sunrise({ place }: SunriseProps) {
  const { data, isLoading, error } = useSunriseQuery(place);
  const { colors } = useTheme();
  return (
    <View style={{ alignSelf: "center", marginVertical: 10 }}>
      {isLoading && <ActivityIndicator color={colors.tertiary} />}
      {error && <Text variant="titleMedium">Error loading sunrise</Text>}
      {data && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon
              source="weather-sunset-up"
              size={20}
              color={colors.tertiary}
            />
            <Text variant="titleSmall">
              {toTime(data.properties.sunrise.time)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon
              source="weather-sunset-down"
              size={20}
              color={colors.tertiary}
            />
            <Text variant="titleSmall">
              {toTime(data.properties.sunset.time)} (LT)
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
