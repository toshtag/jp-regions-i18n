import type { Lang } from "./types.js";

const PREF_SUFFIXES: Record<Lang, readonly string[]> = {
  ja: ["都", "道", "府", "県"],
  "zh-CN": ["都", "道", "府", "县"],
  "zh-TW": ["都", "道", "府", "縣"],
  ko: ["도", "부", "현"],
  en: [],
  pt: [],
  vi: [],
};

const CITY_SUFFIXES: Record<Lang, readonly string[]> = {
  ja: ["市", "区", "町", "村"],
  "zh-CN": ["市", "区", "町", "村"],
  "zh-TW": ["市", "區", "町", "村"],
  ko: ["시", "구", "정", "촌"],
  en: ["-shi", "-ku", "-machi", "-cho", "-son", "-mura"],
  pt: ["-shi", "-ku", "-machi", "-cho", "-son", "-mura"],
  vi: ["-shi", "-ku", "-machi", "-cho", "-son", "-mura"],
};

function stripSuffix(name: string, suffixes: readonly string[]): string {
  for (const s of suffixes) {
    if (name.endsWith(s)) return name.slice(0, -s.length);
  }
  return name;
}

export function shortenPrefName(name: string, lang: Lang): string {
  return stripSuffix(name, PREF_SUFFIXES[lang]);
}

export function shortenCityName(name: string, lang: Lang): string {
  return stripSuffix(name, CITY_SUFFIXES[lang]);
}
