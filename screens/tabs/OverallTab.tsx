import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { DistanceInfoBox } from "../../components/DistanceInfo";
import { GeoSat } from "../../features/geosat/GeoSat";
import NlaRoutes from "../../features/nla/NLA";
import { RadarImages } from "../../features/radar/Radar";
import RouteForecast from "../../features/routeforecast/RouteForecast";
import {
  createRoute,
  isIgaRoute,
} from "../../features/routeforecast/routeservice";
import Sigchart from "../../features/sigchart/Sigchart";
import { useFlightStore } from "../../utils/flightStore";

export default function OverallTab() {
  const [igaRoute, setIgaRoute] = useState<string | null>(null);
  const departure = useFlightStore((s) => s.depAirport);
  const arrival = useFlightStore((s) => s.arrAirport);
  const { colors } = useTheme();

  useEffect(() => {
    if (!arrival || !departure) return;
    const checkRoute = () => {
      if (isIgaRoute(departure.icao, arrival.icao)) {
        setIgaRoute(createRoute(departure.icao, arrival.icao));
      }
    };
    checkRoute();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      {departure && arrival && (
        <DistanceInfoBox departure={departure} arrival={arrival} />
      )}
      <Sigchart />
      <GeoSat />
      <RadarImages />
      <NlaRoutes />
      {igaRoute && <RouteForecast route={igaRoute} />}
    </ScrollView>
  );
}
