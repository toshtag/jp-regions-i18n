export type Lang = "ja" | "en" | "zh-CN" | "zh-TW" | "ko" | "pt" | "vi";

export type CityType =
  | "city"
  | "designated_city"
  | "ward"
  | "special_ward"
  | "town"
  | "village";

export interface Prefecture {
  code: string;
  iso: string;
  name: string;
}

export interface City {
  code: string;
  prefCode: string;
  lgCode: string;
  parentCode: string | null;
  type: CityType;
  name: string;
}

export interface GetCitiesOptions {
  type?: CityType;
  parentCode?: string;
}
