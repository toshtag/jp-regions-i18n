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

const LANG_KEYS = ["ja", "ja-Hira", "ja-Kana", "ja-HW", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"] as const;

// ひらがな→カタカナ（U+3041-U+3096 → U+30A1-U+30F6）
function hiraToKana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60),
  );
}

// カタカナ→半角カナ（濁点・半濁点は2文字に分解）
const KANA_TO_HW: Record<string, string> = {
  ア: "ｱ", イ: "ｲ", ウ: "ｳ", エ: "ｴ", オ: "ｵ",
  カ: "ｶ", キ: "ｷ", ク: "ｸ", ケ: "ｹ", コ: "ｺ",
  サ: "ｻ", シ: "ｼ", ス: "ｽ", セ: "ｾ", ソ: "ｿ",
  タ: "ﾀ", チ: "ﾁ", ツ: "ﾂ", テ: "ﾃ", ト: "ﾄ",
  ナ: "ﾅ", ニ: "ﾆ", ヌ: "ﾇ", ネ: "ﾈ", ノ: "ﾉ",
  ハ: "ﾊ", ヒ: "ﾋ", フ: "ﾌ", ヘ: "ﾍ", ホ: "ﾎ",
  マ: "ﾏ", ミ: "ﾐ", ム: "ﾑ", メ: "ﾒ", モ: "ﾓ",
  ヤ: "ﾔ", ユ: "ﾕ", ヨ: "ﾖ",
  ラ: "ﾗ", リ: "ﾘ", ル: "ﾙ", レ: "ﾚ", ロ: "ﾛ",
  ワ: "ﾜ", ヲ: "ｦ", ン: "ﾝ",
  ガ: "ｶﾞ", ギ: "ｷﾞ", グ: "ｸﾞ", ゲ: "ｹﾞ", ゴ: "ｺﾞ",
  ザ: "ｻﾞ", ジ: "ｼﾞ", ズ: "ｽﾞ", ゼ: "ｾﾞ", ゾ: "ｿﾞ",
  ダ: "ﾀﾞ", ヂ: "ﾁﾞ", ヅ: "ﾂﾞ", デ: "ﾃﾞ", ド: "ﾄﾞ",
  バ: "ﾊﾞ", ビ: "ﾋﾞ", ブ: "ﾌﾞ", ベ: "ﾍﾞ", ボ: "ﾎﾞ",
  パ: "ﾊﾟ", ピ: "ﾋﾟ", プ: "ﾌﾟ", ペ: "ﾍﾟ", ポ: "ﾎﾟ",
  ァ: "ｧ", ィ: "ｨ", ゥ: "ｩ", ェ: "ｪ", ォ: "ｫ",
  ッ: "ｯ", ャ: "ｬ", ュ: "ｭ", ョ: "ｮ",
  ヴ: "ｳﾞ", ー: "ｰ",
  // 括弧（地名で使用）
  "（": "（", "）": "）",
};

function kanaToHW(str: string): string {
  return str
    .split("")
    .map((ch) => KANA_TO_HW[ch] ?? ch)
    .join("");
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

  const prefectures = rows.map((row) => {
    const kana = hiraToKana(row.ja_hira);
    const hw = kanaToHW(kana);
    return {
      code: row.code,
      iso: row.iso,
      lgCode: row.lg_code,
      name: Object.fromEntries(
        LANG_KEYS.map((lang) => {
          if (lang === "ja-Hira") return [lang, row.ja_hira];
          if (lang === "ja-Kana") return [lang, kana];
          if (lang === "ja-HW") return [lang, hw];
          return [lang, row[lang as keyof PrefectureRow]];
        }),
      ),
    };
  });

  writeJson(`${OUTPUT_DIR}/prefectures.json`, prefectures);
  console.log(`Generated prefectures.json (${prefectures.length} entries)`);
}

function buildCities(): void {
  const rows = readCsv<CityRow>(`${DATA_SOURCE_DIR}/cities.csv`);

  const cities = rows.map((row) => {
    const kana = hiraToKana(row.ja_hira);
    const hw = kanaToHW(kana);
    return {
      code: row.code,
      prefCode: row.pref_code,
      lgCode: row.lg_code,
      parentCode: row.parent_code || null,
      type: row.type,
      name: Object.fromEntries(
        LANG_KEYS.map((lang) => {
          if (lang === "ja-Hira") return [lang, row.ja_hira];
          if (lang === "ja-Kana") return [lang, kana];
          if (lang === "ja-HW") return [lang, hw];
          return [lang, row[lang as keyof CityRow]];
        }),
      ),
    };
  });

  writeJson(`${OUTPUT_DIR}/cities.json`, cities);
  console.log(`Generated cities.json (${cities.length} entries)`);
}

function writeJson(filePath: string, data: unknown): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

buildPrefectures();
buildCities();
