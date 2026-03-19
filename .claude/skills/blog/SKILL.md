---
name: blog
description: ブログ記事の追加・管理方法とファイル構成
user-invocable: false
---

## ブログ

Markdownファイルをリポジトリに置き、Viteのビルド時にHTMLに変換する構成。

### 記事の追加方法

`content/blog/` に `.md` ファイルを作成する。ファイル名がそのままURLのスラッグになる。

```
content/blog/my-article.md → /blog/my-article
```

### frontmatter（必須）

```md
---
title: 記事タイトル
date: YYYY-MM-DD
description: 一覧ページに表示される概要文。
---
```

- `title` — 記事タイトル（一覧・詳細ページの見出し）
- `date` — 公開日（降順ソートに使用）
- `description` — 記事一覧に表示される説明文

### ファイル構成

- `content/blog/*.md` — 記事のMarkdownファイル
- `src/blogLoader.ts` — glob importでMDを読み込み、frontmatter解析 + marked変換
- `src/Blog.tsx` — `/blog` 記事一覧ページ
- `src/BlogPost.tsx` — `/blog/:slug` 記事詳細ページ

### 技術詳細

- `import.meta.glob` で `content/blog/*.md` を `?raw` として一括読み込み（eager）
- frontmatterは自前パーサーで解析（`key: value` 形式）
- `marked` ライブラリでMarkdown → HTML変換
- 記事は日付降順でソート済み
- 存在しないスラッグは `/blog` にリダイレクト

### 記事で使えるMarkdown記法

見出し（h2, h3）、リスト、太字、コードブロック、blockquote、リンク — すべてスタイリング済み。
