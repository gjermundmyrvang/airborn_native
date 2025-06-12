import React, { useState } from "react";
import { View } from "react-native";
import { List, Text, useTheme } from "react-native-paper";
import LazyCollapsible from "../../components/LazyCollapsible";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { parseMetar } from "../../utils/parseMetar";
import { getMetarTafData, nearbyWithMetar } from "./service";
import { ParsedMetar } from "./types";
import { Airport } from "../../data/airports";
import { DistanceMenu } from "../../components/DistanceInfo";

export default function Metar({
  icao: initialIcao,
  airport: initialAirport,
}: {
  icao: string;
  airport: Airport;
}) {
  const [selectedIcao, setSelectedIcao] = useState(initialIcao);
  const [selectedAirport, setSelectedAirport] = useState(initialAirport);

  const [query, expanded, setExpanded] = useLazyQuery(
    ["metar", selectedIcao],
    () => getMetarTafData(selectedIcao)
  );

  const handleNearbySelect = (airport: Airport) => {
    setSelectedIcao(airport.icao);
    setSelectedAirport(airport);
  };

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
        query.data ? (
          <MetarComponent metar={query.data} />
        ) : (
          <NearbyAirports
            airport={selectedAirport}
            onSelect={handleNearbySelect}
          />
        )
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

type NearbyAirportsProps = {
  airport: Airport;
  onSelect: (airport: Airport) => void;
};

const NearbyAirports = ({ airport, onSelect }: NearbyAirportsProps) => {
  const max = 10;
  const nearby = nearbyWithMetar(airport, max);
  const { colors } = useTheme();
  if (nearby.length === 0) {
    return <Text>No airports nearby that has metar</Text>;
  }
  return (
    <View>
      <Text variant="titleLarge" style={{ marginLeft: 18 }}>
        Nearby airports with metar:
      </Text>
      {nearby.map((d) => (
        <List.Item
          key={d.icao}
          title={d.name}
          description={d.icao}
          descriptionStyle={{ color: colors.primary }}
          style={{
            backgroundColor: colors.surface,
            marginTop: 8,
            marginHorizontal: 8,
            borderRadius: 16,
          }}
          right={() => <DistanceMenu a={airport} b={d} />}
          onPress={() => onSelect(d)}
        />
      ))}
    </View>
  );
};
