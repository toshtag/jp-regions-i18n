import cityData from "./generated/cities-en-macrons.json" with { type: "json" };
import prefData from "./generated/prefectures-en-macrons.json" with { type: "json" };
import { createLangStore } from "./store-lang.js";

const store = createLangStore(prefData as unknown[][], cityData as unknown[][], "en", false);

export const getPrefectures = store.getPrefectures.bind(store);
export const getPrefectureByCode = store.getPrefectureByCode.bind(store);
export const getPrefectureByISO = store.getPrefectureByISO.bind(store);
export const getPrefectureByLGCode = store.getPrefectureByLGCode.bind(store);
export const getPrefectureByName = store.getPrefectureByName.bind(store);
export const getCities = store.getCities.bind(store);
export const getCityByJisCode = store.getCityByJisCode.bind(store);
export const getCityByLGCode = store.getCityByLGCode.bind(store);
export const getCitiesByPrefName = store.getCitiesByPrefName.bind(store);

export type {
  City,
  CityType,
  GetCitiesOptions,
  GetPrefecturesOptions,
  Prefecture,
} from "./types.js";
