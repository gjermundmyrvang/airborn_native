import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { Appbar, BottomNavigation, useTheme } from "react-native-paper";
import {
  FlightscreenTabParamList,
  RootStackParamList,
} from "../navigation/types";
import AirportTab from "./tabs/AirportTab";
import OverallTab from "./tabs/OverallTab";

type FlightscreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Flightscreen"
>;

export default function Flightscreen({ navigation, route }: FlightscreenProps) {
  const { colors } = useTheme();

  const _goBack = () => navigation.goBack();
  const _handleRefresh = () => console.log("Refreshing");
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Appbar.Header
        style={{ backgroundColor: colors.background }}
        mode="center-aligned"
      >
        <Appbar.BackAction onPress={_goBack} color={colors.primary} />
        <Appbar.Content title="Flightbrief Screen" color={colors.primary} />
        <Appbar.Action
          icon="refresh"
          onPress={_handleRefresh}
          color={colors.primary}
        />
      </Appbar.Header>
      <View style={{ flex: 1 }}>
        <BottomBar />
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator<FlightscreenTabParamList>();

const BottomBar = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          style={{ backgroundColor: colors.onBackground }}
          activeColor={colors.background}
          activeIndicatorStyle={{ backgroundColor: colors.tertiary }}
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) =>
            descriptors[route.key].options.tabBarIcon?.({
              focused,
              color,
              size: 24,
            }) || null
          }
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            let label: string;
            if (typeof options.tabBarLabel === "string") {
              label = options.tabBarLabel;
            } else if (typeof options.title === "string") {
              label = options.title;
            } else {
              label = route.name;
            }
            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="DepartureTab"
        component={AirportTab}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="airplane-takeoff"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ArrivalTab"
        component={AirportTab}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="airplane-landing"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Overall"
        component={OverallTab}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="airplane-settings"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
