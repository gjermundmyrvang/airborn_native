export type WeatherInstantDetails = {
  air_pressure_at_sea_level?: number;
  air_temperature?: number;
  cloud_area_fraction?: number;
  cloud_area_fraction_high?: number;
  cloud_area_fraction_low?: number;
  cloud_area_fraction_medium?: number;
  dew_point_temperature?: number;
  fog_area_fraction?: number;
  relative_humidity?: number;
  ultraviolet_index_clear_sky?: number;
  wind_from_direction?: number;
  wind_speed?: number;
};

export type WeatherSummary = {
  symbol_code: string;
};

export type WeatherNext1Hour = {
  summary: WeatherSummary;
  details: {
    precipitation_amount: number;
  };
};

export type WeatherNext6Hours = {
  summary: WeatherSummary;
  details: {
    air_temperature_max: number;
    air_temperature_min: number;
    precipitation_amount: number;
  };
};

export type WeatherNext12Hours = {
  summary: WeatherSummary;
  details: Record<string, never>; // empty object
};

export type WeatherTimeseriesEntry = {
  time: string; // ISO string
  data: {
    instant: {
      details: WeatherInstantDetails;
    };
    next_1_hours?: WeatherNext1Hour;
    next_6_hours?: WeatherNext6Hours;
    next_12_hours?: WeatherNext12Hours;
  };
};

export type WeatherApiResponse = WeatherTimeseriesEntry[];