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

詳細は `.claude/skills/` を参照。architecture（ファイル構成・デザイン）、deploy（Vercel・環境変数）、seo（sitemap更新ルール）、blog（記事の追加・管理方法）。

## 返信言語

ユーザーへの返信は日本語で行うこと。
