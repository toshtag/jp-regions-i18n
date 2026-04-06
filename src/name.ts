import type { Lang } from "./types.js";

const PREF_SUFFIXES: Record<Lang, readonly string[]> = {
  ja: ["都", "道", "府", "県"],
  "ja-Hira": ["と", "どう", "ふ", "けん"],
  "ja-Kana": ["ト", "ドウ", "フ", "ケン"],
  "ja-HW": ["ﾄ", "ﾄﾞｳ", "ﾌ", "ｹﾝ"],
  "zh-CN": ["都", "道", "府", "县"],
  "zh-TW": ["都", "道", "府", "縣"],
  ko: ["도", "부", "현"],
  en: [],
  pt: [],
  vi: [" tỉnh", " phủ", " đô", " đạo"],
};

const CITY_SUFFIXES: Record<Lang, readonly string[]> = {
  ja: ["市", "区", "町", "村"],
  "ja-Hira": ["し", "く", "まち", "ちょう", "むら", "そん"],
  "ja-Kana": ["シ", "ク", "マチ", "チョウ", "ムラ", "ソン"],
  "ja-HW": ["ｼ", "ｸ", "ﾏﾁ", "ﾁｮｳ", "ﾑﾗ", "ｿﾝ"],
  "zh-CN": ["市", "区", "町", "村"],
  "zh-TW": ["市", "區", "町", "村"],
  ko: ["시", "구", "정", "촌"],
  en: ["-shi", "-ku", "-machi", "-cho", "-son", "-mura"],
  pt: ["-shi", "-ku", "-machi", "-cho", "-son", "-mura"],
  vi: [" thị", " khu", " đinh", " thôn"],
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
