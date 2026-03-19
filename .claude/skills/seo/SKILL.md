---
name: seo
description: SEO設定とsitemap.xmlの更新ルール
user-invocable: false
---

## SEO

- Google Search Console: 登録済み（2026-03-19）
- `public/sitemap.xml` — 送信済み
- `public/robots.txt` — 全クローラー許可

### sitemap.xml の更新タイミング

- ページ追加時
- ドメイン変更時

### 構造化データ（JSON-LD）

`index.html` に `<script type="application/ld+json">` で Organization スキーマを埋め込み済み。
ページ追加や事業内容の変更時は、JSON-LD の `description` フィールドも更新すること。

含まれる情報:
- 会社名・代表者名（団野 優人）
- 設立年・所在地
- 事業内容キーワード（AWS/GCP/Azure/Terraform/Bicep/VPC/VNet等）
- 連絡先メールアドレス
