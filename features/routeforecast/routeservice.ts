import axios from "../../api/axiosInstance";
import { RouteResponse } from "./types";

const validIgaRoutes = [
  "iga-ENAL-ENCN",
  "iga-ENAL-ENRO",
  "iga-ENAN-ENBS",
  "iga-ENBR-ENGM",
  "iga-ENBR-ENVA",
  "iga-ENCN-ENRY",
  "iga-ENFL-ENNM",
  "iga-ENFL-ENTS",
  "iga-ENFL-ENZV",
  "iga-ENHF-ENKR",
  "iga-ENHK-ENMH",
  "iga-ENHV-ENSS",
  "iga-ENKA-ENHF",
  "iga-ENKB-ENGM",
  "iga-ENLK-ENKR",
  "iga-ENML-ENTO",
  "iga-ENNM-ENHK",
  "iga-ENOL-ENTC",
  "iga-ENOL-ENTS",
  "iga-ENRO-ENEV",
  "iga-ENRO-ENLK",
  "iga-ENRY-ENRM",
  "iga-ENRY-ENTS",
  "iga-ENVR-ENAN",
  "iga-ENZV-ENCN",
  "iga-ENZV-ENRO",
  "iga-ENZV-ESST",
];

export const getRouteForecast = async (
  igaRoute: string
): Promise<RouteResponse> => {
  const response = await axios.get(
    `/routeforecast/2.0/available.json?route=${igaRoute}`
  );
  const data = response.data;
  console.log("Data:", data[0]);
  return data;
};

export const createRoute = (icao1: string, icao2: string) => {
  const routeOption1 = `iga-${icao1}-${icao2}`;
  const routeOption2 = `iga-${icao2}-${icao1}`;
  return validIgaRoutes.includes(routeOption1) ? routeOption1 : routeOption2;
};

export const isIgaRoute = (icao1: string, icao2: string) => {
  const routeOption1 = `iga-${icao1}-${icao2}`;
  const routeOption2 = `iga-${icao2}-${icao1}`;
  return (
    validIgaRoutes.includes(routeOption1) ??
    validIgaRoutes.includes(routeOption2)
  );
};
