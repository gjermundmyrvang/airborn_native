import { Image, View } from "react-native";
import { Text } from "react-native-paper";
import {
  toDateTime,
  toDayMonthYear,
  toTime,
} from "../../utils/dateTimeConverter";
import { weatherIcons } from "../../utils/iconMapper";
import { WeatherInstantDetails } from "./types";
import { WeatherDetail } from "./weathercomponents/WeatherDetail";
import { WeatherDetailsCollapsible } from "./weathercomponents/WeatherDetailsCollapsible";
import { WindDetail } from "./weathercomponents/WindDetail";

type SelectedWeatherProps = {
  time: string;
  symbol?: string;
  today: WeatherInstantDetails;
  selectedDate: string;
};
export const SelectedWeather = ({
  time,
  symbol,
  today,
  selectedDate,
}: SelectedWeatherProps) => {
  const isToday = selectedDate === toDayMonthYear(new Date().toISOString());
  const dateLabel = isToday
    ? "Today"
    : selectedDate.split(" ").slice(0, 2).join(" ");
  return (
    <View style={{ paddingHorizontal: 6, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View>
          <Text variant="titleLarge">
            {dateLabel} {toTime(time)}
          </Text>
          <WeatherDetail
            icon="sun-thermometer"
            value={today.air_temperature}
            unit="°C"
            textSize="titleMedium"
          />
          <WindDetail
            speed={today.wind_speed}
            direction={today.wind_from_direction}
            unit="m/s"
          />
        </View>
        {symbol && weatherIcons[symbol] && (
          <Image
            source={weatherIcons[symbol]}
            style={{ width: 80, height: 80 }}
          />
        )}
      </View>
      <WeatherDetailsCollapsible details={today} textSize="bodyMedium" />
    </View>
  );
};
