import { create } from "zustand";
import { Airport } from "../data/airports";


type FlightState = {
  depAirport: Airport | null;
  arrAirport: Airport | null;
  setDepAirport: (airport: Airport | null) => void;
  setArrAirport: (airport: Airport | null) => void;
};

export const useFlightStore = create<FlightState>((set) => ({
  depAirport: null,
  arrAirport: null,
  setDepAirport: (airport) => set({ depAirport: airport }),
  setArrAirport: (airport) => set({ arrAirport: airport }),
}));