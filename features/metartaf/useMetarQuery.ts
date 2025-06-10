import { useQuery } from '@tanstack/react-query';
import { getMetarTafData } from './service';

export const useMetarQuery = (icao: string) => {
  return useQuery<string>({
    queryKey: ['metar', icao],
    queryFn: () => getMetarTafData(icao),
  });
};
