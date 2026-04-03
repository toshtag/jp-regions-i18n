import { normalizeLang } from "./lang.js";
import { getCitiesRawByPrefCode, getCityRawByCode, getCityRawByLGCode } from "./store.js";
import type { City, GetCitiesOptions } from "./types.js";

export function getCities(prefCode: string, lang?: string, options?: GetCitiesOptions): City[] {
  const l = normalizeLang(lang);
  let cities = getCitiesRawByPrefCode(prefCode);

  if (options?.type) {
    cities = cities.filter((c) => c.type === options.type);
  }
  if (options?.parentCode) {
    cities = cities.filter((c) => c.parentCode === options.parentCode);
  }

  return cities.map((c) => ({
    code: c.code,
    prefCode: c.prefCode,
    lgCode: c.lgCode,
    parentCode: c.parentCode,
    type: c.type,
    name: c.name[l],
  }));
}

export function getCityByCode(code: string, lang?: string): City | undefined {
  const raw = getCityRawByCode(code);
  if (!raw) return undefined;
  const l = normalizeLang(lang);
  return {
    code: raw.code,
    prefCode: raw.prefCode,
    lgCode: raw.lgCode,
    parentCode: raw.parentCode,
    type: raw.type,
    name: raw.name[l],
  };
}

export function getCityByLGCode(lgCode: string, lang?: string): City | undefined {
  const raw = getCityRawByLGCode(lgCode);
  if (!raw) return undefined;
  const l = normalizeLang(lang);
  return {
    code: raw.code,
    prefCode: raw.prefCode,
    lgCode: raw.lgCode,
    parentCode: raw.parentCode,
    type: raw.type,
    name: raw.name[l],
  };
}
