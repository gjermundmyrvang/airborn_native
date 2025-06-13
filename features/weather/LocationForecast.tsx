import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";
import LazyCollapsible from "../../components/LazyCollapsible";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { LatLon } from "../../types/CommonTypes";
import { toDayMonthYear, toTime } from "../../utils/dateTimeConverter";
import { weatherIcons } from "../../utils/iconMapper";
import {
  WeatherApiResponse,
  WeatherInstantDetails,
  WeatherTimeseriesEntry,
} from "./types";
import { getWeatherData } from "./weatherservice";

type LocationProps = {
  pos: LatLon;
};

export default function LocationForecast({ pos }: LocationProps) {
  const [query, expanded, setExpanded] = useLazyQuery(["weather", pos], () =>
    getWeatherData(pos)
  );
  return (
    <LazyCollapsible
      title="Weather Forecast"
      icon="weather-cloudy-clock"
      loading={query.isLoading}
      error={query.error as Error | null}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      renderContent={() =>
        query.data ? <WeatherComponent weatherdata={query.data} /> : null
      }
    />
  );
}

type WeatherProps = {
  weatherdata: WeatherApiResponse;
};

function groupByDate(timeseries: WeatherTimeseriesEntry[]) {
  return timeseries.reduce<Record<string, WeatherTimeseriesEntry[]>>(
    (acc, entry) => {
      const dateKey = toDayMonthYear(entry.time);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(entry);
      return acc;
    },
    {}
  );
}

export const WeatherComponent = ({ weatherdata }: WeatherProps) => {
  const groupedDays = groupByDate(weatherdata);
  const dateKeys = Object.keys(groupedDays);

  // 2. State for selected date (initial: first date)
  const [selectedDate, setSelectedDate] = useState(dateKeys[0]);
  const [selectedHour, setSelectedHour] = useState(0);

  // 3. Get hours for selected date
  const hours = groupedDays[selectedDate];

  // 4. Get the selected hour entry
  const displayHour = hours[selectedHour];

  return (
    <View style={{ padding: 8 }}>
      <SelectedWeather
        time={displayHour.time}
        symbol={displayHour.data.next_1_hours?.summary.symbol_code}
        today={displayHour.data.instant.details}
      />
      {/* Hour selector */}
      <WeatherHours
        hours={hours}
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}
      />
      {/* Day selector */}
      <WeatherDays
        days={dateKeys}
        groupedDays={groupedDays}
        selectedDay={selectedDate}
        setSelectedDay={(day) => {
          setSelectedDate(day);
          setSelectedHour(0);
        }}
      />
    </View>
  );
};
// ------ WEATHER DAYS LOGIC ---------
type WeatherDaysProps = {
  days: string[];
  groupedDays: Record<string, WeatherTimeseriesEntry[]>;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
};

const WeatherDays = ({
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
