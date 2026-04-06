# API Reference

[English](#english) | [日本語](#japanese)

---

## English

### Language-specific Subpath Imports

For a smaller bundle, import from a language-specific subpath instead of the main entry point:

```typescript
import { getPrefectures, getCities } from "jp-regions-i18n/en";
import { getPrefectures, getCities } from "jp-regions-i18n/ja";
// also: /zh-CN  /zh-TW  /ko  /pt  /vi
```

| Subpath | Language | Bundle size (gzip) |
|---------|----------|-------------------|
| `jp-regions-i18n` | All 7 languages | ~84 KB |
| `/ja` | Japanese | ~30 KB |
| `/en` | English | ~17 KB |
| `/zh-CN` | Simplified Chinese | ~18 KB |
| `/zh-TW` | Traditional Chinese | ~18 KB |
| `/ko` | Korean | ~18 KB |
| `/pt` | Portuguese | ~16 KB |
| `/vi` | Vietnamese | ~18 KB |

**Differences from the main entry point:**
- The `lang` argument is omitted from all functions (language is fixed by the subpath)
- `AllLangs` variants (`getPrefecturesAllLangs`, `getCitiesAllLangs`, etc.) are not available

```typescript
// main entry — lang argument required for non-default languages
import { getPrefectures } from "jp-regions-i18n";
getPrefectures("en");

// subpath — no lang argument
import { getPrefectures } from "jp-regions-i18n/en";
getPrefectures();
```

---

### Prefectures

#### `getPrefectures(lang?, options?): Prefecture[]`

Returns all 47 prefectures.

```typescript
getPrefectures();                      // Japanese (default)
getPrefectures("en");                  // English
getPrefectures("zh-CN");               // Simplified Chinese
getPrefectures("ja", { short: true }); // "東京", "大阪" (suffix stripped)
```

#### `getPrefectureByCode(code, lang?, options?): Prefecture | undefined`

Lookup by JIS X 0401 code (2-digit string).

```typescript
getPrefectureByCode("13");                        // 東京都
getPrefectureByCode("13", "ko");                  // 도쿄도
getPrefectureByCode("13", "ja", { short: true }); // 東京
```

#### `getPrefectureByISO(iso, lang?, options?): Prefecture | undefined`

Lookup by ISO 3166-2:JP code.

```typescript
getPrefectureByISO("JP-13");       // 東京都
getPrefectureByISO("JP-27", "en"); // Osaka
```

#### `getPrefectureByLGCode(lgCode, lang?, options?): Prefecture | undefined`

Lookup by 6-digit local government code (全国地方公共団体コード).

```typescript
getPrefectureByLGCode("130001");        // 東京都
getPrefectureByLGCode("130001", "en");  // Tokyo
```

#### `getPrefecturesAllLangs(options?): PrefectureAllLangs[]`

Returns all 47 prefectures with names in all 10 languages simultaneously.

```typescript
const prefs = getPrefecturesAllLangs();
prefs[0].name["ja"];       // "北海道"
prefs[0].name["ja-Hira"];  // "ほっかいどう"
prefs[0].name["en"];       // "Hokkaido"

// With short option — strips suffixes across all languages at once
const short = getPrefecturesAllLangs({ short: true });
short[12].name["ja"];      // "東京"
short[12].name["ja-Hira"]; // "とうきょう"
short[12].name["ko"];      // "도쿄"
```

#### `getPrefectureByCodeAllLangs(code, options?): PrefectureAllLangs | undefined`

Lookup by JIS X 0401 code, with all language names included.

```typescript
const tokyo = getPrefectureByCodeAllLangs("13");
tokyo?.name["ja"]; // "東京都"
tokyo?.name["en"]; // "Tokyo"
tokyo?.name["ko"]; // "도쿄도"
```

#### `getPrefectureByISOAllLangs(iso, options?): PrefectureAllLangs | undefined`

Lookup by ISO 3166-2:JP code, with all language names included.

```typescript
getPrefectureByISOAllLangs("JP-13");
```

#### `getPrefectureByLGCodeAllLangs(lgCode, options?): PrefectureAllLangs | undefined`

Lookup by 6-digit local government code, with all language names included.

```typescript
getPrefectureByLGCodeAllLangs("130001");
```

#### `getPrefectureByName(name, lang?, options?): Prefecture | undefined`

Lookup by name in **any** of the 10 supported languages. Matching is case-insensitive and supports both full and short forms.

```typescript
getPrefectureByName("東京都");           // matches full Japanese name
getPrefectureByName("東京");             // matches short form (no suffix)
getPrefectureByName("Tokyo");           // matches English name
getPrefectureByName("tokyo");           // case-insensitive
getPrefectureByName("とうきょうと");     // matches hiragana
getPrefectureByName("도쿄도");           // matches Korean name

// Control output language separately from the search term
getPrefectureByName("Tokyo", "ja");     // { name: "東京都", ... }
getPrefectureByName("東京都", "en");    // { name: "Tokyo", ... }
getPrefectureByName("東京都", "ja", { short: true }); // { name: "東京", ... }
```

#### `getPrefectureByNameAllLangs(name, options?): PrefectureAllLangs | undefined`

Lookup by name in any language, returning all 10 language names.

```typescript
const tokyo = getPrefectureByNameAllLangs("Tokyo");
tokyo?.name["ja"]; // "東京都"
tokyo?.name["en"]; // "Tokyo"
tokyo?.name["ko"]; // "도쿄도"
```

---

### Cities

#### `getCities(prefCode, lang?, options?): City[]`

Returns cities for a given prefecture code. Supports filtering by `type` and `parentJisCode`, and suffix stripping via `short`.

```typescript
// All cities in Osaka
getCities("27", "en");

// Only designated cities
getCities("27", "en", { type: "designated_city" });

// Wards of Osaka City (parentJisCode: "27100")
getCities("27", "en", { parentJisCode: "27100" });

// Strip suffixes: "千代田区" → "千代田", "Chiyoda-ku" → "Chiyoda"
getCities("13", "ja", { short: true });
getCities("13", "en", { short: true });
```

#### `getCityByJisCode(jisCode, lang?, options?): City | undefined`

Lookup by JIS X 0402 municipal code (5-digit string).

```typescript
getCityByJisCode("13101");                        // 千代田区
getCityByJisCode("13101", "en");                  // Chiyoda-ku
getCityByJisCode("13101", "en", { short: true }); // Chiyoda
```

#### `getCityByLGCode(lgCode, lang?, options?): City | undefined`

Lookup by 6-digit local government code (with check digit).

```typescript
getCityByLGCode("131016");        // 千代田区
getCityByLGCode("131016", "en");  // Chiyoda-ku
```

#### `getCitiesAllLangs(prefCode, options?): CityAllLangs[]`

Returns cities for a given prefecture with names in all 10 languages. Supports the same filtering options as `getCities`.

```typescript
const cities = getCitiesAllLangs("13");
cities[0].name["ja"]; // "千代田区"
cities[0].name["en"]; // "Chiyoda-ku"

// With filter
getCitiesAllLangs("27", { type: "designated_city" });

// Strip suffixes across all languages
getCitiesAllLangs("13", { short: true });
```

#### `getCityByJisCodeAllLangs(jisCode, options?): CityAllLangs | undefined`

Lookup by JIS X 0402 municipal code, with all language names included.

```typescript
const chiyoda = getCityByJisCodeAllLangs("13101");
chiyoda?.name["ja"]; // "千代田区"
chiyoda?.name["en"]; // "Chiyoda-ku"
```

#### `getCityByLGCodeAllLangs(lgCode, options?): CityAllLangs | undefined`

Lookup by 6-digit local government code, with all language names included.

```typescript
getCityByLGCodeAllLangs("131016");
```

#### `getCitiesByPrefName(prefName, lang?, options?): City[]`

Returns cities for a prefecture identified by name in **any** of the 10 supported languages. Accepts the same options as `getCities`.

```typescript
// No need to know the prefecture code
getCitiesByPrefName("東京都", "en");
getCitiesByPrefName("東京", "en");          // short form works too
getCitiesByPrefName("Tokyo", "ja");         // English input, Japanese output
getCitiesByPrefName("tokyo", "en");         // case-insensitive

// Filtering works just like getCities
getCitiesByPrefName("東京", "ja", { type: "special_ward" });
```

Returns `[]` if the prefecture name is not found.

#### `getCitiesAllLangsByPrefName(prefName, options?): CityAllLangs[]`

Returns cities for a prefecture identified by name, with all 10 language names included. Accepts the same options as `getCitiesAllLangs`.

```typescript
const cities = getCitiesAllLangsByPrefName("Tokyo");
cities[0].name["ja"]; // "千代田区"
cities[0].name["en"]; // "Chiyoda-ku"

// With filter
getCitiesAllLangsByPrefName("大阪", { type: "designated_city" });
```

---

### Utilities

#### `getSupportedLanguages(): readonly Lang[]`

Returns the list of supported language codes.

```typescript
getSupportedLanguages();
// ["ja", "ja-Hira", "ja-Kana", "ja-HW", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"]
```

---

### Types

```typescript
type Lang =
  | "ja"      // Japanese (kanji + kana)
  | "ja-Hira" // Japanese hiragana
  | "ja-Kana" // Japanese katakana
  | "ja-HW"   // Japanese half-width katakana
  | "en"
  | "zh-CN"
  | "zh-TW"
  | "ko"
  | "pt"
  | "vi";

type CityType =
  | "city"            // 市
  | "designated_city" // 政令指定都市
  | "ward"            // 区（政令指定都市の区）
  | "special_ward"    // 特別区（東京23区）
  | "town"            // 町
  | "village";        // 村

interface Prefecture {
  code: string;       // JIS X 0401 (e.g. "13")
  iso: string;        // ISO 3166-2:JP (e.g. "JP-13")
  lgCode: string;     // 全国地方公共団体コード 6-digit (e.g. "130001")
  name: string;       // Localized name
}

interface PrefectureAllLangs {
  code: string;
  iso: string;
  lgCode: string;
  name: Record<Lang, string>; // All 10 languages
}

interface City {
  jisCode: string;              // JIS X 0402 5-digit (e.g. "13101")
  prefCode: string;             // Prefecture code (e.g. "13")
  lgCode: string;               // 6-digit with check digit (e.g. "131016")
  parentJisCode: string | null; // Parent designated city jisCode, or null
  type: CityType;
  name: string;                 // Localized name
}

interface CityAllLangs {
  jisCode: string;
  prefCode: string;
  lgCode: string;
  parentJisCode: string | null;
  type: CityType;
  name: Record<Lang, string>; // All 10 languages
}

interface GetPrefecturesOptions {
  short?: boolean; // Strip administrative suffix from name (e.g. "東京都" → "東京")
}

interface GetCitiesOptions {
  type?: CityType;
  parentJisCode?: string;
  short?: boolean; // Strip administrative suffix from name (e.g. "千代田区" → "千代田")
}
```

---

### `short` option

The `short: true` option strips the administrative suffix from the name field. It is supported by all prefecture and city functions, including `AllLangs` variants.

Suffixes stripped by language:

| Language | Prefecture suffixes | City suffixes |
|----------|--------------------|-----------------------------|
| `ja` | 都, 道, 府, 県 | 市, 区, 町, 村 |
| `ja-Hira` | と, どう, ふ, けん | し, く, まち, ちょう, むら, そん |
| `ja-Kana` | ト, ドウ, フ, ケン | シ, ク, マチ, チョウ, ムラ, ソン |
| `ja-HW` | ﾄ, ﾄﾞｳ, ﾌ, ｹﾝ | ｼ, ｸ, ﾏﾁ, ﾁｮｳ, ﾑﾗ, ｿﾝ |
| `zh-CN` | 都, 道, 府, 县 | 市, 区, 町, 村 |
| `zh-TW` | 都, 道, 府, 縣 | 市, 區, 町, 村 |
| `ko` | 도, 부, 현 | 시, 구, 정, 촌 |
| `en` | (none — already suffix-free) | -shi, -ku, -machi, -cho, -son, -mura |
| `pt` | (none — already suffix-free) | -xi, -cu, -maxi, -xo, -son, -mura |
| `vi` | tỉnh, phủ, đô, đạo | thị, khu, đinh, thôn |

Prefecture and city functions are independent, so `short` can be applied selectively:

```typescript
// Prefecture without suffix, city with suffix
getPrefectureByCode("13", "ja", { short: true }); // "東京"
getCities("13", "ja");                             // "千代田区", "新宿区", ...

// Both without suffix
getPrefectures("ja", { short: true });
getCities("13", "ja", { short: true });
```

---

### Language Aliases

The `lang` parameter accepts aliases for convenience:

| Alias | Resolves to |
|-------|-------------|
| `hira` | `ja-Hira` |
| `hiragana` | `ja-Hira` |
| `kana` | `ja-Kana` |
| `katakana` | `ja-Kana` |
| `hw` | `ja-HW` |
| `zh-Hans` | `zh-CN` |
| `zh-Hant` | `zh-TW` |
| `zh` | `zh-CN` |
| `cn` | `zh-CN` |
| `tw` | `zh-TW` |

Unsupported or omitted language codes fall back to `ja`.

---

## 日本語

### 言語別サブパスインポート

バンドルサイズを小さくするため、メインエントリポイントの代わりに言語別サブパスからインポートできます：

```typescript
import { getPrefectures, getCities } from "jp-regions-i18n/ja";
import { getPrefectures, getCities } from "jp-regions-i18n/en";
// 他: /zh-CN  /zh-TW  /ko  /pt  /vi
```

| サブパス | 言語 | バンドルサイズ（gzip） |
|---------|------|--------------------|
| `jp-regions-i18n` | 全7言語 | 約84 KB |
| `/ja` | 日本語 | 約30 KB |
| `/en` | 英語 | 約17 KB |
| `/zh-CN` | 簡体字中国語 | 約18 KB |
| `/zh-TW` | 繁体字中国語 | 約18 KB |
| `/ko` | 韓国語 | 約18 KB |
| `/pt` | ポルトガル語 | 約16 KB |
| `/vi` | ベトナム語 | 約18 KB |

**メインエントリポイントとの違い：**
- すべての関数から `lang` 引数が省略されます（言語はサブパスで固定）
- `AllLangs` 系関数（`getPrefecturesAllLangs`、`getCitiesAllLangs` など）は含まれません

```typescript
// メインエントリ — デフォルト以外の言語にはlang引数が必要
import { getPrefectures } from "jp-regions-i18n";
getPrefectures("en");

// サブパス — lang引数不要
import { getPrefectures } from "jp-regions-i18n/en";
getPrefectures();
```

---

### 都道府県

#### `getPrefectures(lang?, options?): Prefecture[]`

全47都道府県を返します。

```typescript
getPrefectures();                      // 日本語（デフォルト）
getPrefectures("en");                  // 英語
getPrefectures("zh-CN");               // 簡体字中国語
getPrefectures("ja", { short: true }); // "東京", "大阪"（サフィックスなし）
```

#### `getPrefectureByCode(code, lang?, options?): Prefecture | undefined`

JIS X 0401コード（2桁文字列）で検索。

```typescript
getPrefectureByCode("13");                        // 東京都
getPrefectureByCode("13", "ko");                  // 도쿄도
getPrefectureByCode("13", "ja", { short: true }); // 東京
```

#### `getPrefectureByISO(iso, lang?, options?): Prefecture | undefined`

ISO 3166-2:JP コードで検索。

```typescript
getPrefectureByISO("JP-13");       // 東京都
getPrefectureByISO("JP-27", "en"); // Osaka
```

#### `getPrefectureByLGCode(lgCode, lang?, options?): Prefecture | undefined`

6桁の全国地方公共団体コードで検索。

```typescript
getPrefectureByLGCode("130001");        // 東京都
getPrefectureByLGCode("130001", "en");  // Tokyo
```

#### `getPrefecturesAllLangs(options?): PrefectureAllLangs[]`

全47都道府県を、10言語すべての名前付きで返します。

```typescript
const prefs = getPrefecturesAllLangs();
prefs[0].name["ja"];       // "北海道"
prefs[0].name["ja-Hira"];  // "ほっかいどう"
prefs[0].name["en"];       // "Hokkaido"

// short オプション — 全言語のサフィックスをまとめて除去
const short = getPrefecturesAllLangs({ short: true });
short[12].name["ja"];      // "東京"
short[12].name["ja-Hira"]; // "とうきょう"
short[12].name["ko"];      // "도쿄"
```

#### `getPrefectureByCodeAllLangs(code, options?): PrefectureAllLangs | undefined`

JIS X 0401コードで検索し、全言語の名前を含む結果を返します。

```typescript
const tokyo = getPrefectureByCodeAllLangs("13");
tokyo?.name["ja"]; // "東京都"
tokyo?.name["en"]; // "Tokyo"
tokyo?.name["ko"]; // "도쿄도"
```

#### `getPrefectureByISOAllLangs(iso, options?): PrefectureAllLangs | undefined`

ISO 3166-2:JP コードで検索し、全言語の名前を含む結果を返します。

```typescript
getPrefectureByISOAllLangs("JP-13");
```

#### `getPrefectureByLGCodeAllLangs(lgCode, options?): PrefectureAllLangs | undefined`

6桁の全国地方公共団体コードで検索し、全言語の名前を含む結果を返します。

```typescript
getPrefectureByLGCodeAllLangs("130001");
```

#### `getPrefectureByName(name, lang?, options?): Prefecture | undefined`

**10言語いずれかの名前**で都道府県を検索します。大文字小文字を無視し、フルネーム・短縮形の両方にマッチします。

```typescript
getPrefectureByName("東京都");           // 漢字フルネームでマッチ
getPrefectureByName("東京");             // 短縮形（サフィックスなし）でもマッチ
getPrefectureByName("Tokyo");           // 英語名でマッチ
getPrefectureByName("tokyo");           // 大文字小文字を無視
getPrefectureByName("とうきょうと");     // ひらがなでマッチ
getPrefectureByName("도쿄도");           // 韓国語名でマッチ

// 検索語と出力言語は独立して指定できます
getPrefectureByName("Tokyo", "ja");     // { name: "東京都", ... }
getPrefectureByName("東京都", "en");    // { name: "Tokyo", ... }
getPrefectureByName("東京都", "ja", { short: true }); // { name: "東京", ... }
```

#### `getPrefectureByNameAllLangs(name, options?): PrefectureAllLangs | undefined`

任意の言語の名前で検索し、全10言語の名前を含む結果を返します。

```typescript
const tokyo = getPrefectureByNameAllLangs("Tokyo");
tokyo?.name["ja"]; // "東京都"
tokyo?.name["en"]; // "Tokyo"
tokyo?.name["ko"]; // "도쿄도"
```

---

### 市区町村

#### `getCities(prefCode, lang?, options?): City[]`

指定した都道府県コードの市区町村を返します。`type` と `parentJisCode` でフィルタリング可能。`short` でサフィックスを除去できます。

```typescript
// 大阪府の全市区町村
getCities("27", "en");

// 政令指定都市のみ
getCities("27", "en", { type: "designated_city" });

// 大阪市の区（parentJisCode: "27100"）
getCities("27", "en", { parentJisCode: "27100" });

// サフィックスを除去: "千代田区" → "千代田", "Chiyoda-ku" → "Chiyoda"
getCities("13", "ja", { short: true });
getCities("13", "en", { short: true });
```

#### `getCityByJisCode(jisCode, lang?, options?): City | undefined`

JIS X 0402 市区町村コード（5桁文字列）で検索。

```typescript
getCityByJisCode("13101");                        // 千代田区
getCityByJisCode("13101", "en");                  // Chiyoda-ku
getCityByJisCode("13101", "en", { short: true }); // Chiyoda
```

#### `getCityByLGCode(lgCode, lang?, options?): City | undefined`

6桁の地方公共団体コード（チェックディジット付き）で検索。

```typescript
getCityByLGCode("131016");        // 千代田区
getCityByLGCode("131016", "en");  // Chiyoda-ku
```

#### `getCitiesAllLangs(prefCode, options?): CityAllLangs[]`

指定した都道府県コードの市区町村を、10言語すべての名前付きで返します。`getCities` と同じフィルタリングオプションをサポート。

```typescript
const cities = getCitiesAllLangs("13");
cities[0].name["ja"]; // "千代田区"
cities[0].name["en"]; // "Chiyoda-ku"

// フィルタリング
getCitiesAllLangs("27", { type: "designated_city" });

// 全言語のサフィックスをまとめて除去
getCitiesAllLangs("13", { short: true });
```

#### `getCityByJisCodeAllLangs(jisCode, options?): CityAllLangs | undefined`

JIS X 0402 市区町村コードで検索し、全言語の名前を含む結果を返します。

```typescript
const chiyoda = getCityByJisCodeAllLangs("13101");
chiyoda?.name["ja"]; // "千代田区"
chiyoda?.name["en"]; // "Chiyoda-ku"
```

#### `getCityByLGCodeAllLangs(lgCode, options?): CityAllLangs | undefined`

6桁の地方公共団体コードで検索し、全言語の名前を含む結果を返します。

```typescript
getCityByLGCodeAllLangs("131016");
```

#### `getCitiesByPrefName(prefName, lang?, options?): City[]`

**都道府県コードを調べる必要なく**、10言語いずれかの名前で市区町村一覧を取得します。`getCities` と同じオプションをサポートします。

```typescript
// コードを知らなくても使える
getCitiesByPrefName("東京都", "en");
getCitiesByPrefName("東京", "en");          // 短縮形でもOK
getCitiesByPrefName("Tokyo", "ja");         // 英語で検索、日本語で出力
getCitiesByPrefName("tokyo", "en");         // 大文字小文字を無視

// getCities と同様にフィルタリングも可能
getCitiesByPrefName("東京", "ja", { type: "special_ward" });
```

都道府県名が見つからない場合は `[]` を返します。

#### `getCitiesAllLangsByPrefName(prefName, options?): CityAllLangs[]`

名前で都道府県を指定し、全10言語の名前付き市区町村一覧を返します。`getCitiesAllLangs` と同じオプションをサポートします。

```typescript
const cities = getCitiesAllLangsByPrefName("Tokyo");
cities[0].name["ja"]; // "千代田区"
cities[0].name["en"]; // "Chiyoda-ku"

// フィルタリング
getCitiesAllLangsByPrefName("大阪", { type: "designated_city" });
```

---

### ユーティリティ

#### `getSupportedLanguages(): readonly Lang[]`

サポートされている言語コード一覧を返します。

```typescript
getSupportedLanguages();
// ["ja", "ja-Hira", "ja-Kana", "ja-HW", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"]
```

---

### 型定義

```typescript
type Lang =
  | "ja"      // 日本語（漢字・かな混じり）
  | "ja-Hira" // ひらがな
  | "ja-Kana" // カタカナ
  | "ja-HW"   // 半角カタカナ
  | "en"
  | "zh-CN"
  | "zh-TW"
  | "ko"
  | "pt"
  | "vi";

type CityType =
  | "city"            // 市
  | "designated_city" // 政令指定都市
  | "ward"            // 区（政令指定都市の区）
  | "special_ward"    // 特別区（東京23区）
  | "town"            // 町
  | "village";        // 村

interface Prefecture {
  code: string;       // JIS X 0401（例: "13"）
  iso: string;        // ISO 3166-2:JP（例: "JP-13"）
  lgCode: string;     // 全国地方公共団体コード 6桁（例: "130001"）
  name: string;       // ローカライズされた名前
}

interface PrefectureAllLangs {
  code: string;
  iso: string;
  lgCode: string;
  name: Record<Lang, string>; // 全10言語
}

interface City {
  jisCode: string;              // JIS X 0402 5桁（例: "13101"）
  prefCode: string;             // 都道府県コード（例: "13"）
  lgCode: string;               // 6桁チェックディジット付き（例: "131016"）
  parentJisCode: string | null; // 親の政令指定都市JISコード、またはnull
  type: CityType;
  name: string;                 // ローカライズされた名前
}

interface CityAllLangs {
  jisCode: string;
  prefCode: string;
  lgCode: string;
  parentJisCode: string | null;
  type: CityType;
  name: Record<Lang, string>; // 全10言語
}

interface GetPrefecturesOptions {
  short?: boolean; // サフィックスを除去（例: "東京都" → "東京"）
}

interface GetCitiesOptions {
  type?: CityType;
  parentJisCode?: string;
  short?: boolean; // サフィックスを除去（例: "千代田区" → "千代田"）
}
```

---

### `short` オプション

`short: true` を指定すると、`name` フィールドから行政区分サフィックスを除去します。都道府県・市区町村のすべての関数（`AllLangs` 系含む）でサポートされています。

除去されるサフィックス（言語別）：

| 言語 | 都道府県サフィックス | 市区町村サフィックス |
|------|--------------------|-----------------------------|
| `ja` | 都, 道, 府, 県 | 市, 区, 町, 村 |
| `ja-Hira` | と, どう, ふ, けん | し, く, まち, ちょう, むら, そん |
| `ja-Kana` | ト, ドウ, フ, ケン | シ, ク, マチ, チョウ, ムラ, ソン |
| `ja-HW` | ﾄ, ﾄﾞｳ, ﾌ, ｹﾝ | ｼ, ｸ, ﾏﾁ, ﾁｮｳ, ﾑﾗ, ｿﾝ |
| `zh-CN` | 都, 道, 府, 县 | 市, 区, 町, 村 |
| `zh-TW` | 都, 道, 府, 縣 | 市, 區, 町, 村 |
| `ko` | 도, 부, 현 | 시, 구, 정, 촌 |
| `en` | （なし） | -shi, -ku, -machi, -cho, -son, -mura |
| `pt` | （なし） | -xi, -cu, -maxi, -xo, -son, -mura |
| `vi` | tỉnh, phủ, đô, đạo | thị, khu, đinh, thôn |

都道府県と市区町村の関数は独立しているため、片方だけに `short` を適用することも可能です：

```typescript
// 都道府県はサフィックスなし、市区町村はあり
getPrefectureByCode("13", "ja", { short: true }); // "東京"
getCities("13", "ja");                             // "千代田区", "新宿区", ...

// 両方サフィックスなし
getPrefectures("ja", { short: true });
getCities("13", "ja", { short: true });
```

---

### 言語エイリアス

`lang` パラメータには以下のエイリアスが使えます:

| エイリアス | 解決先 |
|-----------|--------|
| `hira` | `ja-Hira` |
| `hiragana` | `ja-Hira` |
| `kana` | `ja-Kana` |
| `katakana` | `ja-Kana` |
| `hw` | `ja-HW` |
| `zh-Hans` | `zh-CN` |
| `zh-Hant` | `zh-TW` |
| `zh` | `zh-CN` |
| `cn` | `zh-CN` |
| `tw` | `zh-TW` |

未対応または省略した言語コードは `ja` にフォールバックします。
