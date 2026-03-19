# 株式会社団野ソフトウェア コーポレートサイト

Vite + React + TypeScript で構築。Vercel でホスティング。

## セットアップ

```bash
npm install
npm run dev
```

### 機密値の自動検出（gitleaks）

このリポジトリはパブリックのため、コミット前に [gitleaks](https://github.com/gitleaks/gitleaks) で機密値を自動検出する pre-commit フックを使用しています。

初回のみ以下を実行してください:

```bash
# 1. gitleaks をインストール
brew install gitleaks

# 2. pre-commit フックを配置
cat << 'EOF' > .git/hooks/pre-commit
#!/bin/sh
gitleaks git --pre-commit --staged --verbose
if [ $? -ne 0 ]; then
  echo ""
  echo "[gitleaks] 機密値が検出されました。コミットを中止します。"
  echo "誤検知の場合は、.gitleaksignore に該当行を追加してください。"
  exit 1
fi
EOF
chmod +x .git/hooks/pre-commit
```

## コマンド

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run lint` | ESLint |

## ブログ記事の追加

`content/blog/` に Markdown ファイルを置くとビルド時に自動で変換されます。

```
content/blog/my-article.md → /blog/my-article
```

frontmatter（必須）:

```md
---
title: 記事タイトル
date: YYYY-MM-DD
description: 一覧ページに表示される概要文。
---
```
