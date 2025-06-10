import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Airport } from "../../data/airports";
import { FlightscreenTabParamList } from "../../navigation/types";
import Sunrise from "../../features/sunrise/Sunrise";
import Metar from "../../features/metartaf/Metar";

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
    </ScrollView>
  );
};
