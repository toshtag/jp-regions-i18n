export {
  getCities,
  getCitiesAllLangs,
  getCityByJisCode,
  getCityByJisCodeAllLangs,
  getCityByLGCode,
  getCityByLGCodeAllLangs,
} from "./cities.js";

export { getSupportedLanguages } from "./lang.js";

export {
  getPrefectureByCode,
  getPrefectureByCodeAllLangs,
  getPrefectureByISO,
  getPrefectureByISOAllLangs,
  getPrefectureByLGCode,
  getPrefectureByLGCodeAllLangs,
  getPrefectures,
  getPrefecturesAllLangs,
} from "./prefectures.js";
export type {
  City,
  CityAllLangs,
  CityType,
  GetCitiesOptions,
  GetPrefecturesOptions,
  Lang,
  Prefecture,
  PrefectureAllLangs,
} from "./types.js";
