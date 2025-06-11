import axios from '../../api/axiosInstance';
import { SigChartResponse } from './types';

export const getSigcharts = async (): Promise<SigChartResponse> => {
  const response = await axios.get('/sigcharts/2.0/available.json');
  console.log("Fetching sigcharts:")
  return response.data;
};

