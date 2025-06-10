import { useQuery } from '@tanstack/react-query';
import { LatLon } from '../../types/CommonTypes';
import { getSunriseData } from './service';
import { SunriseResponse } from './types';

export const useSunriseQuery = (place: LatLon) => {
  return useQuery<SunriseResponse>({
    queryKey: ['sunrise', place],
    queryFn: () => getSunriseData(place),
  });
};
