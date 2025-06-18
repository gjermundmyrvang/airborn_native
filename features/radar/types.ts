export type RadarParams = {
  area: string;
  content: string;
  time: string;
  type: string;
};

export type RadarEntry = {
  params: RadarParams;
  uri: string;
};

export type RadarResponse = RadarEntry[];
