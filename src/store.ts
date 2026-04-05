import citiesData from "./generated/cities.json" with { type: "json" };
import prefecturesData from "./generated/prefectures.json" with { type: "json" };
import { shortenPrefName } from "./name.js";
import type { CityType, Lang } from "./types.js";

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
  const data = prefecturesData as PrefectureRaw[];
  prefByCode = new Map(data.map((p) => [p.code, p]));
  prefByISO = new Map(data.map((p) => [p.iso, p]));
  prefByLGCode = new Map(data.map((p) => [p.lgCode, p]));
}

function initCities(): void {
  if (cityInitialized) return;
  cityInitialized = true;
  const data = citiesData as CityRaw[];
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
