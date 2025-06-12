import { useState } from "react";
import { View } from "react-native";
import { useTheme, Icon, Menu, Text, Button } from "react-native-paper";
import { haversineDistance } from "../utils/geoUtils";
import { Airport } from "../data/airports";

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
    <View
      style={{
        marginHorizontal: 8,
        padding: 12,
        backgroundColor: colors.surface,
        borderRadius: 12,
      }}
    >
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
      </View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            onPress={openMenu}
            style={{ backgroundColor: colors.secondary, marginTop: 8 }}
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
        contentStyle={{ backgroundColor: colors.secondary, marginTop: 8 }}
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
        />
        <Menu.Item
          onPress={() => {
            setUnit("m");
            closeMenu();
          }}
          title="Meters"
        />
      </Menu>
    </View>
  );
}

type DistanceMenuProps = {
  a: Airport;
  b: Airport;
};

export const DistanceMenu = ({ a, b }: DistanceMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [unit, setUnit] = useState<"km" | "nm" | "m">("km");
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const { colors } = useTheme();
  const distance = haversineDistance(a, b);

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
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Button
          onPress={openMenu}
          style={{ backgroundColor: colors.secondary, marginTop: 8 }}
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
      contentStyle={{ backgroundColor: colors.secondary, marginTop: 8 }}
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
      />
      <Menu.Item
        onPress={() => {
          setUnit("m");
          closeMenu();
        }}
        title="Meters"
      />
    </Menu>
  );
};
