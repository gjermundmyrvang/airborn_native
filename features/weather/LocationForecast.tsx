import React, { useState } from "react";
import { View } from "react-native";
import LazyCollapsible from "../../components/LazyCollapsible";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { LatLon } from "../../types/CommonTypes";
import { toDayMonthYear } from "../../utils/dateTimeConverter";
import { SelectedWeather } from "./SelectedWeather";
import { WeatherApiResponse, WeatherTimeseriesEntry } from "./types";
import { WeatherDays } from "./WeatherDays";
import { WeatherHours } from "./WeatherHours";
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

  const [selectedDate, setSelectedDate] = useState(dateKeys[0]);
  const [selectedHour, setSelectedHour] = useState(0);

  const hours = groupedDays[selectedDate];

  const displayHour = hours[selectedHour];

  return (
    <View style={{ padding: 8, gap: 12 }}>
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
