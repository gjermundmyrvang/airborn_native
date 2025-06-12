import { LatLon } from "../../types/CommonTypes";
import { ParsedSigmet } from "../sigmets/types";

function parseLatLon(coordStr: string): LatLon | null {
  // Match something like "N7800 E01255"
  const match = RegExp(/([NS])(\d{2,4})\s*([EW])(\d{3,5})/).exec(coordStr);
  if (!match) return null;
  const [, latDir, latVal, lonDir, lonVal] = match;

  // Latitude
  const latDeg = parseInt(latVal.slice(0, 2), 10);
  const latMin = parseInt(latVal.slice(2), 10) || 0;
  let latitude = latDeg + latMin / 60;
  if (latDir === "S") latitude = -latitude;

  // Longitude
  const lonDeg = parseInt(lonVal.slice(0, 3), 10);
  const lonMin = parseInt(lonVal.slice(3), 10) || 0;
  let longitude = lonDeg + lonMin / 60;
  if (lonDir === "W") longitude = -longitude;

  return { latitude, longitude };
}

export function parseSigmets(raw: string): ParsedSigmet[] {
  // Split into message blocks (each starts with ZCZC)
  const blocks = raw
    .split(/ZCZC/g)
    .map(b => b.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    // Find type
    const typeMatch = /\b(SIGMET|AIRMET)\b/.exec(block);
    const type = typeMatch ? (typeMatch[1] as "SIGMET" | "AIRMET") : "SIGMET";

    const coordsMatch = /WI\s+([NESW\d\s-]+?)(?:\s+\w+\/FL|\s+\d+FT\/FL|\s+SFC\/FL|\s+STNR|=)/i.exec(block);
    let coords: LatLon[] = [];
    if (coordsMatch?.[1]) {
      coords = coordsMatch[1]
        .split("-")
        .map(s => s.trim())
        .map(parseLatLon)
        .filter((c): c is LatLon => !!c);
    }
    
    return {
      type,
      coords,
      message: block,
    };
  });
}