import React, { useState } from "react";
import { FlatList, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  Button,
  Divider,
  IconButton,
  List,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { BottomModal } from "../components/BottomModal";
import { MyFAB } from "../components/FAB";
import { LATITUDE, LONGITUDE } from "../constants/constants";
import { Airport, airports } from "../data/airports";

const airportsData = airports;

export default function Homescreen() {
  const [showModal, setShowModal] = useState(false);
  const [departure, setDeparture] = useState<string | null>(null);
  const [arrival, setArrival] = useState<string | null>(null);
  const [depAirport, setDepAirport] = useState<Airport | null>(null);
  const [arrAirport, setArrAirport] = useState<Airport | null>(null);
  const [activeField, setActiveField] = useState<
    "departure" | "arrival" | null
  >(null);
  const [search, setSearch] = useState("");

  const { colors } = useTheme();

  const filteredAirports = airportsData.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.icao.toLowerCase().includes(search.toLowerCase())
  );

  const handleGoToBrief = () => {
    console.log("Departure:", depAirport);
  };

  const handleNewTrip = () => {
    setShowModal(true);
  };

  const switchDepartureArrival = () => {
    const dep = departure;
    setDeparture(arrival);
    setArrival(dep);
  };

  return (
    <View
      style={{
        flex: 1,
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
          <Marker key={d.icao} title={d.name} coordinate={d}></Marker>
        ))}
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
              value={departure ?? ""}
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
              value={arrival ?? ""}
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
              icon="arrow-collapse-vertical"
              iconColor={colors.primary}
              size={40}
              onPress={switchDepartureArrival}
              style={{
                position: "absolute",
                top: 40,
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
      </MapView>
    </View>
  );
}
