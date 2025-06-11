import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Airport } from "../../data/airports";
import Metar from "../../features/metartaf/Metar";
import Sunrise from "../../features/sunrise/Sunrise";
import Turbulence from "../../features/turbulence/Turbulence";
import LocationForecast from "../../features/weather/LocationForecast";
import { FlightscreenTabParamList } from "../../navigation/types";

// Example dummy WeatherApiResponse for testing
const dummyWeatherApiResponse = [
  {
    time: "2025-06-11T11:00:00Z",
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 1022.7,
          air_temperature: 18.5,
          cloud_area_fraction: 75,
          cloud_area_fraction_high: 20,
          cloud_area_fraction_low: 30,
          cloud_area_fraction_medium: 25,
          dew_point_temperature: 12.3,
          fog_area_fraction: 0,
          relative_humidity: 64.1,
          ultraviolet_index_clear_sky: 5,
          wind_from_direction: 180,
          wind_speed: 3.2,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "rainshowers_day" },
        details: { precipitation_amount: 10 },
      },
      next_6_hours: {
        summary: { symbol_code: "rainshowers_day" },
        details: {
          air_temperature_max: 21.0,
          air_temperature_min: 15.0,
          precipitation_amount: 1.2,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "clearsky_day" },
        details: {},
      },
    },
  },
  {
    time: "2025-06-12T12:00:00Z",
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 1022.7,
          air_temperature: 15.5,
          cloud_area_fraction: 75,
          cloud_area_fraction_high: 20,
          cloud_area_fraction_low: 30,
          cloud_area_fraction_medium: 20,
          dew_point_temperature: 15.3,
          fog_area_fraction: 0,
          relative_humidity: 74.1,
          ultraviolet_index_clear_sky: 4,
          wind_from_direction: 180,
          wind_speed: 6.2,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "clearsky_day" },
        details: { precipitation_amount: 0 },
      },
      next_6_hours: {
        summary: { symbol_code: "clearsky_day" },
        details: {
          air_temperature_max: 26.0,
          air_temperature_min: 12.0,
          precipitation_amount: 5.2,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "clearsky_day" },
        details: {},
      },
    },
  },
];

type AirportTabProps = BottomTabScreenProps<FlightscreenTabParamList, any>;

export default function AirportTab({ route }: AirportTabProps) {
  const airport =
    (route.params as any).departure ?? (route.params as any).arrival;
  if (!airport) return <Text>No airport selected.</Text>;
  return <AirportInfo airport={airport} />;
}

type AirportInfoProps = {
  airport: Airport;
};

const AirportInfo = ({ airport }: AirportInfoProps) => {
  const { colors } = useTheme();
  const airportNameParts = airport.name.split(",");
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 50, marginHorizontal: 20 }}>
        <Text
          variant="titleMedium"
          style={{ fontWeight: "800", color: colors.primary }}
        >
          {airport.icao}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text variant="titleSmall">{airportNameParts.slice(0, 1)}</Text>
          {airportNameParts[1] && (
            <>
              <Text variant="titleSmall">/</Text>
              <Text variant="titleSmall">{airportNameParts[1]}</Text>
            </>
          )}
        </View>
      </View>
      <Sunrise
        place={{
          latitude: airport.latitude,
          longitude: airport.longitude,
        }}
      />
      <Metar icao={airport.icao} />
      <Turbulence icao={airport.icao} />
      <LocationForecast
        pos={{
          latitude: airport.latitude,
          longitude: airport.longitude,
        }}
      />
    </ScrollView>
  );
};
