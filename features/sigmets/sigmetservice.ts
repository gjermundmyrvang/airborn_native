import axios from '../../api/axiosInstance';
import { parseSigmets } from "../sigchart/parser";
import { ParsedSigmet } from "./types";

export const getSigmets = async (): Promise<ParsedSigmet[]> => {
    const response = await axios.get('/sigmets/2.0/');
    return parseSigmets(response.data)
}
