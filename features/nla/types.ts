export type NLAParams = {
  name: string;
  time: string;
  type: "vcross" | "timegraph";
};

export type NLAEntry = {
  params: NLAParams;
  uri: string;
};

export type NLAResponse = NLAEntry[];
