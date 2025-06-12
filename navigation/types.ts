import { Airport } from "../data/airports";

export type RootStackParamList = {
  Homescreen: undefined;
  Flightscreen: undefined;
};

export type FlightscreenTabParamList = {
  DepartureTab: { departure?: Airport };
  ArrivalTab: { arrival?: Airport };
  Overall: { departure?: Airport; arrival?: Airport };
};