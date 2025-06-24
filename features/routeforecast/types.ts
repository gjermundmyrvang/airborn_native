type RouteParams = {
  route: string;
  time: string;
};

export type RouteEntry = {
  params: RouteParams;
  uri: string;
};

export type RouteResponse = RouteEntry[];
