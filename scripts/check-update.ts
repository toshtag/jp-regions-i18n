/**
 * 全国地方公共団体コードの変更検知スクリプト
 *
 * code4fukui/localgovjp の公開 CSV と data-source/cities.csv を5桁コードで比較し、
 * 差異がある市区町村を検知する。
 *
 * 検知ソース: https://code4fukui.github.io/localgovjp/localgovjp-utf8.csv
 * ライセンス: CC0（パブリックドメイン）
 *
 * 既知の差異（除外対象）:
 *   - 東京特別区 (13101-13123): special_ward として別管理のため upstream では除外
 *   - 北方領土 (01695-01700): 実効支配なし、localgovjp に含まれないが cities.csv には存在
 *   - 浜松市旧4区 (22134-22137): 2024年1月の区再編で廃止済み。localgovjp が旧データのまま
 *
 * lgcode の末尾1桁はチェックディジットのため比較には5桁コード（lgcode[0:5]）を使用する。
 * 差異が検知された場合は参考情報として報告し、総務省の公式ページで確認すること。
 */

import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

const UPSTREAM_CSV_URL = "https://code4fukui.github.io/localgovjp/localgovjp-utf8.csv";
const LOCAL_CITIES_CSV = "data-source/cities.csv";

// 東京特別区: jp-regions-i18n では special_ward として管理。
// localgovjp はこれらを含むが、比較対象外とする。
const SPECIAL_WARD_CODES = new Set(
  Array.from({ length: 23 }, (_, i) => String(13101 + i).padStart(5, "0")),
);

// 北方領土: 実効支配なし。cities.csv には含まれるが localgovjp に含まれない既知の差異。
const KNOWN_LOCAL_ONLY_CODES = new Set([
  "01695", // 色丹村
  "01696", // 泊村（国後郡）
  "01697", // 留夜別村
  "01698", // 留別村
  "01699", // 紗那村
  "01700", // 蘂取村
]);

// upstream (localgovjp) が古いため cities.csv より余分に含まれる既知のコード。
// これらは upstream 側で旧データが残っているだけで、廃止済みとして除外する。
const KNOWN_UPSTREAM_ONLY_CODES = new Set([
  "22134", // 浜松市 南区（2024-01-01 廃止、中央区・浜名区に統合）
  "22135", // 浜松市 北区（2024-01-01 廃止、中央区に統合）
  "22136", // 浜松市 浜北区（2024-01-01 廃止、浜名区に統合）
  "22137", // 浜松市 天竜区（2024-01-01 廃止、天竜区 22133 に再編）
]);

interface UpstreamRow {
  pid: string;
  pref: string;
  cid: string;
  city: string;
  citykana: string;
  lat: string;
  lng: string;
  url: string;
  phrase: string;
  lgcode: string;
}

interface LocalCityRow {
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

interface DiffResult {
  upstreamOnly: Array<{ code5: string; name: string; pref: string }>;
  localOnly: Array<{ code5: string; name: string; type: string }>;
}

async function fetchUpstreamCsv(): Promise<Map<string, UpstreamRow>> {
  const res = await fetch(UPSTREAM_CSV_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch upstream CSV: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  const rows = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as UpstreamRow[];

  // lgcode(6桁) の先頭5桁をキーとして使用（末尾チェックディジットを除く）
  const map = new Map<string, UpstreamRow>();
  for (const row of rows) {
    if (row.lgcode && row.lgcode.length >= 5) {
      const code5 = row.lgcode.slice(0, 5);
      if (!SPECIAL_WARD_CODES.has(code5) && !KNOWN_UPSTREAM_ONLY_CODES.has(code5)) {
        map.set(code5, row);
      }
    }
  }
  return map;
}

function loadLocalCities(): Map<string, LocalCityRow> {
  const content = readFileSync(LOCAL_CITIES_CSV, "utf-8");
  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as LocalCityRow[];

  // code(5桁) をキーとして使用
  // special_ward と既知の差異（北方領土）は比較対象外
  const map = new Map<string, LocalCityRow>();
  for (const row of rows) {
    if (row.type !== "special_ward" && !KNOWN_LOCAL_ONLY_CODES.has(row.code)) {
      map.set(row.code, row);
    }
  }
  return map;
}

function detectDiff(
  upstream: Map<string, UpstreamRow>,
  local: Map<string, LocalCityRow>,
): DiffResult {
  const upstreamOnly: DiffResult["upstreamOnly"] = [];
  const localOnly: DiffResult["localOnly"] = [];

  for (const [code5, row] of upstream) {
    if (!local.has(code5)) {
      upstreamOnly.push({ code5, name: row.city, pref: row.pref });
    }
  }

  for (const [code5, row] of local) {
    if (!upstream.has(code5)) {
      localOnly.push({ code5, name: row.ja, type: row.type });
    }
  }

  return { upstreamOnly, localOnly };
}

function buildReport(diff: DiffResult, upstreamCount: number, localCount: number): string {
  const lines: string[] = [];
  const totalChanges = diff.upstreamOnly.length + diff.localOnly.length;

  lines.push("## データ変更検知レポート");
  lines.push("");
  lines.push(`- **比較ソース**: ${UPSTREAM_CSV_URL}`);
  lines.push(`- **ローカル件数** (special_ward・北方領土を除く): ${localCount}`);
  lines.push(`- **upstream 件数** (東京23区を除く): ${upstreamCount}`);
  lines.push(
    `- **差異件数**: upstream のみ ${diff.upstreamOnly.length} 件 / ローカルのみ ${diff.localOnly.length} 件`,
  );
  lines.push("");

  if (totalChanges === 0) {
    lines.push("差異は検知されませんでした。");
    return lines.join("\n");
  }

  if (diff.upstreamOnly.length > 0) {
    lines.push("### upstream にのみ存在（新設の可能性）");
    lines.push("");
    lines.push("| code(5桁) | 名称 | 都道府県 |");
    lines.push("|-----------|------|----------|");
    for (const entry of diff.upstreamOnly) {
      lines.push(`| \`${entry.code5}\` | ${entry.name} | ${entry.pref} |`);
    }
    lines.push("");
  }

  if (diff.localOnly.length > 0) {
    lines.push("### ローカルにのみ存在（廃止の可能性）");
    lines.push("");
    lines.push("| code(5桁) | 名称 | 種別 |");
    lines.push("|-----------|------|------|");
    for (const entry of diff.localOnly) {
      lines.push(`| \`${entry.code5}\` | ${entry.name} | ${entry.type} |`);
    }
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(
    "> **次のアクション**: 総務省の公式ページ <https://www.soumu.go.jp/denshijiti/code.html> で",
  );
  lines.push("> 変更内容を確認し、必要に応じて `data-source/cities.csv` を更新してください。");
  lines.push("> upstream ソース (localgovjp) が古い場合も差異として報告されます。");

  return lines.join("\n");
}

async function main(): Promise<void> {
  console.log("Fetching upstream CSV...");
  const upstream = await fetchUpstreamCsv();
  console.log(`Upstream (excl. Tokyo special wards): ${upstream.size} entries`);

  console.log("Loading local cities CSV...");
  const local = loadLocalCities();
  console.log(`Local (excl. special_ward, Hopporyodo): ${local.size} entries`);

  const diff = detectDiff(upstream, local);
  const report = buildReport(diff, upstream.size, local.size);

  console.log(`\n${report}`);

  const totalChanges = diff.upstreamOnly.length + diff.localOnly.length;
  if (totalChanges > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(2);
});
