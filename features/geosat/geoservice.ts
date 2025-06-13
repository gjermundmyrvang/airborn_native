export const getGeoSat = async (): Promise<string> => {
  return "https://api.met.no/weatherapi/geosatellite/1.4/?area=europe";
};
