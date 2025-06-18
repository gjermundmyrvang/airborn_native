import axios from "../../api/axiosInstance";
import { RadarResponse } from "./types";

export const getRadarImages = async (): Promise<RadarResponse> => {
  const response = await axios.get(
    "/radar/2.0/available.json?content=animation"
  );
  const data = response.data;
  return data;
};

export const removeTimeFromUrl = (uri: string): string => {
  const startIndex = uri.indexOf("time=");
  if (startIndex === -1) return uri;
  const endIndex = uri.indexOf("&", startIndex);
  if (endIndex === -1) {
    return uri.slice(0, startIndex - 1);
  }
  return uri.slice(0, startIndex) + uri.slice(endIndex + 1);
};
