import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { Button, Card, Icon, Menu, Text, useTheme } from "react-native-paper";
import { FlightscreenTabParamList } from "../../navigation/types";
import { ScrollView, View } from "react-native";
import { haversineDistance } from "../../utils/geoUtils";

type OverallTabProps = BottomTabScreenProps<
  FlightscreenTabParamList,
  "Overall"
>;

export default function OverallTab({ route, navigation }: OverallTabProps) {
  const { departure, arrival } = route.params;
  const { colors } = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      {departure && arrival && (
        <DistanceInfoBox departure={departure} arrival={arrival} />
      )}
    </ScrollView>
  );
}

type DistanceInfoBoxProps = {
  departure: { name: string; latitude: number; longitude: number };
  arrival: { name: string; latitude: number; longitude: number };
};

export function DistanceInfoBox({ departure, arrival }: DistanceInfoBoxProps) {
  const [visible, setVisible] = useState(false);
  const [unit, setUnit] = useState<"km" | "nm" | "m">("km");
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const { colors } = useTheme();
  const distance = haversineDistance(departure, arrival);

  let displayValue: string;
  switch (unit) {
    case "nm":
      displayValue = distance.toString("nm");
      break;
    case "m":
      displayValue = distance.toString("m");
      break;
    default:
      displayValue = distance.toString("km");
  }
  return (
    <View>
      <Text
        variant="titleMedium"
        style={{ color: colors.primary, marginBottom: 8 }}
      >
        Distance between airports
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Icon source="airplane-takeoff" size={20} color={colors.primary} />
        <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
          {departure.name}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Icon source="airplane-landing" size={20} color={colors.primary} />
        <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
          {arrival.name}
        </Text>
        <Icon source="arrow-right" size={20} color={colors.primary} />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button
              onPress={openMenu}
              style={{ backgroundColor: colors.secondary }}
            >
              <Text
                variant="bodyLarge"
                style={{
                  fontWeight: "bold",
                  color: colors.primary,
                }}
              >
                {displayValue}
              </Text>
            </Button>
          }
          anchorPosition="bottom"
          mode="flat"
          contentStyle={{ backgroundColor: colors.secondary, marginTop: 6 }}
        >
          <Menu.Item
            onPress={() => {
              setUnit("km");
              closeMenu();
            }}
            title="Kilometers"
          />
          <Menu.Item
            onPress={() => {
              setUnit("nm");
              closeMenu();
            }}
            title="Nautical Miles"
            style={{ backgroundColor: colors.secondary }}
          />
          <Menu.Item
            onPress={() => {
              setUnit("m");
              closeMenu();
            }}
            title="Meters"
            style={{ backgroundColor: colors.secondary }}
          />
        </Menu>
      </View>
    </View>
  );
}
