---
name: blog
description: ブログ記事の追加・管理方法とファイル構成
user-invocable: false
---

## ブログ

Markdownファイルをリポジトリに置き、Viteのビルド時にHTMLに変換する構成。

### 記事の追加方法

`content/blog/` に `.md` ファイルを作成する。ファイル名がそのままURLのスラッグになる。

- ファイル名は **英小文字のケバブケース**（例: `azure-mysql-80-to-84-upgrade.md`）
- ファイル名 → URL: `content/blog/my-article.md` → `/blog/my-article`

### frontmatter

```md
---
title: 記事タイトル
date: YYYY-MM-DD
description: 一覧ページに表示される概要文。
tags: タグ1, タグ2, タグ3
---
```

| フィールド | 必須 | 説明 |
|--|--|--|
| `title` | 必須 | 記事タイトル（一覧・詳細ページの見出し） |
| `date` | 必須 | 公開日（降順ソートに使用） |
| `description` | 必須 | 記事一覧に表示される説明文 |
| `tags` | 任意 | カンマ区切りのタグ（例: `AWS, RDS, PostgreSQL`） |

### 記事の構成パターン

既存記事は以下の構成に沿っている。新規作成時もこれに倣う。

1. **はじめに** — 課題提起・読者の関心を引く導入
2. **本文** — 背景、検証内容、結果など（h2/h3 で構造化）
3. **まとめ** — 箇条書きで要点を整理
4. **参考リンク** — 公式ドキュメント等のリンク一覧

### CTA（お問い合わせ導線）

記事末尾に CTA セクションが **BlogPost.tsx で自動付与** される。Markdown 側で追加する必要はない。

### SEO（自動対応）

記事追加時に手動で SEO 設定する必要はない。以下がすべて自動で適用される。

- **sitemap.xml** — `npm run build` 時に `scripts/generate-sitemap.ts` が個別記事 URL を自動生成
- **OGP / canonical** — `src/usePageMeta.ts` でページごとに動的更新
- **Article 構造化データ** — `src/BlogPost.tsx` で JSON-LD を動的埋め込み

### ファイル構成

- `content/blog/*.md` — 記事のMarkdownファイル
- `src/blogLoader.ts` — glob importでMDを読み込み、frontmatter解析 + marked変換。`BlogPost` / `TocItem` 型を定義
- `src/Blog.tsx` — `/blog` 記事一覧ページ
- `src/BlogPost.tsx` — `/blog/:slug` 記事詳細ページ（CTA・Article JSON-LD 含む）
- `scripts/generate-sitemap.ts` — ビルド時に sitemap.xml を自動生成

### 技術詳細

- `import.meta.glob` で `content/blog/*.md` を `?raw` として一括読み込み（eager）
- frontmatterは自前パーサーで解析（`key: value` 形式）
- `marked` ライブラリでMarkdown → HTML変換
- h2/h3 見出しから目次（ToC）を自動生成
- 記事は日付降順でソート済み
- 存在しないスラッグは `/blog` にリダイレクト

### 記事で使えるMarkdown記法

見出し（h2, h3）、リスト、テーブル、太字、コードブロック、blockquote、リンク — すべてスタイリング済み。テーブルはレスポンシブ対応（横スクロール）。
