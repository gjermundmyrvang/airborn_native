import { useState } from "react";
import LazyCollapsible from "../../../components/LazyCollapsible";
import { WeatherInstantDetails } from "../types";
import { WeatherDetailsList } from "./WeatherDetailList";
import { List, useTheme } from "react-native-paper";

type Props = {
  details: WeatherInstantDetails;
  textSize?: "titleSmall" | "titleMedium" | "bodyMedium" | "bodySmall";
};

export const WeatherDetailsCollapsible = ({
  details,
  textSize = "bodyMedium",
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();

  return (
    <List.Accordion
      title="More Weather Details"
      left={(props) => (
        <List.Icon {...props} icon="widgets" color={colors.secondary} />
      )}
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 18,
        marginVertical: 5,
      }}
    >
      <WeatherDetailsList details={details} textSize={textSize} />
    </List.Accordion>
  );
};
