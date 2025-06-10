import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text } from "react-native-paper";
import { FlightscreenTabParamList } from "../../navigation/types";

type OverallTabProps = BottomTabScreenProps<
  FlightscreenTabParamList,
  "Overall"
>;

export default function OverallTab({ route, navigation }: OverallTabProps) {
  const { departure, arrival } = route.params;
  return (
    <Text>
      Overall: {departure?.name} → {arrival?.name ?? "No arrival"}
    </Text>
  );
}
