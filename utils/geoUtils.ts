import { LatLon } from "../types/CommonTypes";
import { Distance } from "../types/Distance";

export function haversineDistance(a: LatLon, b: LatLon): Distance {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters

  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const meters = 2 * R * Math.asin(Math.sqrt(h));
  return new Distance(meters);
}

export function degreesToCompass(deg?: number): string {
  if (deg === undefined) return "";
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const ix = Math.round((deg % 360) / 22.5) % 16;
  return dirs[ix];
}
