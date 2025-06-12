import axios from "../../api/axiosInstance";
import { Airport, getClosestAirports } from "../../data/airports";

export const getMetarTafData = async (icao: string): Promise<string> => {
  const response = await axios.get(`/tafmetar/1.0/metar.txt?icao=${icao}`);
  console.log("Fetching");
  return response.data;
};

export const icaoSupportsMetar = [
  "ENAL",
  "ENAN",
  "ENAS",
  "ENAT",
  "ENBL",
  "ENBN",
  "ENBO",
  "ENBR",
  "ENBS",
  "ENBV",
  "ENCN",
  "ENDU",
  "ENEV",
  "ENFL",
  "ENGM",
  "ENHD",
  "ENHF",
  "ENHK",
  "ENHV",
  "ENKB",
  "ENKR",
  "ENLK",
  "ENMH",
  "ENML",
  "ENNA",
  "ENNM",
  "ENNO",
  "ENOL",
  "ENOV",
  "ENRA",
  "ENRM",
  "ENRO",
  "ENRS",
  "ENSB",
  "ENSD",
  "ENSG",
  "ENSH",
  "ENSK",
  "ENSO",
  "ENSR",
  "ENSS",
  "ENST",
  "ENTC",
  "ENTO",
  "ENVA",
  "ENVD",
  "ENZV",
];

export const nearbyWithMetar = (
  airport: Airport,
  withinKm: number
): Airport[] => {
  const nearby = getClosestAirports(airport, withinKm);
  const withMetar = nearby.filter((d) => icaoSupportsMetar.includes(d.icao));
  return withMetar.length > 0 ? withMetar : [];
};
