import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  Button,
  Divider,
  IconButton,
  List,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { BottomModal } from "../components/BottomModal";
import { MyFAB } from "../components/FAB";
import { LATITUDE, LONGITUDE } from "../constants/constants";
import { Airport, airports } from "../data/airports";
import { RootStackParamList } from "../navigation/types";
import { updateFavorites } from "../data/store";

const airportsData = airports;

export default function Homescreen() {
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useState<string[] | null>(null);
  const [departure, setDeparture] = useState<string | null>(null);
  const [arrival, setArrival] = useState<string | null>(null);
  const [depAirport, setDepAirport] = useState<Airport | null>(null);
  const [arrAirport, setArrAirport] = useState<Airport | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [activeField, setActiveField] = useState<
    "departure" | "arrival" | null
  >(null);
  const [search, setSearch] = useState("");

  const { colors } = useTheme();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();

  const filteredAirports = airportsData.filter((a) => {
    if (!search) {
      return favorites?.includes(a.name);
    }
    return (
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.icao.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleGoToBrief = () => {
    if (!depAirport) return;
    setShowModal(false);
    navigation.navigate("Flightscreen", {
      departure: depAirport,
      arrival: arrAirport ?? null,
    });
  };

  const handleNewTrip = () => {
    setShowModal(true);
  };

  const switchDepartureArrival = () => {
    const dep = departure;
    const depAir = depAirport;
    setDeparture(arrival);
    setDepAirport(arrAirport);
    setArrival(dep);
    setArrAirport(depAir);
  };

  const handleMarkerPressed = (airport: Airport) => {
    setSelectedAirport(airport);
  };

  const handleToggleFavorite = async (airport: string) => {
    let updated: string[];
    if (favorites?.includes(airport)) {
      updated = favorites.filter((d: string) => d !== airport);
    } else {
      updated = favorites ? [...favorites, airport] : [airport];
    }
    await updateFavorites(updated);
    setFavorites(updated);
  };

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: 0.09,
          longitudeDelta: 0.09,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {airportsData.map((d) => (
          <Marker
            key={d.icao}
            coordinate={d}
            onPress={() => handleMarkerPressed(d)}
          />
        ))}
      </MapView>
      {selectedAirport && (
        <AirportHighlight
          airport={selectedAirport}
          setAirport={setSelectedAirport}
          setDeparture={setDepAirport}
          setArrival={setArrAirport}
          setShowModal={setShowModal}
        />
      )}
      <BottomModal visible={showModal} onClose={() => setShowModal(false)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text variant="titleLarge">Prepare Trip</Text>
          <IconButton
            icon="close"
            iconColor={colors.onBackground}
            size={20}
            onPress={() => setShowModal(false)}
          />
        </View>
        <View style={{ position: "relative" }}>
          <TextInput
            label="Departure airport"
            value={departure ?? depAirport?.name ?? ""}
            onFocus={() => {
              setActiveField("departure");
              setSearch("");
            }}
            onChangeText={(text) => {
              setDeparture(text);
              setSearch(text);
            }}
            mode="outlined"
            outlineColor={colors.onBackground}
            activeOutlineColor={colors.primary}
            textColor={colors.onBackground}
            style={{ marginTop: 10 }}
            left={
              <TextInput.Icon
                icon="airplane-takeoff"
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
                  setDeparture(null);
                  setDepAirport(null);
                }}
              />
            }
          />
          <TextInput
            label="Arrival airport"
            value={arrival ?? arrAirport?.name ?? ""}
            disabled={depAirport === null}
            onFocus={() => {
              setActiveField("arrival");
              setSearch("");
            }}
            onChangeText={(text) => {
              setArrival(text);
              setSearch(text);
            }}
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
                  setArrival(null);
                  setArrAirport(null);
                }}
              />
            }
          />
          <IconButton
            icon="arrow-up-down"
            iconColor={colors.primary}
            size={30}
            onPress={switchDepartureArrival}
            style={{
              position: "absolute",
              top: 45,
              right: 50,
              zIndex: 2,
              backgroundColor: colors.background,
            }}
          />
        </View>
        {activeField && <Divider style={{ marginVertical: 10 }} />}
        {activeField && (
          <FlatList
            style={{ flex: 1 }}
            data={filteredAirports}
            keyExtractor={(item: Airport) => item.icao}
            renderItem={({ item }: { item: Airport }) => (
              <List.Item
                title={item.icao}
                titleStyle={{ color: colors.primary }}
                description={item.name}
                descriptionStyle={{ color: colors.onBackground }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="airplane"
                    color={colors.tertiary}
                  />
                )}
                right={() => (
                  <IconButton
                    icon={
                      favorites?.includes(item.name) ? "star" : "star-outline"
                    }
                    onPress={() => handleToggleFavorite(item.name)}
                    size={20}
                    iconColor={colors.tertiary}
                  />
                )}
                onPress={() => {
                  if (activeField === "departure") {
                    setDeparture(item.name);
                    setDepAirport(item);
                  } else {
                    setArrival(item.name);
                    setArrAirport(item);
                    setActiveField(null);
                  }
                }}
              />
            )}
            ListEmptyComponent={<Text>No airports found</Text>}
          />
        )}
        {depAirport && (
          <Button
            icon="arrow-right-bold"
            onPress={handleGoToBrief}
            style={{ marginVertical: 50 }}
          >
            Go To Brief
          </Button>
        )}
      </BottomModal>
      <MyFAB
        visible={true}
        extended={true}
        label="New Trip"
        onPress={handleNewTrip}
      />
    </View>
  );
}

type AirportHighlightProps = {
  airport: Airport;
  setDeparture: (airport: Airport) => void;
  setArrival: (airport: Airport) => void;
  setShowModal: (set: boolean) => void;
  setAirport: (airport: Airport | null) => void;
};

const AirportHighlight = ({
  airport,
  setDeparture,
  setArrival,
  setShowModal,
  setAirport,
}: AirportHighlightProps) => {
  const { colors } = useTheme();
  const handleSetDeparture = () => {
    setDeparture(airport);
    setShowModal(true);
    setAirport(null);
  };
  const handleSetArrival = () => {
    setArrival(airport);
    setShowModal(true);
    setAirport(null);
  };
  return (
    <Surface
      style={{
        position: "absolute",
        top: 50,
        left: "5%",
        right: "5%",
        alignSelf: "center",
        padding: 16,
        borderRadius: 16,
        elevation: 4,
        zIndex: 10,
        backgroundColor: colors.surface,
        opacity: 0.9,
      }}
      elevation={4}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="titleMedium">{airport.name}</Text>
        <IconButton
          icon="close"
          size={20}
          onPress={() => setAirport(null)}
          iconColor={colors.onPrimary}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="titleSmall">{airport.icao}</Text>
        <Text variant="titleSmall">Lat: {airport.latitude}</Text>
        <Text variant="titleSmall">Lon: {airport.longitude}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button icon="airplane-takeoff" onPress={handleSetDeparture}>
          Departure
        </Button>
        <Button icon="airplane-landing" onPress={handleSetArrival}>
          Arrival
        </Button>
      </View>
    </Surface>
  );
};
