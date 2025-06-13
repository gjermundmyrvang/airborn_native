import { Icon, Surface, Text, useTheme } from "react-native-paper";
import { haversineDistance } from "../utils/geoUtils";
import { Airport } from "../data/airports";
import { ViewRow } from "./RowComp";

type InfoBoxProps = {
  departure: Airport;
  arrival: Airport;
  offset?: boolean;
};

export const InfoBox = ({
  departure,
  arrival,
  offset = false,
}: InfoBoxProps) => {
  const { colors } = useTheme();
  const distance = haversineDistance(departure, arrival);
  return (
    <Surface
      style={{
        position: "absolute",
        top: offset ? 220 : 50,
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
      <ViewRow>
        <ViewRow>
          <Icon source="airplane-takeoff" size={20} color={colors.primary} />
          <Text variant="titleSmall">{departure.name.split(",")[0]}</Text>
        </ViewRow>
        <ViewRow>
          <Icon source="airplane-landing" size={20} color={colors.primary} />
          <Text variant="titleSmall">{arrival.name.split(",")[0]}</Text>
        </ViewRow>
      </ViewRow>
      <Text variant="titleSmall" style={{ marginTop: 10 }}>
        Distance between airports: {distance.toString("nm")}
      </Text>
    </Surface>
  );
};
