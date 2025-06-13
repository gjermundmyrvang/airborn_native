import { Card, Text, useTheme } from "react-native-paper";
import { WeatherTimeseriesEntry } from "./types";
import { Image, ScrollView } from "react-native";
import { weatherIcons } from "../../utils/iconMapper";

type WeatherDaysProps = {
  days: string[];
  groupedDays: Record<string, WeatherTimeseriesEntry[]>;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
};

export const WeatherDays = ({
  days,
  groupedDays,
  selectedDay,
  setSelectedDay,
}: WeatherDaysProps) => {
  const { colors } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: 10 }}
    >
      {days.map((day) => {
        const firstHour = groupedDays[day]?.[0];
        const minTemp =
          firstHour?.data.next_6_hours?.details.air_temperature_min;
        const maxTemp =
          firstHour?.data.next_6_hours?.details.air_temperature_max;
        const symbol =
          firstHour?.data.next_12_hours?.summary.symbol_code ??
          firstHour?.data.next_6_hours?.summary.symbol_code ??
          firstHour?.data.next_1_hours?.summary.symbol_code;
        return (
          <Card
            key={day}
            onPress={() => setSelectedDay(day)}
            style={{
              marginRight: 8,
              backgroundColor: "transparent",
              borderColor:
                day === selectedDay ? colors.primary : colors.outlineVariant,
              minWidth: 130,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
            }}
          >
            <Card.Content style={{ alignItems: "center" }}>
              <Text
                variant="titleSmall"
                style={{
                  color:
                    day === selectedDay ? colors.primary : colors.onSurface,
                  fontWeight: day === selectedDay ? "bold" : "normal",
                }}
              >
                {day.split(" ").slice(0, 2).join(" ")}
              </Text>
              {symbol && weatherIcons[symbol] && (
                <Image
                  source={weatherIcons[symbol]}
                  style={{ width: 32, height: 32, marginVertical: 2 }}
                />
              )}
              {minTemp !== undefined ? (
                <Text variant="bodySmall">
                  {minTemp}°C / {maxTemp}°C
                </Text>
              ) : (
                <Text variant="bodySmall">NA / NA</Text>
              )}
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
};
