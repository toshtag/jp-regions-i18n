# Contributing

Thank you for considering contributing to jp-regions-i18n!

## Prerequisites

- Node.js >= 20
- [pnpm](https://pnpm.io/) (version specified in `packageManager` field of `package.json`)

## Getting Started

```bash
git clone https://github.com/toshtag/jp-regions-i18n.git
cd jp-regions-i18n
pnpm install
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run build:data` | Generate JSON data from CSV source files (`data-source/` -> `src/generated/`) |
| `pnpm run build` | Build the library (ESM + CJS + DTS) to `dist/` |
| `pnpm test` | Run all tests once |
| `pnpm run test:watch` | Run tests in watch mode |
| `pnpm run lint` | Check code with Biome (linting + formatting) |
| `pnpm run lint:fix` | Auto-fix lint and formatting issues |
| `pnpm run format` | Format code with Biome |
| `pnpm run validate` | Run the full CI pipeline locally: lint -> build:data -> build -> test |

## Before Submitting a Pull Request

1. Create a feature branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes with small, focused commits following [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(scope): add new feature
   fix(scope): fix a bug
   docs(scope): update documentation
   chore(scope): maintenance tasks
   refactor(scope): code refactoring
   style(scope): formatting changes
   test(scope): add or update tests
   ```

3. **Run the full validation before pushing:**
   ```bash
   pnpm run validate
   ```
   This runs the same checks as CI (lint, build:data, build, test). **Do not push if this fails.**

4. Push your branch and create a pull request targeting `develop`:
   ```bash
   git push -u origin feature/your-feature-name
   ```

## Pull Request Guidelines

- Target branch: always `develop` (not `main`)
- PRs require CI to pass before merging
- PRs are reviewed by the maintainer before merging — do not merge your own PR
- Use merge commits (not squash or rebase)
- Keep PRs focused: one logical change per PR
- Describe **what** and **why** in the PR description

## Branch Strategy

```
main          <- stable releases only (develop -> main)
  develop     <- integration branch (feature/fix branches -> develop)
    feature/* <- new features
    fix/*     <- bug fixes
    docs/*    <- documentation
    chore/*   <- maintenance
```

## Code Style

- TypeScript strict mode
- [Biome](https://biomejs.dev/) for linting and formatting
- 2-space indentation, double quotes, semicolons always

Run `pnpm run lint:fix` to auto-fix most style issues.

## Data Changes

If you need to modify prefecture or city data:

1. Edit the CSV files in `data-source/`
2. Run `pnpm run build:data` to regenerate JSON
3. Verify the generated files in `src/generated/`
4. Include both the CSV changes and generated JSON in your PR

---

# コントリビューションガイド

jp-regions-i18n へのコントリビューションをご検討いただきありがとうございます！

## 前提条件

- Node.js >= 20
- [pnpm](https://pnpm.io/)（バージョンは `package.json` の `packageManager` フィールドに指定）

## セットアップ

```bash
git clone https://github.com/toshtag/jp-regions-i18n.git
cd jp-regions-i18n
pnpm install
```

## 利用可能なスクリプト

| コマンド | 説明 |
|---------|------|
| `pnpm run build:data` | CSVからJSONデータを生成（`data-source/` -> `src/generated/`） |
| `pnpm run build` | ライブラリをビルド（ESM + CJS + DTS → `dist/`） |
| `pnpm test` | テストを1回実行 |
| `pnpm run test:watch` | テストをウォッチモードで実行 |
| `pnpm run lint` | Biomeによるコードチェック（lint + フォーマット） |
| `pnpm run lint:fix` | lint・フォーマット問題を自動修正 |
| `pnpm run format` | Biomeによるコードフォーマット |
| `pnpm run validate` | CIと同等のパイプラインをローカル実行：lint -> build:data -> build -> test |

## PR提出前の手順

1. `develop` からフィーチャーブランチを作成:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. [Conventional Commits](https://www.conventionalcommits.org/) 形式で細かくコミット:
   ```
   feat(scope): 新機能
   fix(scope): バグ修正
   docs(scope): ドキュメント更新
   chore(scope): メンテナンス
   refactor(scope): リファクタリング
   style(scope): フォーマット変更
   test(scope): テスト追加・更新
   ```

3. **push前に必ずバリデーションを実行:**
   ```bash
   pnpm run validate
   ```
   CIと同じチェック（lint, build:data, build, test）が走ります。**失敗した場合はpushしないでください。**

4. ブランチをpushし、`develop` 向けにPRを作成:
   ```bash
   git push -u origin feature/your-feature-name
   ```

## PR ガイドライン

- ターゲットブランチ: 常に `develop`（`main` ではない）
- マージ前にCIが通る必要あり
- メンテナーによるレビュー後にマージ — 自分のPRを自分でマージしない
- マージコミット方式（squashやrebaseではない）
- 1つのPRにつき1つの論理的な変更
- PRの説明欄に「何を・なぜ変更したか」を記載

## ブランチ戦略

```
main          <- 安定版リリースのみ（develop -> main）
  develop     <- 統合ブランチ（feature/fixブランチ -> develop）
    feature/* <- 新機能
    fix/*     <- バグ修正
    docs/*    <- ドキュメント
    chore/*   <- メンテナンス
```

## コードスタイル

- TypeScript strict モード
- [Biome](https://biomejs.dev/) による lint・フォーマット
- 2スペースインデント、ダブルクォート、セミコロン常時使用

`pnpm run lint:fix` で大半のスタイル問題は自動修正されます。

## データの変更

都道府県や市区町村データを変更する場合:

1. `data-source/` のCSVファイルを編集
2. `pnpm run build:data` でJSON再生成
3. `src/generated/` の生成ファイルを確認
4. CSVの変更と生成されたJSONの両方をPRに含める
