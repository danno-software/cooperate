# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

団野ソフトウェアのコーポレートサイト。Vite + React + TypeScript で構築したLP風ワンページサイト。

**パブリックリポジトリのため、機密値（APIキー、トークン等）は絶対にコードに含めないこと。**

## コマンド

- `npm run dev` — 開発サーバー起動
- `npm run build` — TypeScriptチェック + プロダクションビルド（`dist/`に出力）
- `npm run preview` — ビルド結果のプレビュー
- `npm run lint` — ESLintによるリント

## アーキテクチャ

- `index.html` — エントリーポイント（lang="ja"）
- `src/main.tsx` — Reactのマウント
- `src/App.tsx` — LP全体の構成（Header / Hero / About / Services / Contact / Footer）
- `src/index.css` — グローバルスタイル・CSS変数定義（ダークモード対応）
- `src/App.css` — コンポーネントスタイル・レスポンシブ対応
- `public/favicon.svg` — ファビコン

## デプロイ

Cloudflare Pagesを利用予定。ビルドコマンド: `npm run build`、出力ディレクトリ: `dist`。

## 返信言語

ユーザーへの返信は日本語で行うこと。
