---
name: secret-check
description: コードベース内の機密値（APIキー・トークン・パスワード等）の混入チェック
user-invocable: true
---

## 機密値チェック

パブリックリポジトリのため、機密値の混入は絶対に防ぐ必要がある。このスキルでコードベースを走査し、漏洩リスクを検出する。

### 使い方

```
/secret-check              # 全ファイル対象
/secret-check src/         # 特定ディレクトリ
```

### チェック項目

1. **APIキー・トークン**: AWS, Azure, GCP, Stripe, SendGrid, OpenAI, Anthropic 等のキーパターン
2. **パスワード・シークレット**: ハードコードされたパスワード、DB接続文字列、JWTシークレット
3. **環境変数の直書き**: `process.env.XXX` や `import.meta.env.XXX` の参照は OK だが、値そのものが埋め込まれていないか
4. **プライベートURL**: 内部ツールのURL、管理画面のエンドポイント、IPアドレス
5. **個人情報**: メールアドレス（公開用の連絡先を除く）、電話番号、住所
6. **設定ファイル**: `.env`, `.env.local` 等が `.gitignore` に含まれているか

### 検出パターン（例）

- `AKIA[0-9A-Z]{16}` — AWS Access Key
- `sk-[a-zA-Z0-9]{20,}` — OpenAI / Stripe Secret Key
- `ghp_[a-zA-Z0-9]{36}` — GitHub Personal Access Token
- `password\s*[:=]\s*["'].+["']` — ハードコードパスワード
- `-----BEGIN (RSA |EC )?PRIVATE KEY-----` — 秘密鍵

### 手順

1. 対象ディレクトリのファイルを走査する（`node_modules`, `dist`, `.git` は除外）
2. 上記パターンおよびヒューリスティックで疑わしい箇所を検出する
3. `.gitignore` に `.env*` 等の機密ファイルが含まれているか確認する
4. gitleaks の pre-commit フックが有効か確認する（`.git/hooks/pre-commit` の存在）
5. 以下のフォーマットでレポートを出力する

### 出力フォーマット

```
## 機密値チェック結果

### 検出項目
- 🚨 {ファイル:行番号} — {検出内容と対処方法}

### 安全確認済み
- ✅ .gitignore に .env* が含まれている
- ✅ gitleaks pre-commit フックが有効
- ✅ Google Analytics ID（公開値のため問題なし）

### 総合判定
{漏洩リスクの有無と推奨アクション}
```

### 注意事項

- Google Analytics の測定ID（`G-XXXXXXX`）やサイトURLなど、意図的に公開している値は誤検出として除外する
- 疑わしい場合は必ず報告し、ユーザーに判断を委ねる
- `.env.example` 等のテンプレートファイルにダミー値ではなく実際の値が入っていないかも確認する
