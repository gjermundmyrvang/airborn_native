import axios from '../../api/axiosInstance';

export const getMetarTafData = async (icao: string): Promise<string> => {
  const response = await axios.get(`/tafmetar/1.0/metar.txt?icao=${icao}`);
  console.log("Fetching")
  return response.data;
};
