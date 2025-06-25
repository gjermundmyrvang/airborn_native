import axios from "../../api/axiosInstance";
import { NLAResponse } from "./Types";

export const getNLARoutes = async (): Promise<NLAResponse> => {
  const response = await axios.get("/nlaroutes/1.0/available.json");
  const data = response.data;
  return data;
};
