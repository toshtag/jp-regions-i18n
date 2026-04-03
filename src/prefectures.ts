import { normalizeLang } from "./lang.js";
import {
  getAllPrefectures,
  getPrefectureRawByCode,
  getPrefectureRawByISO,
  getPrefectureRawByLGCode,
} from "./store.js";
import type { Lang, Prefecture, PrefectureAllLangs } from "./types.js";

function toPublic(
  raw: { code: string; iso: string; lgCode: string; name: Record<string, string> },
  lang: string,
): Prefecture {
  return { code: raw.code, iso: raw.iso, lgCode: raw.lgCode, name: raw.name[lang] };
}

function toPublicAllLangs(raw: {
  code: string;
  iso: string;
  lgCode: string;
  name: Record<Lang, string>;
}): PrefectureAllLangs {
  return { code: raw.code, iso: raw.iso, lgCode: raw.lgCode, name: raw.name };
}

export function getPrefectures(lang?: string): Prefecture[] {
  const l = normalizeLang(lang);
  return getAllPrefectures().map((p) => toPublic(p, l));
}

export function getPrefectureByCode(code: string, lang?: string): Prefecture | undefined {
  const raw = getPrefectureRawByCode(code);
  if (!raw) return undefined;
  return toPublic(raw, normalizeLang(lang));
}

export function getPrefectureByISO(iso: string, lang?: string): Prefecture | undefined {
  const raw = getPrefectureRawByISO(iso);
  if (!raw) return undefined;
  return toPublic(raw, normalizeLang(lang));
}

export function getPrefectureByLGCode(lgCode: string, lang?: string): Prefecture | undefined {
  const raw = getPrefectureRawByLGCode(lgCode);
  if (!raw) return undefined;
  return toPublic(raw, normalizeLang(lang));
}

export function getPrefecturesAllLangs(): PrefectureAllLangs[] {
  return getAllPrefectures().map(toPublicAllLangs);
}

export function getPrefectureByCodeAllLangs(code: string): PrefectureAllLangs | undefined {
  const raw = getPrefectureRawByCode(code);
  if (!raw) return undefined;
  return toPublicAllLangs(raw);
}

export function getPrefectureByISOAllLangs(iso: string): PrefectureAllLangs | undefined {
  const raw = getPrefectureRawByISO(iso);
  if (!raw) return undefined;
  return toPublicAllLangs(raw);
}

export function getPrefectureByLGCodeAllLangs(lgCode: string): PrefectureAllLangs | undefined {
  const raw = getPrefectureRawByLGCode(lgCode);
  if (!raw) return undefined;
  return toPublicAllLangs(raw);
}
