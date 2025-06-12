import React from "react";
import { ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { DistanceInfoBox } from "../../components/DistanceInfo";
import Sigchart from "../../features/sigchart/Sigchart";
import { useFlightStore } from "../../utils/flightStore";

export default function OverallTab() {
  const departure = useFlightStore((s) => s.depAirport);
  const arrival = useFlightStore((s) => s.arrAirport);
  const { colors } = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      {departure && arrival && (
        <DistanceInfoBox departure={departure} arrival={arrival} />
      )}
      <Sigchart />
    </ScrollView>
  );
}
