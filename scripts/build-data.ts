import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

const DATA_SOURCE_DIR = "data-source";
const OUTPUT_DIR = "src/generated";

interface PrefectureRow {
  code: string;
  iso: string;
  lg_code: string;
  ja: string;
  ja_hira: string;
  en: string;
  "zh-CN": string;
  "zh-TW": string;
  ko: string;
  pt: string;
  vi: string;
}

interface CityRow {
  pref_code: string;
  code: string;
  lg_code: string;
  parent_code: string;
  type: string;
  ja: string;
  ja_hira: string;
  en: string;
  "zh-CN": string;
  "zh-TW": string;
  ko: string;
  pt: string;
  vi: string;
}

// CityType の数値エンコード（src/types.ts の CITY_TYPE_NAMES と同順）
const CITY_TYPE_INDEX: Record<string, number> = {
  city: 0,
  designated_city: 1,
  ward: 2,
  special_ward: 3,
  town: 4,
  village: 5,
};

// 言語別ファイルのコロンは ja-Hira のみ（ja-Kana/ja-HW は実行時変換）
const SINGLE_LANGS = ["en", "zh-CN", "zh-TW", "ko", "pt", "vi"] as const;

function readCsv<T>(filePath: string): T[] {
  const content = readFileSync(filePath, "utf-8");
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

function buildPrefectures(): void {
  const rows = readCsv<PrefectureRow>(`${DATA_SOURCE_DIR}/prefectures.csv`);

  // 全言語・配列形式: [code, iso, lgCode, ja, ja-Hira, en, zh-CN, zh-TW, ko, pt, vi]
  const all = rows.map((row) => [
    row.code,
    row.iso,
    row.lg_code,
    row.ja,
    row.ja_hira,
    row.en,
    row["zh-CN"],
    row["zh-TW"],
    row.ko,
    row.pt,
    row.vi,
  ]);
  writeJson(`${OUTPUT_DIR}/prefectures.json`, all);

  // 日本語別: [code, iso, lgCode, ja, ja-Hira]
  const ja = rows.map((row) => [row.code, row.iso, row.lg_code, row.ja, row.ja_hira]);
  writeJson(`${OUTPUT_DIR}/prefectures-ja.json`, ja);

  // その他言語別: [code, iso, lgCode, name]
  for (const lang of SINGLE_LANGS) {
    const data = rows.map((row) => [row.code, row.iso, row.lg_code, row[lang]]);
    writeJson(`${OUTPUT_DIR}/prefectures-${lang}.json`, data);
  }

  console.log(`Generated prefectures.json + ${1 + SINGLE_LANGS.length} lang files (${rows.length} entries)`);
}

function buildCities(): void {
  const rows = readCsv<CityRow>(`${DATA_SOURCE_DIR}/cities.csv`);

  // 全言語・配列形式: [code, prefCode, lgCode, parentCode, typeNum, ja, ja-Hira, en, zh-CN, zh-TW, ko, pt, vi]
  const all = rows.map((row) => [
    row.code,
    row.pref_code,
    row.lg_code,
    row.parent_code || null,
    CITY_TYPE_INDEX[row.type] ?? 0,
    row.ja,
    row.ja_hira,
    row.en,
    row["zh-CN"],
    row["zh-TW"],
    row.ko,
    row.pt,
    row.vi,
  ]);
  writeJson(`${OUTPUT_DIR}/cities.json`, all);

  // 日本語別: [code, prefCode, lgCode, parentCode, typeNum, ja, ja-Hira]
  const ja = rows.map((row) => [
    row.code,
    row.pref_code,
    row.lg_code,
    row.parent_code || null,
    CITY_TYPE_INDEX[row.type] ?? 0,
    row.ja,
    row.ja_hira,
  ]);
  writeJson(`${OUTPUT_DIR}/cities-ja.json`, ja);

  // その他言語別: [code, prefCode, lgCode, parentCode, typeNum, name]
  for (const lang of SINGLE_LANGS) {
    const data = rows.map((row) => [
      row.code,
      row.pref_code,
      row.lg_code,
      row.parent_code || null,
      CITY_TYPE_INDEX[row.type] ?? 0,
      row[lang],
    ]);
    writeJson(`${OUTPUT_DIR}/cities-${lang}.json`, data);
  }

  console.log(`Generated cities.json + ${1 + SINGLE_LANGS.length} lang files (${rows.length} entries)`);
}

function writeJson(filePath: string, data: unknown): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  // minify: インデントなし
  writeFileSync(filePath, JSON.stringify(data), "utf-8");
}

buildPrefectures();
buildCities();
