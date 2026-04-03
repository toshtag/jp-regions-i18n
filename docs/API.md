# API Reference

[English](#english) | [日本語](#japanese)

---

## English

### Prefectures

#### `getPrefectures(lang?): Prefecture[]`

Returns all 47 prefectures.

```typescript
getPrefectures();        // Japanese (default)
getPrefectures("en");    // English
getPrefectures("zh-CN"); // Simplified Chinese
```

#### `getPrefectureByCode(code, lang?): Prefecture | undefined`

Lookup by JIS X 0401 code (2-digit string).

```typescript
getPrefectureByCode("13");        // 東京都
getPrefectureByCode("13", "ko");  // 도쿄도
```

#### `getPrefectureByISO(iso, lang?): Prefecture | undefined`

Lookup by ISO 3166-2:JP code.

```typescript
getPrefectureByISO("JP-13");       // 東京都
getPrefectureByISO("JP-27", "en"); // Osaka
```

#### `getPrefectureByLGCode(lgCode, lang?): Prefecture | undefined`

Lookup by 6-digit local government code (全国地方公共団体コード).

```typescript
getPrefectureByLGCode("130001");        // 東京都
getPrefectureByLGCode("130001", "en");  // Tokyo
```

#### `getPrefecturesAllLangs(): PrefectureAllLangs[]`

Returns all 47 prefectures with names in all 7 languages simultaneously.

```typescript
const prefs = getPrefecturesAllLangs();
prefs[0].name["ja"]; // "北海道"
prefs[0].name["en"]; // "Hokkaido"
```

#### `getPrefectureByCodeAllLangs(code): PrefectureAllLangs | undefined`

Lookup by JIS X 0401 code, with all language names included.

```typescript
const tokyo = getPrefectureByCodeAllLangs("13");
tokyo?.name["ja"]; // "東京都"
tokyo?.name["en"]; // "Tokyo"
tokyo?.name["ko"]; // "도쿄도"
```

#### `getPrefectureByISOAllLangs(iso): PrefectureAllLangs | undefined`

Lookup by ISO 3166-2:JP code, with all language names included.

```typescript
getPrefectureByISOAllLangs("JP-13");
```

#### `getPrefectureByLGCodeAllLangs(lgCode): PrefectureAllLangs | undefined`

Lookup by 6-digit local government code, with all language names included.

```typescript
getPrefectureByLGCodeAllLangs("130001");
```

---

### Cities

#### `getCities(prefCode, lang?, options?): City[]`

Returns cities for a given prefecture code. Supports filtering by `type` and `parentJisCode`.

```typescript
// All cities in Osaka
getCities("27", "en");

// Only designated cities
getCities("27", "en", { type: "designated_city" });

// Wards of Osaka City (parentJisCode: "27100")
getCities("27", "en", { parentJisCode: "27100" });
```

#### `getCityByJisCode(jisCode, lang?): City | undefined`

Lookup by JIS X 0402 municipal code (5-digit string).

```typescript
getCityByJisCode("13101");        // 千代田区
getCityByJisCode("13101", "en");  // Chiyoda-ku
```

#### `getCityByLGCode(lgCode, lang?): City | undefined`

Lookup by 6-digit local government code (with check digit).

```typescript
getCityByLGCode("131016");        // 千代田区
getCityByLGCode("131016", "en");  // Chiyoda-ku
```

#### `getCitiesAllLangs(prefCode, options?): CityAllLangs[]`

Returns cities for a given prefecture with names in all 7 languages. Supports the same filtering options as `getCities`.

```typescript
const cities = getCitiesAllLangs("13");
cities[0].name["ja"]; // "千代田区"
cities[0].name["en"]; // "Chiyoda-ku"

// With filter
getCitiesAllLangs("27", { type: "designated_city" });
```

#### `getCityByJisCodeAllLangs(jisCode): CityAllLangs | undefined`

Lookup by JIS X 0402 municipal code, with all language names included.

```typescript
const chiyoda = getCityByJisCodeAllLangs("13101");
chiyoda?.name["ja"]; // "千代田区"
chiyoda?.name["en"]; // "Chiyoda-ku"
```

#### `getCityByLGCodeAllLangs(lgCode): CityAllLangs | undefined`

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
// ["ja", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"]
```

---

### Types

```typescript
type Lang = "ja" | "en" | "zh-CN" | "zh-TW" | "ko" | "pt" | "vi";

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
  name: Record<Lang, string>; // All 7 languages
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
  name: Record<Lang, string>; // All 7 languages
}

interface GetCitiesOptions {
  type?: CityType;
  parentJisCode?: string;
}
```

---

### Language Aliases

The `lang` parameter accepts aliases for convenience:

| Alias | Resolves to |
|-------|-------------|
| `zh-Hans` | `zh-CN` |
| `zh-Hant` | `zh-TW` |
| `zh` | `zh-CN` |
| `cn` | `zh-CN` |
| `tw` | `zh-TW` |

Unsupported or omitted language codes fall back to `ja`.

---

## 日本語

### 都道府県

#### `getPrefectures(lang?): Prefecture[]`

全47都道府県を返します。

```typescript
getPrefectures();        // 日本語（デフォルト）
getPrefectures("en");    // 英語
getPrefectures("zh-CN"); // 簡体字中国語
```

#### `getPrefectureByCode(code, lang?): Prefecture | undefined`

JIS X 0401コード（2桁文字列）で検索。

```typescript
getPrefectureByCode("13");        // 東京都
getPrefectureByCode("13", "ko");  // 도쿄도
```

#### `getPrefectureByISO(iso, lang?): Prefecture | undefined`

ISO 3166-2:JP コードで検索。

```typescript
getPrefectureByISO("JP-13");       // 東京都
getPrefectureByISO("JP-27", "en"); // Osaka
```

#### `getPrefectureByLGCode(lgCode, lang?): Prefecture | undefined`

6桁の全国地方公共団体コードで検索。

```typescript
getPrefectureByLGCode("130001");        // 東京都
getPrefectureByLGCode("130001", "en");  // Tokyo
```

#### `getPrefecturesAllLangs(): PrefectureAllLangs[]`

全47都道府県を、7言語すべての名前付きで返します。

```typescript
const prefs = getPrefecturesAllLangs();
prefs[0].name["ja"]; // "北海道"
prefs[0].name["en"]; // "Hokkaido"
```

#### `getPrefectureByCodeAllLangs(code): PrefectureAllLangs | undefined`

JIS X 0401コードで検索し、全言語の名前を含む結果を返します。

```typescript
const tokyo = getPrefectureByCodeAllLangs("13");
tokyo?.name["ja"]; // "東京都"
tokyo?.name["en"]; // "Tokyo"
tokyo?.name["ko"]; // "도쿄도"
```

#### `getPrefectureByISOAllLangs(iso): PrefectureAllLangs | undefined`

ISO 3166-2:JP コードで検索し、全言語の名前を含む結果を返します。

```typescript
getPrefectureByISOAllLangs("JP-13");
```

#### `getPrefectureByLGCodeAllLangs(lgCode): PrefectureAllLangs | undefined`

6桁の全国地方公共団体コードで検索し、全言語の名前を含む結果を返します。

```typescript
getPrefectureByLGCodeAllLangs("130001");
```

---

### 市区町村

#### `getCities(prefCode, lang?, options?): City[]`

指定した都道府県コードの市区町村を返します。`type` と `parentJisCode` でフィルタリング可能。

```typescript
// 大阪府の全市区町村
getCities("27", "en");

// 政令指定都市のみ
getCities("27", "en", { type: "designated_city" });

// 大阪市の区（parentJisCode: "27100"）
getCities("27", "en", { parentJisCode: "27100" });
```

#### `getCityByJisCode(jisCode, lang?): City | undefined`

JIS X 0402 市区町村コード（5桁文字列）で検索。

```typescript
getCityByJisCode("13101");        // 千代田区
getCityByJisCode("13101", "en");  // Chiyoda-ku
```

#### `getCityByLGCode(lgCode, lang?): City | undefined`

6桁の地方公共団体コード（チェックディジット付き）で検索。

```typescript
getCityByLGCode("131016");        // 千代田区
getCityByLGCode("131016", "en");  // Chiyoda-ku
```

#### `getCitiesAllLangs(prefCode, options?): CityAllLangs[]`

指定した都道府県コードの市区町村を、7言語すべての名前付きで返します。`getCities` と同じフィルタリングオプションをサポート。

```typescript
const cities = getCitiesAllLangs("13");
cities[0].name["ja"]; // "千代田区"
cities[0].name["en"]; // "Chiyoda-ku"

// フィルタリング
getCitiesAllLangs("27", { type: "designated_city" });
```

#### `getCityByJisCodeAllLangs(jisCode): CityAllLangs | undefined`

JIS X 0402 市区町村コードで検索し、全言語の名前を含む結果を返します。

```typescript
const chiyoda = getCityByJisCodeAllLangs("13101");
chiyoda?.name["ja"]; // "千代田区"
chiyoda?.name["en"]; // "Chiyoda-ku"
```

#### `getCityByLGCodeAllLangs(lgCode): CityAllLangs | undefined`

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
// ["ja", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"]
```

---

### 型定義

```typescript
type Lang = "ja" | "en" | "zh-CN" | "zh-TW" | "ko" | "pt" | "vi";

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
  name: Record<Lang, string>; // 全7言語
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
  name: Record<Lang, string>; // 全7言語
}

interface GetCitiesOptions {
  type?: CityType;
  parentJisCode?: string;
}
```

---

### 言語エイリアス

`lang` パラメータには以下のエイリアスが使えます:

| エイリアス | 解決先 |
|-----------|--------|
| `zh-Hans` | `zh-CN` |
| `zh-Hant` | `zh-TW` |
| `zh` | `zh-CN` |
| `cn` | `zh-CN` |
| `tw` | `zh-TW` |

未対応または省略した言語コードは `ja` にフォールバックします。
