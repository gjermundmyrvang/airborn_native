import React, { useState } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { LATITUDE, LONGITUDE } from "../constants/constants";
import { MyFAB } from "../components/FAB";
import { airports } from "../data/airports";
import { BottomModal } from "../components/BottomModal";
import {
  Icon,
  IconButton,
  Text,
  TextInput,
  TextInputIconProps,
  useTheme,
} from "react-native-paper";

const airportsData = airports;

export default function Homescreen() {
  const [fabExtended, setFabExtended] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [departure, setDeparture] = useState<string | null>(null);
  const [arrival, setArrival] = useState<string | null>(null);

  const { colors } = useTheme();

  const handleNewTrip = () => {
    setShowModal(true);
  };
  const handleMove = (moving: boolean) => {
    setTimeout(() => setFabExtended(!moving), 200);
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
        onRegionChange={() => handleMove(true)}
        onRegionChangeComplete={() => handleMove(false)}
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
              onChangeText={(text) => setDeparture(text)}
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
                  onPress={() => setDeparture(null)}
                />
              }
            />
            <TextInput
              label="Arrival airport"
              value={arrival ?? ""}
              onChangeText={(text) => setArrival(text)}
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
                  onPress={() => setArrival(null)}
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
        </BottomModal>
        <MyFAB
          visible={true}
          extended={fabExtended}
          label="New Trip"
          onPress={handleNewTrip}
        />
      </MapView>
    </View>
  );
}
