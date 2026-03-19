---
name: architecture
description: プロジェクトのアーキテクチャ・ファイル構成を説明する
user-invocable: false
---

## アーキテクチャ

Vite + React + TypeScript のLP風ワンページコーポレートサイト。

### ファイル構成

- `index.html` — エントリーポイント（lang="ja"）、Google Fonts読み込み
- `src/main.tsx` — Reactのマウント
- `src/App.tsx` — LP全体の構成（Header / Hero / About / Services / ContactSection / Footer）
- `src/index.css` — CSS変数定義、ダークモード対応、リビールアニメーション
- `src/App.css` — コンポーネントスタイル、レスポンシブ対応
- `api/contact.ts` — Vercel Serverless Function（SendGrid連携のお問い合わせ送信）
- `public/favicon.svg` — ファビコン
- `public/sitemap.xml` — サイトマップ
- `public/robots.txt` — クローラー設定

### デザイン

- フォント: Shippori Mincho（見出し）+ Zen Kaku Gothic New（本文）
- カラー: 温かみのあるオフホワイト背景 + 銅色アクセント
- ダークモード: `prefers-color-scheme` で自動切替
- アニメーション: IntersectionObserverによるスクロールフェードイン
