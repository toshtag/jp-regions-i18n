# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html) with the following convention for pre-1.0 releases: breaking changes increment the minor version.

---

## [Unreleased]

## [0.9.0] - 2026-04-06

### Added

- **Interactive demo** (GitHub Pages) — https://toshtag.github.io/jp-regions-i18n/
  - Search prefectures and cities in any of the 10 supported languages in real time
  - View all 10 language variants side-by-side for any selected prefecture
  - Browse municipalities grouped by type (designated city, special ward, city, ward, town, village)
  - Copy `PrefectureAllLangs` JSON to clipboard with one click
  - Share current state via URL (`?pref=13` / `?q=tokyo`)
  - No npm install required — runs entirely in the browser via esm.sh

## [0.8.0] - 2026-04-06

### Added

- **`jp-regions-i18n/en-macrons` subpath** — English with modified Hepburn macrons (ō/ū for long vowels), pre-computed at build time from hiragana readings. Zero extra runtime cost — same data structure as `/en`.
  - Prefectures: `Tōkyō`, `Ōsaka`, `Hokkaidō`, `Kyōto`, `Hyōgo`, `Kōchi`, `Ōita`, …
  - Cities: `Tōbetsu-chō`, `Chūō-ku`, `Ōsaka-shi`, `Sapporo-shi` (no macron when reading has none), …
  - `-chō` suffix for 町 (long vowel); `-shi`, `-ku`, `-machi`, `-son`, `-mura` unchanged

## [0.7.1] - 2026-04-06

### Fixed

- **Portuguese (`pt`) translations overhauled** — all 47 prefectures and ~1,900 cities rewritten using classical European Portuguese orthography, consistent with the established forms `Tóquio` (東京) and `Quioto` (京都):
  - Consonant transcription: `sh`→`x`, `ch`→`x`, `ky`→`qui`, `tsu`→`tçu`, `k(a/o/u)`→`c`, `k(e/i)`→`qu`
    (e.g. `Hiroshima`→`Hiroxima`, `Chiba`→`Xiba`, `Fukuoka`→`Fucuoca`, `Ibaraki`→`Ibaraqui`)
  - Long vowel macrons added from hiragana readings: `ō` (おお/おう/とう/しょう…), `ū` (うう/ゅう/しゅう…)
    (e.g. `Ōsaka`, `Tōbetsu-xo`, `Xūnan-xi`, `Chūō-cu`)
  - Administrative suffixes transcribed accordingly: `-shi`→`-xi`, `-ku`→`-cu`, `-machi`→`-maxi`, `-cho`→`-xo`
  - Portuguese orthography rule: `n` before `b`/`p` → `m` (e.g. `Nanporo`→`Namporo`)
  - Fixed numerous incorrect entries (e.g. 千葉市 was `Chuo-ku`, Tokyo special wards missing `-ku`)
  - Established historical PT forms preserved: `Tóquio`, `Quioto`/`Quioto-xi`, `Nagoia-xi`
- **Vietnamese (`vi`) translations overhauled** — all 47 prefectures and ~1,900 cities corrected:
  - Sino-Vietnamese (漢越語) readings applied to all kanji place names
  - Ainu-origin and non-kanji names transliterated phonetically
  - Administrative suffixes: 市=`thị`, 区=`khu`, 町=`đinh`, 村=`thôn`, 県=`tỉnh`, 府=`phủ`, 都=`đô`, 道=`đạo`
- **`shortenCityName` / `shortenPrefName` for `vi` and `pt`** now work correctly:
  - `CITY_SUFFIXES.pt` updated to transcribed suffixes (`-xi`, `-cu`, `-maxi`, `-xo`, `-son`, `-mura`)
  - `CITY_SUFFIXES.vi` and `PREF_SUFFIXES.vi` now use proper Vietnamese suffixes (` thị`, ` khu`, ` đinh`, ` thôn` / ` tỉnh`, ` phủ`, ` đô`, ` đạo`)

## [0.7.0] - 2026-04-05

### Added

- **Language-specific subpath exports** — import only the language you need for a dramatically smaller bundle:
  - `jp-regions-i18n/ja` — Japanese only (~30 KB gzip)
  - `jp-regions-i18n/en` — English only (~17 KB gzip)
  - `jp-regions-i18n/zh-CN`, `/zh-TW`, `/ko`, `/pt`, `/vi`
- Each subpath exports the same API as the main entry point, but without the `lang` argument (language is fixed) and without `AllLangs` variants

### Changed

- **Internal data format rewritten for minimum size** — JSON payloads are now compact indexed arrays instead of named-key objects:
  - Redundant fields eliminated: `prefCode` (derived from `code[0:2]`), `iso` (derived from `"JP-" + code`), full `lgCode` (stored as suffix, restored at runtime)
  - `ja-Kana` and `ja-HW` removed from data files — computed at runtime from `ja-Hira` via character-code conversion
  - All JSON files minified (no indentation)
- Bundle size reduction (gzip):
  - Main entry (`jp-regions-i18n`): 141 KB → **84 KB** (−40%)
  - Per-language entries: **17–30 KB** (vs. 141 KB previously required)

### Internal

- `src/kana.ts` — hiragana↔katakana conversion extracted into a standalone module
- `src/store-lang.ts` — lightweight per-language store factory (no `AllLangs` overhead)

## [0.6.2] - 2026-04-05

### Changed

- `pt` names updated to use proper Portuguese labels from Wikidata (with macron notation where applicable, e.g. `Hokkaidō`, `Hyōgo`, `Kōchi`)
- `vi` names updated to use Hán Việt (Sino-Vietnamese) readings sourced from Vietnamese Wikipedia (e.g. `北海道→Bắc Hải Đạo`, `横浜市→Hoành Tân thị`, `京都市→Kinh Đô thị`)
- Both `pt` and `vi` fall back to the English name when a translation is unavailable

## [0.6.1] - 2026-04-05

### Fixed

- `tsconfig.json`: change `module` from `ES2022` to `ESNext` to properly support import attributes syntax (`with { type: "json" }`)
- `tsconfig.json`: remove redundant options already managed by tsup (`declaration`, `declarationMap`, `sourceMap`, `outDir`) and `esModuleInterop` (unnecessary in ESM-first project)

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
