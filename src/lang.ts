import type { Lang } from "./types.js";

const SUPPORTED_LANGS: readonly Lang[] = ["ja", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"];

const LANG_ALIASES: Record<string, Lang> = {
  "zh-Hans": "zh-CN",
  "zh-Hant": "zh-TW",
  zh: "zh-CN",
  cn: "zh-CN",
  tw: "zh-TW",
};

export function normalizeLang(input?: string): Lang {
  if (!input) return "ja";
  const alias = LANG_ALIASES[input];
  if (alias) return alias;
  if (SUPPORTED_LANGS.includes(input as Lang)) return input as Lang;
  return "ja";
}

export function getSupportedLanguages(): readonly Lang[] {
  return SUPPORTED_LANGS;
}
