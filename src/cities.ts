import { normalizeLang } from "./lang.js";
import { shortenCityName } from "./name.js";
import {
  getCitiesRawByPrefCode,
  getCityRawByCode,
  getCityRawByLGCode,
  getPrefectureRawByName,
} from "./store.js";
import type { City, CityAllLangs, GetCitiesOptions, Lang } from "./types.js";

type RawCity = {
  code: string;
  prefCode: string;
  lgCode: string;
  parentCode: string | null;
  type: CityAllLangs["type"];
  name: Record<Lang, string>;
};

function toPublic(raw: RawCity, lang: Lang, short?: boolean): City {
  const name = raw.name[lang];
  return {
    jisCode: raw.code,
    prefCode: raw.prefCode,
    lgCode: raw.lgCode,
    parentJisCode: raw.parentCode,
    type: raw.type,
    name: short ? shortenCityName(name, lang) : name,
  };
}

function toAllLangs(raw: RawCity, short?: boolean): CityAllLangs {
  let name = raw.name;
  if (short) {
    name = Object.fromEntries(
      (Object.entries(raw.name) as [Lang, string][]).map(([lang, n]) => [
        lang,
        shortenCityName(n, lang),
      ]),
    ) as Record<Lang, string>;
  }
  return {
    jisCode: raw.code,
    prefCode: raw.prefCode,
    lgCode: raw.lgCode,
    parentJisCode: raw.parentCode,
    type: raw.type,
    name,
  };
}

export function getCities(prefCode: string, lang?: string, options?: GetCitiesOptions): City[] {
  const l = normalizeLang(lang);
  let cities = getCitiesRawByPrefCode(prefCode);

  if (options?.type) {
    cities = cities.filter((c) => c.type === options.type);
  }
  if (options?.parentJisCode) {
    cities = cities.filter((c) => c.parentCode === options.parentJisCode);
  }

  return cities.map((c) => toPublic(c, l, options?.short));
}

export function getCityByJisCode(
  jisCode: string,
  lang?: string,
  options?: { short?: boolean },
): City | undefined {
  const raw = getCityRawByCode(jisCode);
  if (!raw) return undefined;
  return toPublic(raw, normalizeLang(lang), options?.short);
}

export function getCityByLGCode(
  lgCode: string,
  lang?: string,
  options?: { short?: boolean },
): City | undefined {
  const raw = getCityRawByLGCode(lgCode);
  if (!raw) return undefined;
  return toPublic(raw, normalizeLang(lang), options?.short);
}

export function getCitiesAllLangs(prefCode: string, options?: GetCitiesOptions): CityAllLangs[] {
  let cities = getCitiesRawByPrefCode(prefCode);

  if (options?.type) {
    cities = cities.filter((c) => c.type === options.type);
  }
  if (options?.parentJisCode) {
    cities = cities.filter((c) => c.parentCode === options.parentJisCode);
  }

  return cities.map((c) => toAllLangs(c, options?.short));
}

export function getCityByJisCodeAllLangs(
  jisCode: string,
  options?: { short?: boolean },
): CityAllLangs | undefined {
  const raw = getCityRawByCode(jisCode);
  if (!raw) return undefined;
  return toAllLangs(raw, options?.short);
}

export function getCityByLGCodeAllLangs(
  lgCode: string,
  options?: { short?: boolean },
): CityAllLangs | undefined {
  const raw = getCityRawByLGCode(lgCode);
  if (!raw) return undefined;
  return toAllLangs(raw, options?.short);
}

export function getCitiesByPrefName(
  prefName: string,
  lang?: string,
  options?: GetCitiesOptions,
): City[] {
  const pref = getPrefectureRawByName(prefName);
  if (!pref) return [];
  return getCities(pref.code, lang, options);
}

export function getCitiesAllLangsByPrefName(
  prefName: string,
  options?: GetCitiesOptions,
): CityAllLangs[] {
  const pref = getPrefectureRawByName(prefName);
  if (!pref) return [];
  return getCitiesAllLangs(pref.code, options);
}
