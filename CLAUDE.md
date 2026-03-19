# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

株式会社団野ソフトウェアのコーポレートサイト。Vite + React + TypeScript。Vercelでホスティング。

**パブリックリポジトリのため、機密値（APIキー、トークン等）は絶対にコードに含めないこと。**

gitleaks による pre-commit フックでコミット時に自動検出。セットアップ: `brew install gitleaks` → `.git/hooks/pre-commit` を配置。

## コマンド

- `npm run dev` — 開発サーバー起動
- `npm run build` — プロダクションビルド
- `npm run lint` — ESLint

## スキル

詳細は各スキルファイルを参照。

- `.claude/skills/architecture/SKILL.md` — ファイル構成・デザイン
- `.claude/skills/blog/SKILL.md` — ブログ記事の追加・管理方法
- `.claude/skills/deploy/SKILL.md` — Vercel・環境変数
- `.claude/skills/seo/SKILL.md` — sitemap更新ルール
- `.claude/skills/fact-check/SKILL.md` — 記事のファクトチェック
- `.claude/skills/secret-check/SKILL.md` — 機密値の混入チェック

## 返信言語

ユーザーへの返信は日本語で行うこと。
