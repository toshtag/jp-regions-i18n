# Contributing

## Development Setup

```bash
git clone https://github.com/toshtag/jp-regions-i18n.git
cd jp-regions-i18n
pnpm install
pnpm run build:data
pnpm run build
pnpm test
```

## Branch Naming

- `feature/<name>` - New features
- `fix/<name>` - Bug fixes
- `docs/<name>` - Documentation
- `chore/<name>` - Config, CI, etc.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/).

## Modifying / Adding Data

1. Edit CSV files under `data-source/`
2. Run `pnpm run build:data` to regenerate JSON
3. Run `pnpm test` to verify tests pass
4. Include both the CSV and generated JSON in your commit

## Pull Request Rules

- Each PR should address a single concern
- Describe **what** and **why** in the PR description
- All tests must pass
- Do not break existing tests

---

# コントリビューション ガイド

## 開発環境のセットアップ

```bash
git clone https://github.com/toshtag/jp-regions-i18n.git
cd jp-regions-i18n
pnpm install
pnpm run build:data
pnpm run build
pnpm test
```

## ブランチ命名規則

- `feature/機能名` - 新機能
- `fix/バグ内容` - バグ修正
- `docs/対象` - ドキュメント
- `chore/対象` - 設定・CI等

## コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) に従ってください。

## データの修正・追加

1. `data-source/` 配下の CSV ファイルを編集
2. `pnpm run build:data` で JSON を再生成
3. `pnpm test` でテストが通ることを確認
4. CSV と生成された JSON の両方をコミットに含める

## PR のルール

- 1つの PR では1つの関心事のみ扱う
- PR の説明欄に「何を・なぜ変更したか」を記載する
- テストが通っていること
- 既存のテストを壊さないこと
