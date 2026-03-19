---
name: seo
description: SEO設定とsitemap.xmlの更新ルール
user-invocable: false
---

## SEO

- Google Search Console: 登録済み（2026-03-19）
- Google Analytics: G-D3YG368KVN（index.htmlに埋め込み）
- `public/sitemap.xml` — 送信済み
- `public/robots.txt` — 全クローラー許可

### sitemap.xml の更新ルール

ページ追加時に `<url>` エントリを追加すること。ブログ記事の個別URLは含めず、`/blog` 一覧ページのみ掲載。

現在のページ: `/`、`/about`、`/services`、`/blog`

### 構造化データ（JSON-LD）

`index.html` に `<script type="application/ld+json">` で Organization スキーマを埋め込み済み。
事業内容の変更時は `description` フィールドも更新すること。

### OGP

`index.html` の `<head>` に og:title / og:description / og:image / twitter:card を設定済み。
