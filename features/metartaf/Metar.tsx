import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import LazyCollapsible from "../../components/LazyCollapsible";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { parseMetar } from "../../utils/parseMetar";
import { getMetarTafData } from "./service";
import { ParsedMetar } from "./types";

export default function Metar({ icao }: { icao: string }) {
  const [query, expanded, setExpanded] = useLazyQuery(["metar", icao], () =>
    getMetarTafData(icao)
  );
  return (
    <LazyCollapsible
      title="Metar"
      icon="weather-cloudy"
      noDataMsg="Selected Airport doesn't have METAR"
      loading={query.isLoading}
      error={query.error as Error | null}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      renderContent={() =>
        query.data ? <MetarComponent metar={query.data} /> : null
      }
    />
  );
}

type MetarComponentProps = {
  metar: string;
};
const MetarComponent = ({ metar }: MetarComponentProps) => {
  const data: ParsedMetar = parseMetar(metar);
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.secondary,
        marginVertical: 4,
      }}
    >
      <Text variant="titleSmall" style={{ marginBottom: 4 }}>
        {data.station} METAR
      </Text>
      <Text variant="bodyMedium">Time: {data.time}Z</Text>
      <Text variant="bodyMedium">Wind: {data.wind}</Text>
      <Text variant="bodyMedium">Visibility: {data.visibility}</Text>
      <Text variant="bodyMedium">Weather: {data.weather}</Text>
      <Text variant="bodyMedium">Temp/Dew: {data.temp}</Text>
      <Text variant="bodyMedium">Pressure: {data.pressure}</Text>
      <Text
        variant="labelSmall"
        style={{ marginTop: 8, color: colors.tertiary }}
      >
        {data.raw}
      </Text>
    </View>
  );
};
