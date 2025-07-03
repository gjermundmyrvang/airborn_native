import { Image, View } from "react-native";
import { Text } from "react-native-paper";
import { toTime } from "../../utils/dateTimeConverter";
import { weatherIcons } from "../../utils/iconMapper";
import { WeatherInstantDetails } from "./types";
import { WeatherDetail } from "./weathercomponents/WeatherDetail";
import { WeatherDetailsCollapsible } from "./weathercomponents/WeatherDetailsCollapsible";
import { WindDetail } from "./weathercomponents/WindDetail";

type SelectedWeatherProps = {
  time: string;
  symbol?: string;
  today: WeatherInstantDetails;
};
export const SelectedWeather = ({
  time,
  symbol,
  today,
}: SelectedWeatherProps) => {
  return (
    <View style={{ paddingHorizontal: 6, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View>
          <Text variant="titleLarge">Today {toTime(time)}</Text>
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
