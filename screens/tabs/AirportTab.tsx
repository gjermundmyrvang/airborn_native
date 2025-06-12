import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { FlatList, Keyboard, ScrollView, View } from "react-native";
import {
  IconButton,
  List,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Airport, airports } from "../../data/airports";
import Metar from "../../features/metartaf/Metar";
import Sunrise from "../../features/sunrise/Sunrise";
import Turbulence from "../../features/turbulence/Turbulence";
import LocationForecast from "../../features/weather/LocationForecast";
import { FlightscreenTabParamList } from "../../navigation/types";
import { getFavorites, updateFavorites } from "../../data/store";

type AirportTabProps = BottomTabScreenProps<
  FlightscreenTabParamList,
  "AirportTab"
>;

export default function AirportTab({ route }: AirportTabProps) {
  const { departure, arrival } = route.params;
  const [airport, setAirport] = useState<Airport | null>(
    departure ?? arrival ?? null
  );

  if (!airport) return <NoArrivalComponent setArrAirport={setAirport} />;
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
          style={{
            fontWeight: "800",
            color: colors.primary,
          }}
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
          <Text variant="titleSmall">{airportNameParts[0]}</Text>
          {airportNameParts[1] && (
            <>
              <Text
                variant="titleSmall"
                style={{ color: colors.primary, fontWeight: "800" }}
              >
                /
              </Text>
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

type ArrivalProps = {
  setArrAirport: (arrival: Airport) => void;
};

const NoArrivalComponent = ({ setArrAirport }: ArrivalProps) => {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeField, setActiveField] = useState(false);

  const { colors } = useTheme();

  useEffect(() => {
    const loadFavorites = async () => {
      const savedFavorites = await getFavorites();
      setFavorites(savedFavorites ?? []);
    };
    loadFavorites();
  }, []);

  const filteredAirports = airports.filter((a) => {
    if (!search) {
      return favorites.includes(a.icao);
    }
    return (
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.icao.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleToggleFavorite = async (icao: string) => {
    let updated: string[];
    if (favorites.includes(icao)) {
      updated = favorites.filter((d) => d !== icao);
    } else {
      updated = [...favorites, icao];
    }
    await updateFavorites(updated);
    setFavorites(updated);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 8 }}>
      <TextInput
        label="Arrival airport"
        value={search}
        onFocus={() => {
          setSearch("");
          setActiveField(true);
        }}
        onChangeText={setSearch}
        mode="outlined"
        outlineColor={colors.onBackground}
        activeOutlineColor={colors.primary}
        textColor={colors.onBackground}
        style={{ marginTop: 10 }}
        left={
          <TextInput.Icon
            icon="airplane-landing"
            size={20}
            color={colors.tertiary}
          />
        }
        right={
          <TextInput.Icon
            icon="close"
            size={20}
            color={colors.onBackground}
            onPress={() => {
              setSearch("");
              setActiveField(false);
            }}
          />
        }
      />
      {activeField && (
        <FlatList
          style={{ flex: 1 }}
          data={filteredAirports}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item: Airport) => item.icao}
          renderItem={({ item }: { item: Airport }) => (
            <List.Item
              title={item.icao}
              titleStyle={{ color: colors.primary }}
              description={item.name}
              descriptionStyle={{ color: colors.onBackground }}
              left={(props) => (
                <List.Icon {...props} icon="airplane" color={colors.tertiary} />
              )}
              right={() => (
                <IconButton
                  icon={favorites.includes(item.icao) ? "star" : "star-outline"}
                  onPress={() => handleToggleFavorite(item.icao)}
                  size={20}
                  iconColor={colors.tertiary}
                />
              )}
              onPress={() => {
                Keyboard.dismiss();
                setArrAirport(item);
                setActiveField(false);
              }}
            />
          )}
          ListEmptyComponent={<Text>No airports found</Text>}
        />
      )}
    </View>
  );
};
