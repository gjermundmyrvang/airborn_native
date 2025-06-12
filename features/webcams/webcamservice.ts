import { LatLng } from "react-native-maps";
import axios from '../../api/axiosInstance';
import { WebcamApiResponse } from "./types";

const API_KEY = process.env.EXPO_PUBLIC_WINDY_API_KEY

const RADIUS = 20

export const getWebcamData = async (place: LatLng): Promise<WebcamApiResponse> => {
  const response = await axios.get(
    `https://api.windy.com/webcams/api/v3/webcams?lang=en&limit=10&offset=0&nearby=${place.latitude}%2C${place.longitude}%2C${RADIUS}&include=images`,
    {
      headers: {
        "x-windy-api-key": API_KEY,
      },
    }
  );
  return response.data;
};