# jp-regions-i18n

Zero-dependency multilingual Japanese prefectures and cities data.

47 prefectures and 1,917 municipalities across 7 languages: Japanese, English, Simplified Chinese, Traditional Chinese, Korean, Portuguese, and Vietnamese.

## Install

```bash
npm install jp-regions-i18n
# or
pnpm add jp-regions-i18n
```

## Quick Start

```typescript
import { getPrefectures, getCities } from "jp-regions-i18n";

// All prefectures in Japanese (default)
const prefs = getPrefectures();
// [{ code: "01", iso: "JP-01", name: "北海道" }, ...]

// All prefectures in English
const prefsEn = getPrefectures("en");
// [{ code: "01", iso: "JP-01", name: "Hokkaido" }, ...]

// Cities in Tokyo (code "13")
const cities = getCities("13", "en");
// [{ code: "13101", name: "Chiyoda", ... }, ...]
```

## API

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

### Cities

#### `getCities(prefCode, lang?, options?): City[]`

Returns cities for a given prefecture code. Supports filtering by `type` and `parentCode`.

```typescript
// All cities in Osaka
getCities("27", "en");

// Only designated cities
getCities("27", "en", { type: "designated_city" });

// Wards of Osaka City (parentCode: "27100")
getCities("27", "en", { parentCode: "27100" });
```

#### `getCityByCode(code, lang?): City | undefined`

Lookup by JIS X 0402 municipal code (5-digit string).

```typescript
getCityByCode("13101");        // 千代田区
getCityByCode("13101", "en");  // Chiyoda
```

#### `getCityByLGCode(lgCode, lang?): City | undefined`

Lookup by 6-digit local government code (with check digit).

```typescript
getCityByLGCode("131016");        // 千代田区
getCityByLGCode("131016", "en");  // Chiyoda
```

### Utilities

#### `getSupportedLanguages(): readonly Lang[]`

Returns the list of supported language codes.

```typescript
getSupportedLanguages();
// ["ja", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"]
```

## Types

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
  name: string;       // Localized name
}

interface City {
  code: string;           // JIS X 0402 5-digit (e.g. "13101")
  prefCode: string;       // Prefecture code (e.g. "13")
  lgCode: string;         // 6-digit with check digit (e.g. "131016")
  parentCode: string | null; // Parent designated city code, or null
  type: CityType;
  name: string;           // Localized name
}

interface GetCitiesOptions {
  type?: CityType;
  parentCode?: string;
}
```

## Language Aliases

The `lang` parameter accepts aliases for convenience:

| Alias | Resolves to |
|-------|-------------|
| `zh-Hans` | `zh-CN` |
| `zh-Hant` | `zh-TW` |
| `zh` | `zh-CN` |
| `cn` | `zh-CN` |
| `tw` | `zh-TW` |

Unsupported or omitted language codes fall back to `ja`.

## Data

- **47** prefectures
- **1,917** municipalities: 779 cities, 20 designated cities, 171 wards, 23 special wards, 736 towns, 189 villages
- Sources: JIS X 0401, JIS X 0402, ISO 3166-2:JP

## License

MIT

---

# jp-regions-i18n

依存ゼロの多言語対応 日本の都道府県・市区町村データライブラリ。

47都道府県・1,917市区町村を7言語（日本語・英語・簡体字中国語・繁体字中国語・韓国語・ポルトガル語・ベトナム語）で提供します。

## インストール

```bash
npm install jp-regions-i18n
# または
pnpm add jp-regions-i18n
```

## クイックスタート

```typescript
import { getPrefectures, getCities } from "jp-regions-i18n";

// 全都道府県（日本語、デフォルト）
const prefs = getPrefectures();
// [{ code: "01", iso: "JP-01", name: "北海道" }, ...]

// 全都道府県（英語）
const prefsEn = getPrefectures("en");
// [{ code: "01", iso: "JP-01", name: "Hokkaido" }, ...]

// 東京都の市区町村（英語）
const cities = getCities("13", "en");
// [{ code: "13101", name: "Chiyoda", ... }, ...]
```

## API

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

### 市区町村

#### `getCities(prefCode, lang?, options?): City[]`

指定した都道府県コードの市区町村を返します。`type` と `parentCode` でフィルタリング可能。

```typescript
// 大阪府の全市区町村
getCities("27", "en");

// 政令指定都市のみ
getCities("27", "en", { type: "designated_city" });

// 大阪市の区（parentCode: "27100"）
getCities("27", "en", { parentCode: "27100" });
```

#### `getCityByCode(code, lang?): City | undefined`

JIS X 0402 市区町村コード（5桁文字列）で検索。

```typescript
getCityByCode("13101");        // 千代田区
getCityByCode("13101", "en");  // Chiyoda
```

#### `getCityByLGCode(lgCode, lang?): City | undefined`

6桁の地方公共団体コード（チェックディジット付き）で検索。

```typescript
getCityByLGCode("131016");        // 千代田区
getCityByLGCode("131016", "en");  // Chiyoda
```

### ユーティリティ

#### `getSupportedLanguages(): readonly Lang[]`

サポートされている言語コード一覧を返します。

```typescript
getSupportedLanguages();
// ["ja", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"]
```

## 型定義

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
  name: string;       // ローカライズされた名前
}

interface City {
  code: string;           // JIS X 0402 5桁（例: "13101"）
  prefCode: string;       // 都道府県コード（例: "13"）
  lgCode: string;         // 6桁チェックディジット付き（例: "131016"）
  parentCode: string | null; // 親の政令指定都市コード、またはnull
  type: CityType;
  name: string;           // ローカライズされた名前
}

interface GetCitiesOptions {
  type?: CityType;
  parentCode?: string;
}
```

## 言語エイリアス

`lang` パラメータには以下のエイリアスが使えます:

| エイリアス | 解決先 |
|-----------|--------|
| `zh-Hans` | `zh-CN` |
| `zh-Hant` | `zh-TW` |
| `zh` | `zh-CN` |
| `cn` | `zh-CN` |
| `tw` | `zh-TW` |

未対応または省略した言語コードは `ja` にフォールバックします。

## データ

- **47** 都道府県
- **1,917** 市区町村: 市 779、政令指定都市 20、区 171、特別区 23、町 736、村 189
- データソース: JIS X 0401、JIS X 0402、ISO 3166-2:JP

## ライセンス

MIT
