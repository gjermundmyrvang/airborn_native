import { View } from "react-native";
import { WeatherInstantDetails } from "../types";
import { WeatherDetail } from "./WeatherDetail";
import { useTheme } from "react-native-paper";

type DetailProps = {
  details: WeatherInstantDetails;
  textSize?: "titleSmall" | "titleMedium" | "bodyMedium" | "bodySmall";
};

export const WeatherDetailsList = ({
  details,
  textSize = "bodyMedium",
}: DetailProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={{ padding: 10, backgroundColor: colors.surface, borderRadius: 16 }}
    >
      {detailConfig.map(({ key, label, unit, icon }) => (
        <WeatherDetail
          key={key}
          label={label}
          icon={icon}
          value={details[key as keyof WeatherInstantDetails]}
          unit={unit}
          textSize={textSize}
        />
      ))}
    </View>
  );
};

const detailConfig = [
  {
    key: "air_pressure_at_sea_level",
    label: "Pressure",
    unit: "hPa",
    icon: "gauge",
  },
  {
    key: "air_temperature",
    label: "Temperature",
    unit: "°C",
    icon: "thermometer",
  },
  {
    key: "cloud_area_fraction",
    label: "Cloud Cover",
    unit: "%",
    icon: "weather-cloudy",
  },
  {
    key: "cloud_area_fraction_high",
    label: "High Clouds",
    unit: "%",
    icon: "weather-cloudy",
  },
  {
    key: "cloud_area_fraction_medium",
    label: "Medium Clouds",
    unit: "%",
    icon: "weather-cloudy",
  },
  {
    key: "cloud_area_fraction_low",
    label: "Low Clouds",
    unit: "%",
    icon: "weather-cloudy",
  },
  {
    key: "dew_point_temperature",
    label: "Dew Point",
    unit: "°C",
    icon: "water",
  },
  { key: "fog_area_fraction", label: "Fog", unit: "%", icon: "weather-fog" },
  {
    key: "relative_humidity",
    label: "Humidity",
    unit: "%",
    icon: "water-percent",
  },
  {
    key: "ultraviolet_index_clear_sky",
    label: "UV Index",
    unit: "",
    icon: "weather-sunny-alert",
  },
  {
    key: "wind_from_direction",
    label: "Wind Dir",
    unit: "°",
    icon: "compass",
  },
  {
    key: "wind_speed",
    label: "Wind Speed",
    unit: "m/s",
    icon: "weather-windy",
  },
] as const;
