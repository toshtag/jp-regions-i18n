import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { parse } from "csv-parse/sync";

const DATA_SOURCE_DIR = "data-source";
const OUTPUT_DIR = "src/generated";

interface PrefectureRow {
  code: string;
  iso: string;
  lg_code: string;
  ja: string;
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
  en: string;
  "zh-CN": string;
  "zh-TW": string;
  ko: string;
  pt: string;
  vi: string;
}

const LANG_KEYS = ["ja", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"] as const;

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

  const prefectures = rows.map((row) => ({
    code: row.code,
    iso: row.iso,
    lgCode: row.lg_code,
    name: Object.fromEntries(LANG_KEYS.map((lang) => [lang, row[lang]])),
  }));

  writeJson(`${OUTPUT_DIR}/prefectures.json`, prefectures);
  console.log(`Generated prefectures.json (${prefectures.length} entries)`);
}

function buildCities(): void {
  const rows = readCsv<CityRow>(`${DATA_SOURCE_DIR}/cities.csv`);

  const cities = rows.map((row) => ({
    code: row.code,
    prefCode: row.pref_code,
    lgCode: row.lg_code,
    parentCode: row.parent_code || null,
    type: row.type,
    name: Object.fromEntries(LANG_KEYS.map((lang) => [lang, row[lang]])),
  }));

  writeJson(`${OUTPUT_DIR}/cities.json`, cities);
  console.log(`Generated cities.json (${cities.length} entries)`);
}

function writeJson(filePath: string, data: unknown): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

buildPrefectures();
buildCities();
