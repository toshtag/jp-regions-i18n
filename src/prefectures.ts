import { normalizeLang } from "./lang.js";
import { shortenPrefName } from "./name.js";
import {
  getAllPrefectures,
  getPrefectureRawByCode,
  getPrefectureRawByISO,
  getPrefectureRawByLGCode,
} from "./store.js";
import type { GetPrefecturesOptions, Lang, Prefecture, PrefectureAllLangs } from "./types.js";

function toPublic(
  raw: { code: string; iso: string; lgCode: string; name: Record<string, string> },
  lang: Lang,
  short?: boolean,
): Prefecture {
  const name = raw.name[lang];
  return { code: raw.code, iso: raw.iso, lgCode: raw.lgCode, name: short ? shortenPrefName(name, lang) : name };
}

function toPublicAllLangs(
  raw: { code: string; iso: string; lgCode: string; name: Record<Lang, string> },
  short?: boolean,
): PrefectureAllLangs {
  let name = raw.name;
  if (short) {
    name = Object.fromEntries(
      (Object.entries(raw.name) as [Lang, string][]).map(([lang, n]) => [lang, shortenPrefName(n, lang)]),
    ) as Record<Lang, string>;
  }
  return { code: raw.code, iso: raw.iso, lgCode: raw.lgCode, name };
}

export function getPrefectures(lang?: string, options?: GetPrefecturesOptions): Prefecture[] {
  const l = normalizeLang(lang);
  return getAllPrefectures().map((p) => toPublic(p, l, options?.short));
}

export function getPrefectureByCode(
  code: string,
  lang?: string,
  options?: GetPrefecturesOptions,
): Prefecture | undefined {
  const raw = getPrefectureRawByCode(code);
  if (!raw) return undefined;
  return toPublic(raw, normalizeLang(lang), options?.short);
}

export function getPrefectureByISO(
  iso: string,
  lang?: string,
  options?: GetPrefecturesOptions,
): Prefecture | undefined {
  const raw = getPrefectureRawByISO(iso);
  if (!raw) return undefined;
  return toPublic(raw, normalizeLang(lang), options?.short);
}

export function getPrefectureByLGCode(
  lgCode: string,
  lang?: string,
  options?: GetPrefecturesOptions,
): Prefecture | undefined {
  const raw = getPrefectureRawByLGCode(lgCode);
  if (!raw) return undefined;
  return toPublic(raw, normalizeLang(lang), options?.short);
}

export function getPrefecturesAllLangs(options?: GetPrefecturesOptions): PrefectureAllLangs[] {
  return getAllPrefectures().map((p) => toPublicAllLangs(p, options?.short));
}

export function getPrefectureByCodeAllLangs(
  code: string,
  options?: GetPrefecturesOptions,
): PrefectureAllLangs | undefined {
  const raw = getPrefectureRawByCode(code);
  if (!raw) return undefined;
  return toPublicAllLangs(raw, options?.short);
}

export function getPrefectureByISOAllLangs(
  iso: string,
  options?: GetPrefecturesOptions,
): PrefectureAllLangs | undefined {
  const raw = getPrefectureRawByISO(iso);
  if (!raw) return undefined;
  return toPublicAllLangs(raw, options?.short);
}

export function getPrefectureByLGCodeAllLangs(
  lgCode: string,
  options?: GetPrefecturesOptions,
): PrefectureAllLangs | undefined {
  const raw = getPrefectureRawByLGCode(lgCode);
  if (!raw) return undefined;
  return toPublicAllLangs(raw, options?.short);
}
