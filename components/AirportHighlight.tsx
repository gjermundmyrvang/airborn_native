import {
  Button,
  IconButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { Airport } from "../data/airports";
import { View } from "react-native";

type AirportHighlightProps = {
  airport: Airport;
  setDeparture: (airport: Airport) => void;
  setArrival: (airport: Airport) => void;
  setAirport: (airport: Airport | null) => void;
  setSnackbar: () => void;
};

export const AirportHighlight = ({
  airport,
  setDeparture,
  setArrival,
  setAirport,
  setSnackbar,
}: AirportHighlightProps) => {
  const { colors } = useTheme();
  const handleSetDeparture = () => {
    setDeparture(airport);
    setAirport(null);
    setSnackbar();
  };
  const handleSetArrival = () => {
    setArrival(airport);
    setAirport(null);
    setSnackbar();
  };
  return (
    <Surface
      style={{
        position: "absolute",
        top: 50,
        left: "5%",
        right: "5%",
        alignSelf: "center",
        padding: 16,
        borderRadius: 12,
        elevation: 4,
        zIndex: 10,
        backgroundColor: colors.surface,
        opacity: 0.9,
      }}
      elevation={4}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text variant="titleMedium">{airport.name}</Text>
        <IconButton
          icon="close"
          size={20}
          onPress={() => setAirport(null)}
          iconColor={colors.onPrimary}
          mode="outlined"
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="titleSmall">{airport.icao}</Text>
        <Text variant="titleSmall">Lat: {airport.latitude}</Text>
        <Text variant="titleSmall">Lon: {airport.longitude}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <Button
          icon="airplane-takeoff"
          onPress={handleSetDeparture}
          mode="elevated"
          buttonColor={colors.secondary}
        >
          Departure
        </Button>
        <Button
          icon="airplane-landing"
          onPress={handleSetArrival}
          mode="elevated"
          buttonColor={colors.secondary}
        >
          Arrival
        </Button>
      </View>
    </Surface>
  );
};
