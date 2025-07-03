import React, { useMemo, useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { Button, Menu, useTheme } from "react-native-paper";
import LazyCollapsible from "../../components/LazyCollapsible";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { toTime } from "../../utils/dateTimeConverter";
import { getNLARoutes } from "./nlaservice";
import { NLAResponse } from "./types";

export default function NlaRoutes() {
  const [query, expanded, setExpanded] = useLazyQuery(["nlaroutes"], () =>
    getNLARoutes()
  );
  return (
    <LazyCollapsible
      title="NLA Routes"
      noDataMsg="Failed getting NLA route data"
      icon="helicopter"
      loading={query.isLoading}
      error={query.error as Error | null}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      renderContent={() =>
        query.data ? <NLAComponent routes={query.data} /> : null
      }
    />
  );
}

type Props = {
  routes: NLAResponse;
};
const NLAComponent = ({ routes }: Props) => {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [nameMenuVisible, setNameMenuVisible] = useState(false);
  const [timeMenuVisible, setTimeMenuVisible] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);

  const { colors } = useTheme();

  const width = Dimensions.get("screen").width - 50;
  const height = Dimensions.get("screen").height * 0.4;

  const grouped = useMemo(() => {
    const result: Record<string, Record<string, Record<string, string>>> = {};
    routes.forEach(({ params: { name, time, type }, uri }) => {
      if (!result[name]) result[name] = {};
      if (!result[name][time]) result[name][time] = {};
      result[name][time][type] = uri;
    });
    return result;
  }, [routes]);

  const nameOptions = Object.keys(grouped);
  const timeOptions = selectedName ? Object.keys(grouped[selectedName]) : [];
  const typeOptions =
    selectedName && selectedTime
      ? Object.keys(grouped[selectedName][selectedTime])
      : [];

  const uri =
    selectedName && selectedTime && selectedType
      ? grouped[selectedName][selectedTime][selectedType]
      : null;
  return (
    <View
      style={{
        padding: 5,
        gap: 8,
      }}
    >
      {/* Name Selector */}
      <Menu
        visible={nameMenuVisible}
        onDismiss={() => setNameMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setNameMenuVisible(true)}>
            {selectedName ?? "Select Route"}
          </Button>
        }
        contentStyle={{
          backgroundColor: colors.surface,
          borderRadius: 8,
          padding: 8,
          maxHeight: 400,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {nameOptions.map((name) => (
            <Menu.Item
              key={name}
              onPress={() => {
                setSelectedName(name);
                setSelectedTime(null);
                setSelectedType(null);
                setNameMenuVisible(false);
              }}
              title={name}
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 8,
                margin: 5,
              }}
            />
          ))}
        </ScrollView>
      </Menu>

      {/* Time Selector */}
      <Menu
        visible={timeMenuVisible}
        onDismiss={() => setTimeMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            disabled={!selectedName}
            onPress={() => setTimeMenuVisible(true)}
          >
            {selectedTime ? `${toTime(selectedTime)} LT` : "Select Time"}
          </Button>
        }
        contentStyle={{
          backgroundColor: colors.surface,
          borderRadius: 8,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {timeOptions.map((time) => (
            <Menu.Item
              key={time}
              onPress={() => {
                setSelectedTime(time);
                setSelectedType(null);
                setTimeMenuVisible(false);
              }}
              title={toTime(time) + " LT"}
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 8,
                margin: 5,
              }}
            />
          ))}
        </ScrollView>
      </Menu>

      {/* Type Selector */}
      <Menu
        visible={typeMenuVisible}
        onDismiss={() => setTypeMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            disabled={!selectedTime}
            onPress={() => setTypeMenuVisible(true)}
          >
            {selectedType ?? "Select Type"}
          </Button>
        }
        contentStyle={{
          backgroundColor: colors.surface,
          borderRadius: 8,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {typeOptions.map((type) => (
            <Menu.Item
              key={type}
              onPress={() => {
                setSelectedType(type);
                setTypeMenuVisible(false);
              }}
              title={type}
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 8,
                margin: 5,
              }}
            />
          ))}
        </ScrollView>
      </Menu>

      {uri && (
        <Image
          source={{ uri }}
          style={{ width, height, marginTop: 8, alignSelf: "center" }}
          resizeMode="contain"
        />
      )}
    </View>
  );
};
