export {
  getCities,
  getCitiesAllLangs,
  getCitiesAllLangsByPrefName,
  getCitiesByPrefName,
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
  getPrefectureByName,
  getPrefectureByNameAllLangs,
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
