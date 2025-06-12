import { Airport } from "../data/airports";

export type RootStackParamList = {
  Home: undefined;
  Flightscreen: {
    departure: Airport;
    arrival?: Airport | null;
  };
};

export type FlightscreenTabParamList = {
  Departure: { departure: Airport };
  Arrival: { arrival?: Airport | null };
  Overall: { departure: Airport; arrival?: Airport | null };
  AirportTab: {
    departure?: Airport | null;
    arrival?: Airport | null;
  };
};