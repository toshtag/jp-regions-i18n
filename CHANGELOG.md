# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html) with the following convention for pre-1.0 releases: breaking changes increment the minor version.

---

## [Unreleased]

## [0.6.1] - 2026-04-05

### Fixed

- `tsconfig.json`: change `module` from `ES2022` to `ESNext` to properly support import attributes syntax (`with { type: "json" }`)
- `tsconfig.json`: remove redundant options already managed by tsup (`declaration`, `declarationMap`, `sourceMap`, `outDir`) and `esModuleInterop` (unnecessary in ESM-first project)

### Changed

- `pt` names updated to use proper Portuguese labels from Wikidata (with macron notation where applicable, e.g. `Hokkaidō`, `Hyōgo`, `Kōchi`)
- `vi` names updated to use Hán Việt (Sino-Vietnamese) readings sourced from Vietnamese Wikipedia (e.g. `北海道→Bắc Hải Đạo`, `横浜市→Hoành Tân thị`, `京都市→Kinh Đô thị`)
- Both `pt` and `vi` fall back to the English name when a translation is unavailable

## [0.6.0] - 2026-04-05

### Added

- `getPrefectureByName(name, lang?, options?)` — look up a prefecture by name in any of the 10 supported languages
- `getPrefectureByNameAllLangs(name, options?)` — same, returns all 10 language names
- `getCitiesByPrefName(prefName, lang?, options?)` — get cities by prefecture name instead of prefecture code
- `getCitiesAllLangsByPrefName(prefName, options?)` — same, returns all 10 language names per city
- Name matching is case-insensitive and accepts both full forms (`"東京都"`, `"Tokyo"`) and short forms (`"東京"`, `"Osaka"`) across all languages

## [0.5.0] - 2026-04-04

### Breaking Changes

- `Lang` type extended with `"ja-Hira"`, `"ja-Kana"`, `"ja-HW"` — exhaustive switches on `Lang` must handle these new values

### Added

- `"ja-Hira"` — hiragana readings for all 47 prefectures and 1,917 municipalities
- `"ja-Kana"` — katakana readings (derived from hiragana at build time)
- `"ja-HW"` — half-width katakana readings (derived from katakana at build time)
- Language aliases: `hira`/`hiragana` → `"ja-Hira"`, `kana`/`katakana` → `"ja-Kana"`, `hw` → `"ja-HW"`
- `short` option supports the three new scripts: strips hiragana/katakana/half-width kana administrative suffixes
- Data sourced from 総務省 (Ministry of Internal Affairs) official local government code list

## [0.4.0] - 2026-04-04

### Added

- `short?: boolean` option for all prefecture and city functions — strips administrative suffixes from the `name` field (e.g. `"東京都"` → `"東京"`, `"Chiyoda-ku"` → `"Chiyoda"`)
- `GetPrefecturesOptions` type exported from the package
- `short` is supported in `AllLangs` variants, stripping suffixes across all 7 languages simultaneously
- Supported suffixes by language: ja/zh-CN/zh-TW/ko for CJK scripts; `-shi`/`-ku`/`-cho`/`-machi`/`-son`/`-mura` for en/pt/vi

## [0.3.0] - 2026-04-03

### Added

- `PrefectureAllLangs` and `CityAllLangs` types — same shape as `Prefecture`/`City` but with `name: Record<Lang, string>` instead of `name: string`
- `getPrefecturesAllLangs()` — returns all 47 prefectures with names in all 7 languages
- `getPrefectureByCodeAllLangs(code)` — lookup by JIS X 0401 code with all languages
- `getPrefectureByISOAllLangs(iso)` — lookup by ISO 3166-2:JP code with all languages
- `getPrefectureByLGCodeAllLangs(lgCode)` — lookup by 6-digit LG code with all languages
- `getCitiesAllLangs(prefCode, options?)` — returns cities with names in all 7 languages, supports the same filtering options as `getCities`
- `getCityByJisCodeAllLangs(jisCode)` — lookup by JIS X 0402 code with all languages
- `getCityByLGCodeAllLangs(lgCode)` — lookup by 6-digit LG code with all languages
- `docs/API.md` — full API reference (English + Japanese)
- `README.ja.md` — dedicated Japanese README

### Changed

- `README.md` — restructured to English-only compact format; full API details moved to `docs/API.md`

## [0.2.0] - 2026-04-03

### Breaking Changes

- `City.code` renamed to `City.jisCode`
- `City.parentCode` renamed to `City.parentJisCode`
- `getCityByCode()` renamed to `getCityByJisCode()`

### Added

- `Prefecture.lgCode` field (全国地方公共団体コード, 6-digit)
- `getPrefectureByLGCode(lgCode, lang?)` — lookup by 6-digit LG code
- `getCityByLGCode(lgCode, lang?)` — lookup by 6-digit LG code with check digit

## [0.1.0] - 2026-04-03

### Added

- 47 prefectures and 1,917 municipalities across 7 languages (ja, en, zh-CN, zh-TW, ko, pt, vi)
- `getPrefectures(lang?)`, `getPrefectureByCode(code, lang?)`, `getPrefectureByISO(iso, lang?)`
- `getCities(prefCode, lang?, options?)`, `getCityByCode(code, lang?)`
- `getSupportedLanguages()`
- Language aliases: `zh-Hans` → `zh-CN`, `zh-Hant` → `zh-TW`, `zh`/`cn` → `zh-CN`, `tw` → `zh-TW`
- ESM + CommonJS dual build, TypeScript declarations
- Zero runtime dependencies
