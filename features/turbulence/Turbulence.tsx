import React from "react";
import { Dimensions, Image, View } from "react-native";
import { SegmentedButtons, useTheme } from "react-native-paper";
import ErrorMessage from "../../components/ErrorMessage";
import LazyCollapsible from "../../components/LazyCollapsible";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { getTurbulenceData } from "./turbulenceservice";

const validIcaos = [
  "ENAL",
  "ENBL",
  "ENBN",
  "ENDU",
  "ENEV",
  "ENHF",
  "ENHK",
  "ENHV",
  "ENLK",
  "ENMH",
  "ENMS",
  "ENOV",
  "ENRA",
  "ENSB",
  "ENSD",
  "ENSH",
  "ENST",
  "ENTC",
  "ENVA",
];

export default function Turbulence({ icao }: { icao: string }) {
  const [filter, setFilter] = React.useState("map");
  const props = { icao, type: filter };

  const [query, expanded, setExpanded] = useLazyQuery(
    ["turbulence", icao, filter],
    () => getTurbulenceData(props)
  );

  return (
    <LazyCollapsible
      title="Turbulence Map"
      icon="chart-multiple"
      noDataMsg="No turbulence data for selected airport"
      loading={query.isLoading}
      error={query.error as Error | null}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      renderContent={() => {
        if (!validIcaos.includes(icao)) {
          return (
            <ErrorMessage
              title={`Selected airport (${icao}) does not have turbulence data`}
            />
          );
        }
        return query.data ? (
          <TurbulenceComponent
            uri={query.data}
            type={filter}
            onChangeType={setFilter}
          />
        ) : null;
      }}
    />
  );
}

type ComponentProps = {
  uri: string;
  type: string;
  onChangeType: (type: string) => void;
};
const TurbulenceComponent = ({ uri, type, onChangeType }: ComponentProps) => {
  const width = Dimensions.get("window").width - 50;
  const height = Dimensions.get("window").height * 0.4;
  const { colors } = useTheme();
  return (
    <View style={{ paddingTop: 8, paddingRight: 8 }}>
      <SegmentedButtons
        value={type}
        onValueChange={onChangeType}
        buttons={[
          { value: "map", label: "Map" },
          { value: "cross_section", label: "Cross Section" },
        ]}
      />
      <Image source={{ uri }} style={{ width, height }} resizeMode="contain" />
    </View>
  );
};
