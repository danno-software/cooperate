---
title: AWS SSO + AssumeRole で長時間プログラムを動かせるか — 認証情報のライフサイクルを整理する
date: 2026-04-01
description: AWS SSO (Identity Center) 環境で AssumeRole を使って長時間バッチを回したい。しかし SSO セッションにも AssumeRole にも有効期限がある。どこで切れるのか、どう回避するのか、実務で踏んだ制約と設計パターンを整理します。
tags: AWS, SSO, AssumeRole, STS, IAM, 認証
---

## はじめに

AWS SSO (IAM Identity Center) で認証し、AssumeRole で別ロールの権限を取得して作業する — マルチアカウント環境ではよくある構成です。

ただし、この構成で長時間実行するバッチ処理やスクリプトを動かそうとすると、「いつの間にか認証が切れて処理が止まっていた」という問題にぶつかります。

この記事では、SSO + AssumeRole 構成における認証情報のライフサイクルを整理し、長時間実行が必要な場合の設計パターンをまとめます。

## 前提: SSO + AssumeRole の構成

以下のような `~/.aws/config` を想定します。

```ini
[profile base-profile]
sso_start_url = https://xxxxx.awsapps.com/start
sso_region = ap-northeast-1
sso_account_id = xxxxxxxxxxxx
sso_role_name = BaseRole
region = ap-northeast-1

[profile assume-role-profile]
role_arn = arn:aws:iam::xxxxxxxxxxxx:role/TargetRole
source_profile = base-profile
region = ap-northeast-1
```

この構成では、認証の流れが2段階になります。

1. **SSO 認証** → SSO セッショントークンを取得（`aws sso login`）
2. **AssumeRole** → SSO トークンを使って STS から一時認証情報を取得

それぞれに有効期限があり、どちらが先に切れるかで挙動が変わります。

## 各認証情報の有効期限

| 認証情報 | 有効期限 | 延長可否 |
|--|--|--|
| SSO セッショントークン | デフォルト 8 時間、最大 12 時間 | 管理者が設定変更可能。ただし 12 時間が上限 |
| AssumeRole 一時認証情報 | デフォルト 1 時間、最大 12 時間 | ロールの `MaxSessionDuration` で設定可能 |
| ロールチェイニング時の認証情報 | **最大 1 時間（固定）** | 延長不可 |

ロールチェイニング（あるロールの認証情報で別のロールを AssumeRole する）の場合、AWS の仕様上セッション時間は最大 1 時間に制限されます。`DurationSeconds` を指定しても無視されます。

## SSO セッションが切れると何が起きるか

AssumeRole で取得した一時認証情報は、**取得した時点で SSO セッションとは独立した有効期限を持ちます**。

つまり、AssumeRole 実行後に SSO セッションが切れても、**取得済みの一時認証情報はその有効期限まで使い続けられます**。処理の途中で突然切れるわけではありません。

問題は **認証情報の再取得** です。一時認証情報が期限切れを迎えたとき、SDK は自動的に AssumeRole を再実行しようとしますが、このとき元の SSO セッションが切れていると再取得に失敗します。

```
時間軸 →

SSO セッション:  [======== 有効 ========]  ← 8〜12 時間で切れる
AssumeRole #1:         [=== 有効 ===]
AssumeRole #2:                        [=== 再取得 ===]  ← SSO が生きていれば成功
AssumeRole #3:                                           [× 再取得失敗]  ← SSO 切れ
```

この制約から、**SSO 認証ベースの構成では 12 時間を超える連続実行は実現できません**。

## AssumeRole の自動更新は SDK がやってくれるのか

AWS SDK（boto3、AWS SDK for JavaScript 等）は、profile に `role_arn` + `source_profile` が設定されていれば、一時認証情報の期限が近づくと自動で AssumeRole を再実行してくれます。

```python
# boto3 の場合、profile 指定だけで自動更新が動く
session = boto3.Session(profile_name="assume-role-profile")
s3 = session.client("s3")
```

ただしこの自動更新が機能するのは、**source_profile の認証（= SSO セッション）が有効な間だけ**です。

より細かく制御したい場合は `botocore.credentials.RefreshableCredentials` を使って、期限切れ時のコールバックを自前で実装する方法もありますが、SSO セッション自体が切れている場合は根本的に解決できません。

## 長時間実行が必要な場合の設計パターン

SSO + AssumeRole で 12 時間の壁にぶつかる場合、以下の構成を検討します。

### パターン 1: EC2 / ECS に IAM ロールを付与する（推奨）

EC2 インスタンスや ECS タスクに IAM ロールを直接付与すると、インスタンスメタデータサービス（IMDS）を通じて認証情報が自動的に取得・更新されます。

```
EC2 (IAM ロール付与)
  → IMDS が自動で認証情報を更新
  → ユーザーの認証セッションに依存しない
  → 事実上、無期限で実行可能
```

SDK は IMDS からの認証情報取得を透過的に行うため、アプリケーション側のコード変更は基本的に不要です。

### パターン 2: Lambda で実行する

Lambda にも実行ロールが付与されるため、EC2 と同様に認証情報は自動更新されます。バッチ処理の性質によっては Lambda の実行時間制限（最大 15 分）に収まるよう分割する設計が必要です。

Step Functions と組み合わせれば、長時間のワークフローも実現できます。

### パターン 3: SSO セッション内で完了する設計にする

処理を 12 時間以内に収まるよう分割し、実行のたびに `aws sso login` を行う運用です。手動介入が必要になるため自動化には向きませんが、開発・検証フェーズでは十分なケースもあります。

## 設計判断のフローチャート

```
長時間バッチを実行したい
  │
  ├── ユーザー操作なしで自動実行したい
  │     → EC2/ECS/Lambda + IAM ロール（パターン 1 or 2）
  │
  └── ローカルから手動実行で十分
        │
        ├── 12 時間以内に終わる
        │     → SSO + AssumeRole のまま運用可能
        │
        └── 12 時間を超える
              → 処理を分割するか、EC2 上での実行に切り替える
```

## まとめ

- AssumeRole の一時認証情報は SSO セッションとは独立した有効期限を持つ。取得済みの認証情報が途中で切れることはない
- ただし認証情報の **再取得** には SSO セッションが有効である必要がある
- SSO セッションの最大有効期限は 12 時間。これを超える連続実行は SSO ベースでは実現できない
- ロールチェイニングの場合はさらに厳しく、最大 1 時間に制限される
- 長時間実行が必要なら、EC2/ECS/Lambda に IAM ロールを付与する構成に切り替えるのが AWS のベストプラクティス

## 参考リンク

- [AWS リソースで一時的な認証情報を使用する](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_temp_use-resources.html)
- [AssumeRole - AWS STS API Reference](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html)
- [IAM ロールを使用して EC2 インスタンスにアクセス許可を付与する](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html)
- [ロール認証情報プロバイダー - AWS SDKs とツール](https://docs.aws.amazon.com/ja_jp/sdkref/latest/guide/feature-assume-role-credentials.html)
- [IAM セキュリティのベストプラクティス](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/best-practices.html)
