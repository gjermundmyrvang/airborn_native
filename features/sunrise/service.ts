import axios from '../../api/axiosInstance';
import { LatLon } from '../../types/CommonTypes';
import { SunriseResponse } from './types';


export const getSunriseData = async (place: LatLon): Promise<SunriseResponse> => {
  const response = await axios.get(`/sunrise/3.0/sun?lat=${place.latitude}&lon=${place.longitude}`);
  return response.data;
};
