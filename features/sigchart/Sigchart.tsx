import React, { useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import {
  Button,
  Menu,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";
import LazyCollapsible from "../../components/LazyCollapsible";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { toDateTime } from "../../utils/dateTimeConverter";
import { getSigcharts } from "./sigchartservice";
import { SigChartEntry, SigChartResponse } from "./types";

export default function Sigchart() {
  const [query, expanded, setExpanded] = useLazyQuery(["sigcharts"], () =>
    getSigcharts()
  );
  return (
    <LazyCollapsible
      title="Sigcharts"
      noDataMsg="No turbulence data for selected airport"
      icon="map"
      loading={query.isLoading}
      error={query.error as Error | null}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      renderContent={() =>
        query.data ? <SigchartComponent sigcharts={query.data} /> : null
      }
    />
  );
}

type SigchartProps = {
  sigcharts: SigChartResponse;
};

const SigchartComponent = ({ sigcharts }: SigchartProps) => {
  const [area, setArea] = useState<"norway" | "nordic">("nordic");
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);

  const charts = sigcharts.filter((d) => d.params.area === area);
  const displayedChart: SigChartEntry = charts[selected];

  const { colors } = useTheme();

  const width = Dimensions.get("screen").width - 50;
  const height = Dimensions.get("screen").height * 0.5;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View
      style={{ padding: 8, justifyContent: "center", alignItems: "center" }}
    >
      <SegmentedButtons
        value={area}
        onValueChange={(d) => {
          setSelected(0);
          setArea(d);
        }}
        buttons={[
          {
            value: "nordic",
            label: "Nordic",
          },
          {
            value: "norway",
            label: "Norway",
          },
        ]}
        density="small"
        style={{ width: "80%" }}
      />
      <Image
        source={{ uri: displayedChart.uri }}
        style={{ width, height, marginTop: 8 }}
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
          {charts.map((d, i) => (
            <Menu.Item
              key={`id:${i}-${d.params.time}`}
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
