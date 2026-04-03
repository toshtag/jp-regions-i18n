# jp-regions-i18n

依存ゼロの多言語対応 日本の都道府県・市区町村データライブラリ。

47都道府県・1,917市区町村を7言語（日本語・英語・簡体字中国語・繁体字中国語・韓国語・ポルトガル語・ベトナム語）で提供します。

[English](README.md) | [API リファレンス](docs/API.md)

## インストール

```bash
npm install jp-regions-i18n
# または
pnpm add jp-regions-i18n
```

## クイックスタート

```typescript
import { getPrefectures, getCities, getPrefecturesAllLangs } from "jp-regions-i18n";

// 全都道府県（日本語、デフォルト）
const prefs = getPrefectures();
// [{ code: "01", iso: "JP-01", lgCode: "010006", name: "北海道" }, ...]

// 全都道府県（英語）
const prefsEn = getPrefectures("en");
// [{ code: "01", iso: "JP-01", lgCode: "010006", name: "Hokkaido" }, ...]

// 東京都の市区町村（英語）
const cities = getCities("13", "en");
// [{ jisCode: "13101", name: "Chiyoda-ku", ... }, ...]

// 全都道府県を7言語まとめて取得
const prefsAll = getPrefecturesAllLangs();
// [{ code: "01", ..., name: { ja: "北海道", en: "Hokkaido", ... } }, ...]
```

全API（検索関数・フィルタリング・型定義を含む）は [docs/API.md](docs/API.md) を参照してください。

## データ

- **47** 都道府県
- **1,917** 市区町村: 市 779、政令指定都市 20、区 171、特別区 23、町 736、村 189
- データソース: JIS X 0401、JIS X 0402、ISO 3166-2:JP

## ライセンス

MIT
