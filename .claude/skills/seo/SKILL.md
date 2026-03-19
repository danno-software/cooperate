---
name: seo
description: SEO設定とsitemap.xmlの更新ルール
user-invocable: false
---

## SEO

- Google Search Console: 登録済み（2026-03-19）
- Google Analytics: G-D3YG368KVN（index.htmlに埋め込み）
- `public/sitemap.xml` — ビルド時に自動生成
- `public/robots.txt` — 全クローラー許可

### sitemap.xml の自動生成

`scripts/generate-sitemap.ts` がビルド時（`npm run build`）に自動実行され、`public/sitemap.xml` を生成する。

- 静的ページ（`/`, `/about`, `/services`, `/blog`）は固定エントリ
- ブログ記事の個別 URL は `content/blog/*.md` から自動取得（`lastmod` に frontmatter の `date` を使用）
- **記事追加時に sitemap を手動編集する必要はない**
- 静的ページを追加した場合は `scripts/generate-sitemap.ts` の `staticPages` 配列に追加すること

### 構造化データ（JSON-LD）

- `index.html` — Organization スキーマ（事業内容の変更時は `description` も更新すること）
- `src/BlogPost.tsx` — 各ブログ記事に Article スキーマを動的に埋め込み（headline, description, datePublished, author, publisher, keywords）

### OGP / メタタグ

`src/usePageMeta.ts` で各ページごとに動的に更新される。

- `<title>`, `meta[name="description"]`
- `og:title`, `og:description`, `og:url`, `og:type`
- `<link rel="canonical">`

初期値は `index.html` の `<head>` に設定（og:image, twitter:card 含む）。
