import axios from '../../api/axiosInstance';
import { LatLon } from '../../types/CommonTypes';
import { WeatherApiResponse } from './types';

export const getWeatherData = async (pos: LatLon): Promise<WeatherApiResponse> => {
  const response = await axios.get(`/locationforecast/2.0/complete?lat=${pos.latitude}&lon=${pos.longitude} `);
  console.log("Fetching weatherdata:")
  return response.data;
};
