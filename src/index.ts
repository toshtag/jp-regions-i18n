export type { Lang, CityType, Prefecture, City, GetCitiesOptions } from "./types.js";

export { getSupportedLanguages } from "./lang.js";

export {
  getPrefectures,
  getPrefectureByCode,
  getPrefectureByISO,
} from "./prefectures.js";

export { getCities, getCityByCode, getCityByLGCode } from "./cities.js";
