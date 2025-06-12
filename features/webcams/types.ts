export type WebcamImageUrls = {
    icon: string;
    thumbnail: string;
    preview: string;
};

export type WebcamCurrents = {
    current: WebcamImageUrls;
}

export type WebcamType = {
  title: string;
  lastUpdatedOn: string; 
  images: WebcamCurrents;
};

export type WebcamApiResponse = {
    total: number;
    webcams: WebcamType[];
}

