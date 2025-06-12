import { LatLon } from "../../types/CommonTypes";

export type ParsedSigmet = {
  type: "SIGMET" | "AIRMET";
  coords: LatLon[];
  message: string;
};

