export type Lang =
  | "ja"
  | "ja-Hira"
  | "ja-Kana"
  | "ja-HW"
  | "en"
  | "zh-CN"
  | "zh-TW"
  | "ko"
  | "pt"
  | "vi";

export type CityType = "city" | "designated_city" | "ward" | "special_ward" | "town" | "village";

export const CITY_TYPE_NAMES = [
  "city",
  "designated_city",
  "ward",
  "special_ward",
  "town",
  "village",
] as const satisfies readonly CityType[];

export function decodeCityType(n: number): CityType {
  return CITY_TYPE_NAMES[n];
}

export interface Prefecture {
  code: string;
  iso: string;
  lgCode: string;
  name: string;
}

export interface City {
  jisCode: string;
  prefCode: string;
  lgCode: string;
  parentJisCode: string | null;
  type: CityType;
  name: string;
}

export interface PrefectureAllLangs {
  code: string;
  iso: string;
  lgCode: string;
  name: Record<Lang, string>;
}

export interface CityAllLangs {
  jisCode: string;
  prefCode: string;
  lgCode: string;
  parentJisCode: string | null;
  type: CityType;
  name: Record<Lang, string>;
}

export interface GetPrefecturesOptions {
  short?: boolean;
}

export interface GetCitiesOptions {
  type?: CityType;
  parentJisCode?: string;
  short?: boolean;
}
