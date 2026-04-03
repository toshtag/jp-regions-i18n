import { normalizeLang } from "./lang.js";
import { getAllPrefectures, getPrefectureRawByCode, getPrefectureRawByISO } from "./store.js";
import type { Prefecture } from "./types.js";

export function getPrefectures(lang?: string): Prefecture[] {
  const l = normalizeLang(lang);
  return getAllPrefectures().map((p) => ({
    code: p.code,
    iso: p.iso,
    name: p.name[l],
  }));
}

export function getPrefectureByCode(code: string, lang?: string): Prefecture | undefined {
  const raw = getPrefectureRawByCode(code);
  if (!raw) return undefined;
  const l = normalizeLang(lang);
  return { code: raw.code, iso: raw.iso, name: raw.name[l] };
}

export function getPrefectureByISO(iso: string, lang?: string): Prefecture | undefined {
  const raw = getPrefectureRawByISO(iso);
  if (!raw) return undefined;
  const l = normalizeLang(lang);
  return { code: raw.code, iso: raw.iso, name: raw.name[l] };
}
