---
name: deploy
description: Vercelへのデプロイ手順と環境変数の情報
user-invocable: false
---

## デプロイ

- ホスティング: Vercel
- ドメイン: danno-software.com（apexドメイン）
- DNS管理: お名前.com
- GitHubリポジトリ連携で自動デプロイ（mainブランチへのpushでトリガー）

### 環境変数（Vercelダッシュボードで設定）

- `SENDGRID_API_KEY` — SendGrid APIキー
- `CONTACT_TO` — お問い合わせフォームの受信先メールアドレス

### ビルド設定

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### デプロイ失敗時のログ確認

```
npx vercel inspect <deployment-id> --logs
```

デプロイIDはVercelの通知やダッシュボードから取得可能。
