import React, { useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import {
  Button,
  Menu,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";
import ErrorMessage from "../../components/ErrorMessage";
import LazyCollapsible from "../../components/LazyCollapsible";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { getTurbulenceData } from "./turbulenceservice";
import { TurbulenceEntry, TurbulenceResponse } from "./types";
import { toDateTime } from "../../utils/dateTimeConverter";

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
  const isValidIcao = validIcaos.includes(icao);

  const [query, expanded, setExpanded] = useLazyQuery(
    ["turbulence", icao],
    isValidIcao ? () => getTurbulenceData(icao) : async () => null // if invalid ICAO
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
        if (!isValidIcao) {
          return (
            <ErrorMessage
              title={`Selected airport (${icao}) does not have turbulence data`}
            />
          );
        }
        return query.data ? (
          <TurbulenceComponent turbulence={query.data} />
        ) : null;
      }}
    />
  );
}

type ComponentProps = {
  turbulence: TurbulenceResponse;
};

const TurbulenceComponent = ({ turbulence }: ComponentProps) => {
  const [type, setType] = useState<"map" | "cross_section">("map");
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);

  const { colors } = useTheme();

  const maps = turbulence.filter((d) => d.params.type === type);
  const displayedChart: TurbulenceEntry = maps[selected];

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const width = Dimensions.get("screen").width - 50;
  const height = Dimensions.get("screen").height * 0.4;
  return (
    <View
      style={{ padding: 8, justifyContent: "center", alignItems: "center" }}
    >
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: "map", label: "Map" },
          { value: "cross_section", label: "Cross Section" },
        ]}
        density="small"
        style={{ width: "80%" }}
      />
      <Image
        source={{ uri: displayedChart.uri }}
        style={{ width, height }}
        resizeMode="contain"
      />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            onPress={openMenu}
            style={{
              backgroundColor: colors.secondary,
              marginTop: 8,
            }}
          >
            <Text
              variant="bodyLarge"
              style={{
                fontWeight: "bold",
                color: colors.primary,
              }}
            >
              {toDateTime(displayedChart.params.time)} LT
            </Text>
          </Button>
        }
        anchorPosition="top"
        mode="flat"
        contentStyle={{
          backgroundColor: colors.surface,
          marginTop: 6,
          borderRadius: 8,
        }}
      >
        <ScrollView style={{ maxHeight: 300 }}>
          {maps.map((d, i) => (
            <Menu.Item
              key={d.params.time}
              onPress={() => {
                setSelected(i);
                closeMenu();
              }}
              title={toDateTime(d.params.time)}
              style={{
                backgroundColor:
                  i === selected ? colors.secondary : colors.surface,
                marginHorizontal: i === selected ? 6 : 0,
                borderRadius: 8,
              }}
            />
          ))}
        </ScrollView>
      </Menu>
    </View>
  );
};
