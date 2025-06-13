import { FlatList, Keyboard, View } from "react-native";
import React, { useState } from "react";
import { Airport } from "../data/airports";
import { BottomModal } from "./BottomModal";
import { Button, IconButton, List, Text, TextInput } from "react-native-paper";

type TripModalProps = {
  visible: boolean;
  onClose: () => void;
  airports: Airport[];
  favorites: string[];
  colors: any;
  depAirport: Airport | null;
  arrAirport: Airport | null;
  departure: string | null;
  arrival: string | null;
  setDeparture: (val: string | null) => void;
  setArrival: (val: string | null) => void;
  setDepAirport: (airport: Airport | null) => void;
  setArrAirport: (airport: Airport | null) => void;
  handleToggleFavorite: (icao: string) => void;
  handleGoToBrief: () => void;
};

export default function TripModal({
  visible,
  onClose,
  airports,
  favorites,
  colors,
  depAirport,
  arrAirport,
  departure,
  arrival,
  setDeparture,
  setArrival,
  setDepAirport,
  setArrAirport,
  handleToggleFavorite,
  handleGoToBrief,
}: TripModalProps) {
  const [activeField, setActiveField] = useState<
    "departure" | "arrival" | null
  >(null);
  const [search, setSearch] = useState("");

  const filteredAirports = airports.filter((a) => {
    if (!search) {
      return favorites.includes(a.icao);
    }
    return (
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.icao.toLowerCase().includes(search.toLowerCase())
    );
  });

  const switchDepartureArrival = () => {
    setDeparture(arrival);
    setDepAirport(arrAirport);
    setArrival(departure);
    setArrAirport(depAirport);
  };
  return (
    <BottomModal visible={visible} onClose={onClose}>
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
          onPress={onClose}
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
                  icon={
                    favorites?.includes(item.icao) ? "star" : "star-outline"
                  }
                  onPress={() => handleToggleFavorite(item.icao)}
                  size={20}
                  iconColor={colors.tertiary}
                />
              )}
              onPress={() => {
                Keyboard.dismiss();
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
          ListEmptyComponent={
            <Text variant="titleMedium" style={{ marginTop: 8 }}>
              Begin typing to see airports
            </Text>
          }
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
  );
}
