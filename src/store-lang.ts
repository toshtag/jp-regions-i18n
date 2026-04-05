import { hiraToKana, kanaToHW } from "./kana.js";
import { shortenCityName, shortenPrefName } from "./name.js";
import {
  type City,
  type CityType,
  decodeCityType,
  type GetCitiesOptions,
  type GetPrefecturesOptions,
  type Prefecture,
} from "./types.js";

// 言語別エントリポイント専用の軽量ストア
// AllLangs API は提供しない（全言語データが不要なため）

interface PrefLang {
  code: string;
  iso: string;
  lgCode: string;
  name: string;
  nameHira?: string;
}

interface CityLang {
  code: string;
  prefCode: string;
  lgCode: string;
  parentCode: string | null;
  type: CityType;
  name: string;
  nameHira?: string;
}

function parsePrefRow(row: unknown[], hasKana: boolean): PrefLang {
  if (hasKana) {
    // [code, iso, lgCode, ja, ja-Hira]
    const [code, iso, lgCode, name, nameHira] = row as string[];
    return { code, iso, lgCode, name, nameHira };
  }
  // [code, iso, lgCode, name]
  const [code, iso, lgCode, name] = row as string[];
  return { code, iso, lgCode, name };
}

function parseCityRow(row: unknown[], hasKana: boolean): CityLang {
  if (hasKana) {
    // [code, prefCode, lgCode, parentCode, typeNum, ja, ja-Hira]
    const [code, prefCode, lgCode, parentCode, typeNum, name, nameHira] = row as [
      string,
      string,
      string,
      string | null,
      number,
      string,
      string,
    ];
    return {
      code,
      prefCode,
      lgCode,
      parentCode: parentCode || null,
      type: decodeCityType(typeNum),
      name,
      nameHira,
    };
  }
  // [code, prefCode, lgCode, parentCode, typeNum, name]
  const [code, prefCode, lgCode, parentCode, typeNum, name] = row as [
    string,
    string,
    string,
    string | null,
    number,
    string,
  ];
  return {
    code,
    prefCode,
    lgCode,
    parentCode: parentCode || null,
    type: decodeCityType(typeNum),
    name,
  };
}

function prefToPublic(p: PrefLang, lang: string, short?: boolean): Prefecture {
  let name = p.name;
  if (lang === "ja-Kana" && p.nameHira) name = hiraToKana(p.nameHira);
  else if (lang === "ja-HW" && p.nameHira) name = kanaToHW(hiraToKana(p.nameHira));
  else if (lang === "ja-Hira" && p.nameHira) name = p.nameHira;
  if (short) name = shortenPrefName(name, lang as never);
  return { code: p.code, iso: p.iso, lgCode: p.lgCode, name };
}

function cityToPublic(c: CityLang, lang: string, short?: boolean): City {
  let name = c.name;
  if (lang === "ja-Kana" && c.nameHira) name = hiraToKana(c.nameHira);
  else if (lang === "ja-HW" && c.nameHira) name = kanaToHW(hiraToKana(c.nameHira));
  else if (lang === "ja-Hira" && c.nameHira) name = c.nameHira;
  if (short) name = shortenCityName(name, lang as never);
  return {
    jisCode: c.code,
    prefCode: c.prefCode,
    lgCode: c.lgCode,
    parentJisCode: c.parentCode,
    type: c.type,
    name,
  };
}

export interface LangStore {
  getPrefectures(options?: GetPrefecturesOptions): Prefecture[];
  getPrefectureByCode(code: string, options?: GetPrefecturesOptions): Prefecture | undefined;
  getPrefectureByISO(iso: string, options?: GetPrefecturesOptions): Prefecture | undefined;
  getPrefectureByLGCode(lgCode: string, options?: GetPrefecturesOptions): Prefecture | undefined;
  getPrefectureByName(name: string, options?: GetPrefecturesOptions): Prefecture | undefined;
  getCities(prefCode: string, options?: GetCitiesOptions): City[];
  getCityByJisCode(jisCode: string, options?: { short?: boolean }): City | undefined;
  getCityByLGCode(lgCode: string, options?: { short?: boolean }): City | undefined;
  getCitiesByPrefName(prefName: string, options?: GetCitiesOptions): City[];
}

export function createLangStore(
  prefRows: unknown[][],
  cityRows: unknown[][],
  lang: string,
  hasKana: boolean,
): LangStore {
  let prefByCode: Map<string, PrefLang> | undefined;
  let prefByISO: Map<string, PrefLang> | undefined;
  let prefByLGCode: Map<string, PrefLang> | undefined;
  let cityByCode: Map<string, CityLang> | undefined;
  let cityByLGCode: Map<string, CityLang> | undefined;
  let citiesByPrefCode: Map<string, CityLang[]> | undefined;

  function initPrefs(): void {
    if (prefByCode) return;
    const data = prefRows.map((r) => parsePrefRow(r, hasKana));
    prefByCode = new Map(data.map((p) => [p.code, p]));
    prefByISO = new Map(data.map((p) => [p.iso, p]));
    prefByLGCode = new Map(data.map((p) => [p.lgCode, p]));
  }

  function initCities(): void {
    if (cityByCode) return;
    const data = cityRows.map((r) => parseCityRow(r, hasKana));
    cityByCode = new Map(data.map((c) => [c.code, c]));
    cityByLGCode = new Map(data.map((c) => [c.lgCode, c]));
    citiesByPrefCode = new Map();
    for (const c of data) {
      const list = citiesByPrefCode.get(c.prefCode);
      if (list) list.push(c);
      else citiesByPrefCode.set(c.prefCode, [c]);
    }
  }

  function filterCities(cities: CityLang[], options?: GetCitiesOptions): CityLang[] {
    let result = cities;
    if (options?.type) result = result.filter((c) => c.type === options.type);
    if (options?.parentJisCode)
      result = result.filter((c) => c.parentCode === options.parentJisCode);
    return result;
  }

  function findPrefByName(name: string): PrefLang | undefined {
    initPrefs();
    const lower = name.toLowerCase();
    for (const p of (prefByCode ?? new Map()).values()) {
      if (p.name.toLowerCase() === lower) return p;
      if (shortenPrefName(p.name, lang as never).toLowerCase() === lower) return p;
    }
    return undefined;
  }

  return {
    getPrefectures(options) {
      initPrefs();
      return [...(prefByCode ?? new Map()).values()].map((p) =>
        prefToPublic(p, lang, options?.short),
      );
    },
    getPrefectureByCode(code, options) {
      initPrefs();
      const p = prefByCode?.get(code);
      return p ? prefToPublic(p, lang, options?.short) : undefined;
    },
    getPrefectureByISO(iso, options) {
      initPrefs();
      const p = prefByISO?.get(iso);
      return p ? prefToPublic(p, lang, options?.short) : undefined;
    },
    getPrefectureByLGCode(lgCode, options) {
      initPrefs();
      const p = prefByLGCode?.get(lgCode);
      return p ? prefToPublic(p, lang, options?.short) : undefined;
    },
    getPrefectureByName(name, options) {
      const p = findPrefByName(name);
      return p ? prefToPublic(p, lang, options?.short) : undefined;
    },
    getCities(prefCode, options) {
      initCities();
      const cities = filterCities(citiesByPrefCode?.get(prefCode) ?? [], options);
      return cities.map((c) => cityToPublic(c, lang, options?.short));
    },
    getCityByJisCode(jisCode, options) {
      initCities();
      const c = cityByCode?.get(jisCode);
      return c ? cityToPublic(c, lang, options?.short) : undefined;
    },
    getCityByLGCode(lgCode, options) {
      initCities();
      const c = cityByLGCode?.get(lgCode);
      return c ? cityToPublic(c, lang, options?.short) : undefined;
    },
    getCitiesByPrefName(prefName, options) {
      const p = findPrefByName(prefName);
      if (!p) return [];
      initCities();
      const cities = filterCities(citiesByPrefCode?.get(p.code) ?? [], options);
      return cities.map((c) => cityToPublic(c, lang, options?.short));
    },
  };
}
