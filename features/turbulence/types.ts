export type TurbulenceParams = {
    icao: string; 
    time: string; 
    type: "cross_section" | "map";
}

export type TurbulenceEntry = {
    params: TurbulenceParams;
    uri: string;
}

export type TurbulenceResponse = TurbulenceEntry[];