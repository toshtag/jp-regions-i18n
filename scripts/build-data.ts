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

const SINGLE_LANGS = ["en", "zh-CN", "zh-TW", "ko", "pt", "vi"] as const;

// lgCode(6桁) から code(5桁) のサフィックス1桁を抽出
// code は5桁、lgCode は6桁で先頭5桁が同じ
function cityLgSuffix(lgCode: string): string {
  return lgCode.slice(5);
}

// lgCode(6桁) から pref code(2桁) のサフィックス4桁を抽出
function prefLgSuffix(lgCode: string): string {
  return lgCode.slice(2);
}

// 都市: [code, lgSuffix, typeNum, name..., parentCode?]
// - prefCode は code[0:2] から派生可能 → 省略
// - lgCode は code + lgSuffix(1桁) から復元可能 → suffix のみ保存
// - parentCode は ward/designated_city の一部のみ存在 → 末尾オプション
function buildCityRow(row: CityRow, ...names: string[]): unknown[] {
  const result: unknown[] = [row.code, cityLgSuffix(row.lg_code), CITY_TYPE_INDEX[row.type] ?? 0, ...names];
  if (row.parent_code) result.push(row.parent_code);
  return result;
}

// 都道府県: [code, lgSuffix, name...]
// - iso は "JP-" + code から派生可能 → 省略
function buildPrefRow(row: PrefectureRow, ...names: string[]): unknown[] {
  return [row.code, prefLgSuffix(row.lg_code), ...names];
}

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

  // 全言語: [code, lgSuffix, ja, ja-Hira, en, zh-CN, zh-TW, ko, pt, vi]
  const all = rows.map((row) =>
    buildPrefRow(row, row.ja, row.ja_hira, row.en, row["zh-CN"], row["zh-TW"], row.ko, row.pt, row.vi),
  );
  writeJson(`${OUTPUT_DIR}/prefectures.json`, all);

  // 日本語: [code, lgSuffix, ja, ja-Hira]
  const ja = rows.map((row) => buildPrefRow(row, row.ja, row.ja_hira));
  writeJson(`${OUTPUT_DIR}/prefectures-ja.json`, ja);

  // その他言語: [code, lgSuffix, name]
  for (const lang of SINGLE_LANGS) {
    const data = rows.map((row) => buildPrefRow(row, row[lang]));
    writeJson(`${OUTPUT_DIR}/prefectures-${lang}.json`, data);
  }

  console.log(`Generated prefectures.json + ${1 + SINGLE_LANGS.length} lang files (${rows.length} entries)`);
}

function buildCities(): void {
  const rows = readCsv<CityRow>(`${DATA_SOURCE_DIR}/cities.csv`);

  // 全言語: [code, lgSuffix, typeNum, ja, ja-Hira, en, zh-CN, zh-TW, ko, pt, vi, parentCode?]
  const all = rows.map((row) =>
    buildCityRow(row, row.ja, row.ja_hira, row.en, row["zh-CN"], row["zh-TW"], row.ko, row.pt, row.vi),
  );
  writeJson(`${OUTPUT_DIR}/cities.json`, all);

  // 日本語: [code, lgSuffix, typeNum, ja, ja-Hira, parentCode?]
  const ja = rows.map((row) => buildCityRow(row, row.ja, row.ja_hira));
  writeJson(`${OUTPUT_DIR}/cities-ja.json`, ja);

  // その他言語: [code, lgSuffix, typeNum, name, parentCode?]
  for (const lang of SINGLE_LANGS) {
    const data = rows.map((row) => buildCityRow(row, row[lang]));
    writeJson(`${OUTPUT_DIR}/cities-${lang}.json`, data);
  }

  console.log(`Generated cities.json + ${1 + SINGLE_LANGS.length} lang files (${rows.length} entries)`);
}

function writeJson(filePath: string, data: unknown): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(filePath, JSON.stringify(data), "utf-8");
}

buildPrefectures();
buildCities();
