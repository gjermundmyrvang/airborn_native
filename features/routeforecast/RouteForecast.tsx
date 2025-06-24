import React, { useState } from "react";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { getRouteForecast } from "./routeservice";
import LazyCollapsible from "../../components/LazyCollapsible";
import { Button, Menu, Text, useTheme } from "react-native-paper";
import { RouteEntry, RouteResponse } from "./types";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { toDateTime } from "../../utils/dateTimeConverter";

export default function RouteForecast({ route }: { route: string }) {
  const [query, expanded, setExpanded] = useLazyQuery(["routeforecast"], () =>
    getRouteForecast(route)
  );
  return (
    <LazyCollapsible
      title="Route Forecast"
      noDataMsg="No forecast data available at the moment"
      icon="chart-bell-curve"
      loading={query.isLoading}
      error={query.error as Error | null}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      renderContent={() =>
        query.data ? <ForecastComponent forecasts={query.data} /> : null
      }
    />
  );
}

type ForecastProps = {
  forecasts: RouteResponse;
};

const ForecastComponent = ({ forecasts }: ForecastProps) => {
  const [forecast, setForecast] = useState(0);
  const [visible, setVisible] = useState(false);

  const { colors } = useTheme();

  const displayedForecast: RouteEntry = forecasts[forecast];
  const width = Dimensions.get("screen").width - 50;
  const height = Dimensions.get("screen").height * 0.4;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  return (
    <View
      style={{ padding: 8, justifyContent: "center", alignItems: "center" }}
    >
      <Image
        source={{ uri: displayedForecast.uri }}
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
              {toDateTime(displayedForecast.params.time)} LT
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
          {forecasts.map((d, i) => (
            <Menu.Item
              key={`id:${i}-${d.params.time}`}
              onPress={() => {
                setForecast(i);
                closeMenu();
              }}
              title={toDateTime(d.params.time)}
              style={{
                backgroundColor:
                  i === forecast ? colors.secondary : colors.surface,
                marginHorizontal: i === forecast ? 6 : 0,
                borderRadius: 8,
              }}
            />
          ))}
        </ScrollView>
      </Menu>
    </View>
  );
};
