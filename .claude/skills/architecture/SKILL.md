---
name: architecture
description: プロジェクトのアーキテクチャ・ファイル構成を説明する
user-invocable: false
---

## アーキテクチャ

Vite + React + TypeScript のコーポレートサイト。React Routerで複数ページ構成。

### ファイル構成

- `index.html` — エントリーポイント（lang="ja"）、Google Fonts読み込み
- `src/main.tsx` — Reactのマウント、ルーティング定義
- `src/App.tsx` — トップページ（Hero / About / Services / Contact）
- `src/About.tsx` — `/about` 会社概要詳細ページ
- `src/Services.tsx` — `/services` 事業内容詳細ページ
- `src/Blog.tsx` — `/blog` ブログ一覧ページ
- `src/BlogPost.tsx` — `/blog/:slug` ブログ記事ページ
- `src/blogLoader.ts` — Markdown読み込み・変換ユーティリティ
- `content/blog/*.md` — ブログ記事（Markdownファイル）
- `src/index.css` — CSS変数定義、ダークモード対応、リビールアニメーション
- `src/App.css` — コンポーネントスタイル、レスポンシブ対応
- `public/favicon.svg` — ファビコン
- `public/sitemap.xml` — サイトマップ
- `public/robots.txt` — クローラー設定

### デザイン

- フォント: Shippori Mincho（見出し）+ Zen Kaku Gothic New（本文）
- カラー: 温かみのあるオフホワイト背景 + 銅色アクセント
- ダークモード: `prefers-color-scheme` で自動切替
- アニメーション: IntersectionObserverによるスクロールフェードイン
