import { normalizeLang } from "./lang.js";
import { getCitiesRawByPrefCode, getCityRawByCode, getCityRawByLGCode } from "./store.js";
import type { City, GetCitiesOptions } from "./types.js";

export function getCities(prefCode: string, lang?: string, options?: GetCitiesOptions): City[] {
  const l = normalizeLang(lang);
  let cities = getCitiesRawByPrefCode(prefCode);

  if (options?.type) {
    cities = cities.filter((c) => c.type === options.type);
  }
  if (options?.parentJisCode) {
    cities = cities.filter((c) => c.parentCode === options.parentJisCode);
  }

  return cities.map((c) => ({
    jisCode: c.code,
    prefCode: c.prefCode,
    lgCode: c.lgCode,
    parentJisCode: c.parentCode,
    type: c.type,
    name: c.name[l],
  }));
}

export function getCityByJisCode(jisCode: string, lang?: string): City | undefined {
  const raw = getCityRawByCode(jisCode);
  if (!raw) return undefined;
  const l = normalizeLang(lang);
  return {
    jisCode: raw.code,
    prefCode: raw.prefCode,
    lgCode: raw.lgCode,
    parentJisCode: raw.parentCode,
    type: raw.type,
    name: raw.name[l],
  };
}

export function getCityByLGCode(lgCode: string, lang?: string): City | undefined {
  const raw = getCityRawByLGCode(lgCode);
  if (!raw) return undefined;
  const l = normalizeLang(lang);
  return {
    jisCode: raw.code,
    prefCode: raw.prefCode,
    lgCode: raw.lgCode,
    parentJisCode: raw.parentCode,
    type: raw.type,
    name: raw.name[l],
  };
}
