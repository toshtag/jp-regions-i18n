# API Reference

[English](#english) | [日本語](#japanese)

---

## English

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
| `pt` / `vi` | (none) | -shi, -ku, -machi, -cho, -son, -mura |

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
| `en` | （なし — 元々サフィックスなし） | -shi, -ku, -machi, -cho, -son, -mura |
| `pt` / `vi` | （なし） | -shi, -ku, -machi, -cho, -son, -mura |

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
