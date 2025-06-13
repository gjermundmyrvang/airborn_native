import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { Fragment, useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import {
  Button,
  IconButton,
  Snackbar,
  Text,
  useTheme,
} from "react-native-paper";
import { AirportHighlight } from "../components/AirportHighlight";
import { MyFAB } from "../components/FAB";
import { InfoBox } from "../components/InfoBox";
import TripModal from "../components/TripModal";
import { AIRMET, LATITUDE, LONGITUDE, SIGMET } from "../constants/constants";
import { Airport, airports } from "../data/airports";
import { getFavorites, updateFavorites } from "../data/store";
import SigmetInfoModal from "../features/sigmets/SigmetInfo";
import { getSigmets } from "../features/sigmets/sigmetservice";
import { useLazyQuery } from "../hooks/useLazyQuery";
import { RootStackParamList } from "../navigation/types";
import { useFlightStore } from "../utils/flightStore";

const airportsData = airports;

export default function Homescreen() {
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [departure, setDeparture] = useState<string | null>(null);
  const [arrival, setArrival] = useState<string | null>(null);
  const setDepAirport = useFlightStore((s) => s.setDepAirport);
  const setArrAirport = useFlightStore((s) => s.setArrAirport);
  const depAirport = useFlightStore((s) => s.depAirport);
  const arrAirport = useFlightStore((s) => s.arrAirport);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [query, expanded, setExpanded] = useLazyQuery(["sigmets"], getSigmets);
  const [snackbar, setSnackbar] = useState(false);
  const [sigmetSnack, setSigmetSnack] = useState(false);
  const [showSigInfo, setShowSigInfo] = useState(
    query.isSuccess && query.data.length > 0
  );
  const [showSigmetModal, setShowSigmetModal] = useState(false);

  const onToggleSnackBar = () => setSnackbar(!snackbar);

  const onDismissSnackBar = () => setSnackbar(false);

  const { colors } = useTheme();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleToggleFavorite = async (icao: string) => {
    let updated: string[];
    if (favorites.includes(icao)) {
      updated = favorites.filter((d) => d !== icao);
    } else {
      updated = [...favorites, icao];
    }
    await updateFavorites(updated);
    setFavorites(updated);
  };

  useEffect(() => {
    const loadFavorites = async () => {
      const savedFavorites = await getFavorites();
      setFavorites(savedFavorites);
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    if (query.isSuccess && query.data.length === 0) {
      setSigmetSnack(true);
    }
  }, [query.isSuccess, query.data]);

  const handleGoToBrief = () => {
    if (!depAirport) return;
    setShowModal(false);
    navigation.navigate("Flightscreen");
  };

  const handleNewTrip = () => {
    setShowModal(true);
  };

  const handleMarkerPressed = (airport: Airport) => {
    setSelectedAirport(airport);
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
          latitudeDelta: 20.0,
          longitudeDelta: 25.0,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {airportsData.map((d) => (
          <Marker
            key={d.icao}
            coordinate={d}
            image={require("../assets/custom_marker.png")}
            onPress={() => handleMarkerPressed(d)}
          />
        ))}
        {query.isSuccess &&
          query.data.length > 0 &&
          query.data.map((sigmet, idx) =>
            sigmet.coords.length > 2 ? (
              <Fragment key={`nr-${idx + 1}`}>
                <Polygon
                  coordinates={sigmet.coords}
                  strokeColor={colors.error}
                  fillColor={sigmet.type === "SIGMET" ? SIGMET : AIRMET}
                  strokeWidth={2}
                />
                <Marker
                  coordinate={sigmet.coords[0]}
                  anchor={{ x: 0.5, y: 1.5 }}
                >
                  <View
                    style={{
                      backgroundColor: colors.background,
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: colors.primary }}>{idx + 1}</Text>
                  </View>
                </Marker>
              </Fragment>
            ) : null
          )}
      </MapView>
      <TripModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        airports={airports}
        favorites={favorites}
        colors={colors}
        depAirport={depAirport}
        arrAirport={arrAirport}
        departure={departure}
        arrival={arrival}
        setDeparture={setDeparture}
        setArrival={setArrival}
        setDepAirport={setDepAirport}
        setArrAirport={setArrAirport}
        handleToggleFavorite={handleToggleFavorite}
        handleGoToBrief={handleGoToBrief}
      />
      <MyFAB
        visible={true}
        extended={true}
        label="New Trip"
        onPress={handleNewTrip}
      />
      <Snackbar
        visible={snackbar}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: colors.background,
          padding: 10,
          borderRadius: 16,
        }}
        action={{
          label: `${depAirport ? "Go To Brief" : "Dismiss"}`,
          onPress: () => {
            depAirport ? handleGoToBrief() : onDismissSnackBar();
          },
        }}
      >
        <Text variant="titleSmall">
          {depAirport
            ? "Airport selected. Ready for brief?"
            : "Airport selected"}
        </Text>
      </Snackbar>
      <Snackbar
        visible={sigmetSnack}
        onDismiss={() => setSigmetSnack(false)}
        duration={3000}
        style={{
          backgroundColor: colors.background,
          borderRadius: 16,
        }}
      >
        No sigmet or airmets
      </Snackbar>
      {selectedAirport ? (
        <AirportHighlight
          airport={selectedAirport}
          setAirport={setSelectedAirport}
          setDeparture={setDepAirport}
          setArrival={setArrAirport}
          setSnackbar={onToggleSnackBar}
        />
      ) : null}

      {depAirport && arrAirport ? (
        <InfoBox
          departure={depAirport}
          arrival={arrAirport}
          offset={!!selectedAirport}
        />
      ) : null}
      {showSigInfo && (
        <View
          style={{
            position: "absolute",
            bottom: 120,
            left: "5%",
            right: "5%",
            zIndex: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Button
            mode="elevated"
            buttonColor={colors.secondary}
            onPress={() => setShowSigmetModal(true)}
          >
            Read Sigmet/Airmet message(s)
          </Button>
          <IconButton
            icon="close"
            size={20}
            onPress={() => setShowSigInfo(false)}
            style={{ backgroundColor: colors.tertiary }}
          />
        </View>
      )}
      {query.isSuccess && query.data.length > 0 && (
        <SigmetInfoModal
          visible={showSigmetModal}
          onClose={setShowSigmetModal}
          sigmets={query.data}
        />
      )}
    </View>
  );
}
