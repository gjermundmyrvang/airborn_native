import axios from '../../api/axiosInstance';
import { TurbulenceResponse } from './types';

export const getTurbulenceData = async (icao: string): Promise<TurbulenceResponse> => {
  const response = await axios.get(`https://api.met.no/weatherapi/turbulence/2.0/available.json?icao=${icao}`)
  return response.data;
};
