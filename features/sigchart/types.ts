export type SigChartParams = {
  area: "nordic" | "norway";
  time: string; 
};

export type SigChartEntry = {
  params: SigChartParams;
  updated: string; 
  uri: string;
};

export type SigChartResponse = SigChartEntry[];