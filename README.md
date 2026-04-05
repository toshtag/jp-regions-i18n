# jp-regions-i18n

Zero-dependency multilingual Japanese prefectures and cities data.

47 prefectures and 1,917 municipalities across 7 languages: Japanese, English, Simplified Chinese, Traditional Chinese, Korean, Portuguese, and Vietnamese.

[日本語版はこちら](README.ja.md) | [Full API Reference](docs/API.md)

## Install

```bash
npm install jp-regions-i18n
# or
pnpm add jp-regions-i18n
```

## Quick Start

Need only one language? Use a subpath import for a much smaller bundle (~17–30 KB gzip vs. 84 KB):

```typescript
import { getPrefectures, getCities } from "jp-regions-i18n/en"; // English only (~17 KB gzip)
import { getPrefectures, getCities } from "jp-regions-i18n/ja"; // Japanese only (~30 KB gzip)
// also: /zh-CN  /zh-TW  /ko  /pt  /vi
```

The subpath API is identical except the `lang` argument is omitted (language is fixed) and `AllLangs` variants are not included.

To use all languages at once:

```typescript
import { getPrefectures, getCities, getPrefecturesAllLangs, getPrefectureByName, getCitiesByPrefName } from "jp-regions-i18n";

// All prefectures in Japanese (default)
const prefs = getPrefectures();
// [{ code: "01", iso: "JP-01", lgCode: "010006", name: "北海道" }, ...]

// All prefectures in English
const prefsEn = getPrefectures("en");
// [{ code: "01", iso: "JP-01", lgCode: "010006", name: "Hokkaido" }, ...]

// Cities in Tokyo (code "13") in English
const cities = getCities("13", "en");
// [{ jisCode: "13101", name: "Chiyoda-ku", ... }, ...]

// Look up by name — no need to memorize prefecture codes
const tokyo = getPrefectureByName("Tokyo");          // or "東京都", "東京", "도쿄도", ...
const cities2 = getCitiesByPrefName("東京", "en");  // same result as getCities("13", "en")

// All prefectures with every language at once
const prefsAll = getPrefecturesAllLangs();
// [{ code: "01", ..., name: { ja: "北海道", en: "Hokkaido", ... } }, ...]
```

For the full API including lookup functions, filtering options, and type definitions, see [docs/API.md](docs/API.md).

## Data

- **47** prefectures
- **1,917** municipalities: 779 cities, 20 designated cities, 171 wards, 23 special wards, 736 towns, 189 villages
- Sources: JIS X 0401, JIS X 0402, ISO 3166-2:JP

## License

MIT
