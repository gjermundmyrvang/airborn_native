import { TurbulenceProps } from './types';

export const getTurbulenceData = async (props: TurbulenceProps) => {
  return `https://api.met.no/weatherapi/turbulence/2.0/?icao=${props.icao}&type=${props.type}`;
};
