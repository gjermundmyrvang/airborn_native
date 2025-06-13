import { Image, ScrollView, View } from "react-native";
import { WeatherTimeseriesEntry } from "./types";
import { Card, Icon, Text, useTheme } from "react-native-paper";
import { toTime } from "../../utils/dateTimeConverter";
import { weatherIcons } from "../../utils/iconMapper";

type WeatherHoursProps = {
  hours: WeatherTimeseriesEntry[];
  selectedHour: number;
  setSelectedHour: (idx: number) => void;
};

export const WeatherHours = ({
  hours,
  selectedHour,
  setSelectedHour,
}: WeatherHoursProps) => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      {hours.map((d, i) => (
        <HourCard
          hour={d}
          key={d.time}
          isSelected={i === selectedHour}
          onPress={() => setSelectedHour(i)}
        />
      ))}
    </ScrollView>
  );
};

type HourCardProps = {
  isSelected: boolean;
  hour: WeatherTimeseriesEntry;
  onPress: () => void;
};

const HourCard = ({ isSelected, hour, onPress }: HourCardProps) => {
  const { colors } = useTheme();
  const rainAmount =
    hour.data.next_1_hours?.details.precipitation_amount ??
    hour.data.next_6_hours?.details.precipitation_amount ??
    0;

  const symbol =
    hour.data.next_1_hours?.summary.symbol_code ??
    hour.data.next_6_hours?.summary.symbol_code ??
    hour.data.next_12_hours?.summary.symbol_code;

  return (
    <Card
      style={{
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundColor: "transparent",
        minWidth: 100,
      }}
      onPress={onPress}
    >
      <Text variant="titleMedium">{toTime(hour.time)}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Icon source="water" size={16} color={colors.primary} />
        <Text variant="titleSmall" style={{ color: colors.primary }}>
          {rainAmount} %
        </Text>
      </View>
      {symbol && (
        <Image
          source={weatherIcons[symbol]}
          style={{ width: 50, height: 50 }}
        />
      )}
      <Text variant="titleMedium">
        {hour.data.instant.details.air_temperature}°C
      </Text>
      {isSelected && (
        <View
          style={{
            width: "100%",
            height: 8,
            backgroundColor: colors.tertiary,
            borderRadius: 24,
          }}
        />
      )}
    </Card>
  );
};
