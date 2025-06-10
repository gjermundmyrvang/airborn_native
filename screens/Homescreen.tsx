import React, { useState } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { LATITUDE, LONGITUDE } from "../constants/constants";
import { MyFAB } from "../components/FAB";
import { airports } from "../data/airports";
import { BottomModal } from "../components/BottomModal";
import { Text } from "react-native-paper";

const airportsData = airports;

export default function Homescreen() {
  const [fabExtended, setFabExtended] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const handleNewTrip = () => {
    setShowModal(true);
  };
  const handleMove = (moving: boolean) => {
    setTimeout(() => setFabExtended(!moving), 200);
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
          <Text variant="titleLarge">MORN</Text>
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
