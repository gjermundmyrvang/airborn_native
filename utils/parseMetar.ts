import { ParsedMetar } from "../features/metartaf/types";

export const parseMetar = (metar: string): ParsedMetar => {
    const rawMetars = metar.trim().split('\n')
    const latestMetar = rawMetars[rawMetars.length - 1]; 
  const parts = latestMetar.split(" ");
  const time = parts[1]
  const timeString = `${time.slice(0, 2)}/${new Date().getMonth()} at ${time.slice(2, 6)}`
  return {
    raw: latestMetar,
    station: parts[0],
    time: timeString,
    wind: parts[2],
    visibility: parts[3],
    weather: parts[4],
    temp: parts.find((p) => /\d{2}\/\d{2}/.test(p)) ?? "--/--",
    pressure: parts.find((p) => /^Q\d{4}$/.test(p)) ?? "Q----",
  };
};