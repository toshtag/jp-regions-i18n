// ひらがな → 修正ヘボン式（マクロン付き）変換
// 用途: en エントリポイントの { macrons: true } オプション専用

const TABLE_2: Readonly<Record<string, string>> = {
  // 現代仮名遣い
  きゃ: "kya",
  きゅ: "kyu",
  きょ: "kyo",
  しゃ: "sha",
  しゅ: "shu",
  しょ: "sho",
  ちゃ: "cha",
  ちゅ: "chu",
  ちょ: "cho",
  にゃ: "nya",
  にゅ: "nyu",
  にょ: "nyo",
  ひゃ: "hya",
  ひゅ: "hyu",
  ひょ: "hyo",
  みゃ: "mya",
  みゅ: "myu",
  みょ: "myo",
  りゃ: "rya",
  りゅ: "ryu",
  りょ: "ryo",
  ぎゃ: "gya",
  ぎゅ: "gyu",
  ぎょ: "gyo",
  じゃ: "ja",
  じゅ: "ju",
  じょ: "jo",
  びゃ: "bya",
  びゅ: "byu",
  びょ: "byo",
  ぴゃ: "pya",
  ぴゅ: "pyu",
  ぴょ: "pyo",
  ぢゃ: "ja",
  ぢゅ: "ju",
  ぢょ: "jo",
};

const TABLE_1: Readonly<Record<string, string>> = {
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ひ: "hi",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  ゐ: "i",
  ゑ: "e",
  を: "o",
  ん: "n",
  が: "ga",
  ぎ: "gi",
  ぐ: "gu",
  げ: "ge",
  ご: "go",
  ざ: "za",
  じ: "ji",
  ず: "zu",
  ぜ: "ze",
  ぞ: "zo",
  だ: "da",
  ぢ: "ji",
  づ: "zu",
  で: "de",
  ど: "do",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ぼ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぷ: "pu",
  ぺ: "pe",
  ぽ: "po",
};

const N_VOWELS = new Set("あいうえおやゆよ");

/**
 * ひらがな文字列を修正ヘボン式ローマ字（マクロン付き）に変換する。
 * 長音: おう/おお → ō、うう → ū
 * 促音(っ): 後続子音を重ねる
 * ん: 母音・や行の前では n' を挿入
 */
export function hiraToHepburn(hira: string): string {
  const parts: string[] = [];
  let prevRow: "o" | "u" | null = null;
  let i = 0;

  while (i < hira.length) {
    const ch = hira[i];

    // 促音 っ → 後続子音を重ねる
    if (ch === "っ") {
      i++;
      if (i < hira.length) {
        const next2 = i + 1 < hira.length ? TABLE_2[hira.slice(i, i + 2)] : undefined;
        const next1 = TABLE_1[hira[i]];
        const rom = next2 ?? next1 ?? "";
        if (rom) parts.push(rom[0]);
      }
      prevRow = null;
      continue;
    }

    // ん → n (母音・や行の前では n')
    if (ch === "ん") {
      const nextCh = i + 1 < hira.length ? hira[i + 1] : "";
      parts.push(nextCh && N_VOWELS.has(nextCh) ? "n'" : "n");
      prevRow = null;
      i++;
      continue;
    }

    // 長音延長: o段 + う/お → 直前の o をマクロン付きに
    if (prevRow === "o" && (ch === "う" || ch === "お")) {
      const last = parts[parts.length - 1];
      if (last && last[last.length - 1] === "o") {
        parts[parts.length - 1] = `${last.slice(0, -1)}ō`;
      } else {
        parts.push("ō");
      }
      prevRow = null; // 一度長音確定したら連続延長しない
      i++;
      continue;
    }

    // 長音延長: u段 + う → 直前の u をマクロン付きに
    if (prevRow === "u" && ch === "う") {
      const last = parts[parts.length - 1];
      if (last && last[last.length - 1] === "u") {
        parts[parts.length - 1] = `${last.slice(0, -1)}ū`;
      } else {
        parts.push("ū");
      }
      prevRow = null;
      i++;
      continue;
    }

    // 2文字複合
    if (i + 1 < hira.length) {
      const rom2 = TABLE_2[hira.slice(i, i + 2)];
      if (rom2) {
        parts.push(rom2);
        const last = rom2[rom2.length - 1];
        prevRow = last === "o" ? "o" : last === "u" ? "u" : null;
        i += 2;
        continue;
      }
    }

    // 1文字
    const rom1 = TABLE_1[ch];
    if (rom1) {
      parts.push(rom1);
      const last = rom1[rom1.length - 1];
      prevRow = last === "o" ? "o" : last === "u" ? "u" : null;
      i++;
      continue;
    }

    // 未知文字（ハイフン等）はそのまま
    parts.push(ch);
    prevRow = null;
    i++;
  }

  return parts.join("");
}

// 都市サフィックス: ひらがな末尾 → ローマ字サフィックス (ハイフン付き)
// 長い順に並べてグリーディマッチ
const CITY_SUFFIX_MAP: ReadonlyArray<[string, string]> = [
  ["ちょう", "-cho"],
  ["まち", "-machi"],
  ["むら", "-mura"],
  ["そん", "-son"],
  ["し", "-shi"],
  ["く", "-ku"],
];

// 都道府県サフィックス (ひらがな末尾 → 除去)
// 注: 北海道の「どう」は地名の一部なので含めない
const PREF_SUFFIX_HIRA: ReadonlyArray<string> = ["けん", "ふ", "と"];

/**
 * ひらがなから修正ヘボン式に変換し、都市サフィックスをハイフン付きで付与する。
 * en 名（既存）を参照してサフィックスの形式（-cho/-machi 等）を決定する。
 *
 * @param hira ひらがな（例: "いいだし"）
 * @param enName 既存の en 名（例: "Iida-shi"）。サフィックス判定に使用。
 */
export function hiraToHepburnCity(hira: string, enName: string): string {
  // en名にハイフンがある場合はサフィックスを流用
  const hyphenIdx = enName.lastIndexOf("-");
  if (hyphenIdx !== -1) {
    const enSuffix = enName.slice(hyphenIdx); // "-shi" / "-ku" 等
    // ひらがなからサフィックス分を除去
    let hiraBody = hira;
    for (const [hiraSuf] of CITY_SUFFIX_MAP) {
      if (hira.endsWith(hiraSuf)) {
        hiraBody = hira.slice(0, -hiraSuf.length);
        break;
      }
    }
    const body = hiraToHepburn(hiraBody);
    const cap = body ? body[0].toUpperCase() + body.slice(1) : body;
    return cap + enSuffix;
  }

  // ハイフンなし（既存 en 名がサフィックスなし）: 全体変換して先頭大文字
  const rom = hiraToHepburn(hira);
  return rom ? rom[0].toUpperCase() + rom.slice(1) : rom;
}

/**
 * ひらがなから修正ヘボン式に変換し、都道府県サフィックス（県/府/都/道）を除去する。
 * 既存の en 名はサフィックスなし（"Tokyo", "Osaka"）なので、ひらがなからも除去する。
 */
export function hiraToHepburnPref(hira: string): string {
  let hiraBody = hira;
  for (const suf of PREF_SUFFIX_HIRA) {
    if (hira.endsWith(suf)) {
      hiraBody = hira.slice(0, -suf.length);
      break;
    }
  }
  const rom = hiraToHepburn(hiraBody);
  return rom ? rom[0].toUpperCase() + rom.slice(1) : rom;
}
