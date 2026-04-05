import citiesData from "./generated/cities.json" with { type: "json" };
import prefecturesData from "./generated/prefectures.json" with { type: "json" };
import { hiraToKana, kanaToHW } from "./kana.js";
import { shortenPrefName } from "./name.js";
import { type CityType, decodeCityType, type Lang } from "./types.js";

interface PrefectureRaw {
  code: string;
  iso: string;
  lgCode: string;
  name: Record<Lang, string>;
}

interface CityRaw {
  code: string;
  prefCode: string;
  lgCode: string;
  parentCode: string | null;
  type: CityType;
  name: Record<Lang, string>;
}

// 全言語スキーマ: [code, lgSuffix4, ja, ja-Hira, en, zh-CN, zh-TW, ko, pt, vi]
// iso  = "JP-" + code
// lgCode = code + lgSuffix4
function parsePref(row: unknown[]): PrefectureRaw {
  const [code, lgSuffix, ja, jaHira, en, zhCN, zhTW, ko, pt, vi] = row as string[];
  const jaKana = hiraToKana(jaHira);
  return {
    code,
    iso: `JP-${code}`,
    lgCode: code + lgSuffix,
    name: {
      ja,
      "ja-Hira": jaHira,
      "ja-Kana": jaKana,
      "ja-HW": kanaToHW(jaKana),
      en,
      "zh-CN": zhCN,
      "zh-TW": zhTW,
      ko,
      pt,
      vi,
    },
  };
}

// 全言語スキーマ: [code, lgSuffix1, typeNum, ja, ja-Hira, en, zh-CN, zh-TW, ko, pt, vi, parentCode?]
// prefCode = code[0:2]
// lgCode   = code + lgSuffix1
function parseCity(row: unknown[]): CityRaw {
  const [code, lgSuffix, typeNum, ja, jaHira, en, zhCN, zhTW, ko, pt, vi, parentCode] = row as [
    string,
    string,
    number,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string | undefined,
  ];
  const jaKana = hiraToKana(jaHira);
  return {
    code,
    prefCode: code.slice(0, 2),
    lgCode: code + lgSuffix,
    parentCode: parentCode ?? null,
    type: decodeCityType(typeNum),
    name: {
      ja,
      "ja-Hira": jaHira,
      "ja-Kana": jaKana,
      "ja-HW": kanaToHW(jaKana),
      en,
      "zh-CN": zhCN,
      "zh-TW": zhTW,
      ko,
      pt,
      vi,
    },
  };
}

let prefByCode = new Map<string, PrefectureRaw>();
let prefByISO = new Map<string, PrefectureRaw>();
let prefByLGCode = new Map<string, PrefectureRaw>();
let prefInitialized = false;

let cityByCode = new Map<string, CityRaw>();
let cityByLGCode = new Map<string, CityRaw>();
let citiesByPrefCode = new Map<string, CityRaw[]>();
let cityInitialized = false;

function initPrefectures(): void {
  if (prefInitialized) return;
  prefInitialized = true;
  const data = (prefecturesData as unknown[][]).map(parsePref);
  prefByCode = new Map(data.map((p) => [p.code, p]));
  prefByISO = new Map(data.map((p) => [p.iso, p]));
  prefByLGCode = new Map(data.map((p) => [p.lgCode, p]));
}

function initCities(): void {
  if (cityInitialized) return;
  cityInitialized = true;
  const data = (citiesData as unknown[][]).map(parseCity);
  cityByCode = new Map(data.map((c) => [c.code, c]));
  cityByLGCode = new Map(data.map((c) => [c.lgCode, c]));
  citiesByPrefCode = new Map();
  for (const c of data) {
    const list = citiesByPrefCode.get(c.prefCode);
    if (list) {
      list.push(c);
    } else {
      citiesByPrefCode.set(c.prefCode, [c]);
    }
  }
}

export function getAllPrefectures(): PrefectureRaw[] {
  initPrefectures();
  return [...prefByCode.values()];
}

export function getPrefectureRawByCode(code: string): PrefectureRaw | undefined {
  initPrefectures();
  return prefByCode.get(code);
}

export function getPrefectureRawByISO(iso: string): PrefectureRaw | undefined {
  initPrefectures();
  return prefByISO.get(iso);
}

export function getPrefectureRawByLGCode(lgCode: string): PrefectureRaw | undefined {
  initPrefectures();
  return prefByLGCode.get(lgCode);
}

export function getCitiesRawByPrefCode(prefCode: string): CityRaw[] {
  initCities();
  return citiesByPrefCode.get(prefCode) ?? [];
}

export function getCityRawByCode(code: string): CityRaw | undefined {
  initCities();
  return cityByCode.get(code);
}

export function getCityRawByLGCode(lgCode: string): CityRaw | undefined {
  initCities();
  return cityByLGCode.get(lgCode);
}

export function getPrefectureRawByName(name: string): PrefectureRaw | undefined {
  initPrefectures();
  const lower = name.toLowerCase();
  for (const pref of prefByCode.values()) {
    for (const [langKey, prefName] of Object.entries(pref.name) as [Lang, string][]) {
      if (prefName.toLowerCase() === lower) return pref;
      const short = shortenPrefName(prefName, langKey);
      if (short.toLowerCase() === lower) return pref;
    }
  }
  return undefined;
}
