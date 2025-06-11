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
      <WeatherToday
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
// ------ WEATHER NOW LOGIC ---------
type TodayProps = {
  time: string;
  symbol?: string;
  today: WeatherInstantDetails;
};
const WeatherToday = ({ time, symbol, today }: TodayProps) => {
  return (
    <View>
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

function degreesToCompass(deg?: number): string {
  if (deg === undefined) return "";
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const ix = Math.round((deg % 360) / 22.5) % 16;
  return dirs[ix];
}

type WindDetailProps = {
  speed?: number;
  direction?: number;
  unit?: string;
};

export const WindDetail: React.FC<WindDetailProps> = ({
  speed,
  direction,
  unit = "m/s",
}) => {
  const { colors } = useTheme();
  // Arrow should point to where the wind is going (from + 180°)
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

type WeatherDetailsListProps = {
  details: WeatherInstantDetails;
  textSize?: "titleSmall" | "titleMedium" | "bodyMedium" | "bodySmall";
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

export const WeatherDetailsCollapsible: React.FC<WeatherDetailsListProps> = ({
  details,
  textSize = "bodyMedium",
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <LazyCollapsible
      title="More Weather Details"
      icon="widgets"
      expanded={expanded}
      onToggle={() => setExpanded((prev) => !prev)}
      renderContent={() => (
        <WeatherDetailsList details={details} textSize={textSize} />
      )}
      noDataMsg="No additional weather details"
    />
  );
};

export const WeatherDetailsList: React.FC<WeatherDetailsListProps> = ({
  details,
  textSize = "bodyMedium",
}) => (
  <View>
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

type WeatherDetailProps = {
  label?: string;
  icon?: string;
  value?: number | string;
  unit?: string;
  fallback?: string;
  textSize?: "titleSmall" | "titleMedium" | "bodyMedium" | "bodySmall";
};

export const WeatherDetail: React.FC<WeatherDetailProps> = ({
  label,
  icon,
  value,
  unit,
  fallback = "N/A",
  textSize = "titleSmall",
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      {icon && <Icon source={icon} size={16} color={colors.primary} />}
      <Text variant={textSize}>
        {label && <Text style={{ fontWeight: "bold" }}>{label}: </Text>}
        {value !== undefined && value !== null
          ? `${value}${unit ? ` ${unit}` : ""}`
          : fallback}
      </Text>
    </View>
  );
};

// ------ WEATHER HOURS LOGIC ---------
type WeatherHoursProps = {
  hours: WeatherTimeseriesEntry[];
  selectedHour: number;
  setSelectedHour: (idx: number) => void;
};

const WeatherHours = ({
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

  const symbol = hour.data.next_1_hours?.summary.symbol_code;

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
              minWidth: 100,
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
              {minTemp !== undefined && (
                <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
                  {minTemp}°C / {maxTemp}°C
                </Text>
              )}
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
};
