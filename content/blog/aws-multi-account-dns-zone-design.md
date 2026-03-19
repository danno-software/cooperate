---
title: AWS マルチアカウント環境での DNS ゾーン設計 — パブリック・プライベートの分離戦略
date: 2026-03-20
description: AWS マルチアカウント環境で Route53 のパブリック・プライベートホストゾーンをどう分離すべきか。サブドメイン委任、Private Hosted Zone の VPC 関連付け、クロスアカウント共有まで、実務で使える設計パターンを整理します。
tags: AWS, Route53, DNS, マルチアカウント, ネットワーク設計
---

## はじめに

AWS をマルチアカウントで運用していると、必ずぶつかるのが「DNS ゾーンをどう分けるか」という問題です。

本番・ステージング・開発でアカウントを分離するのは今や一般的ですが、DNS はアカウント分離だけでは片付きません。パブリックゾーン（外部公開）とプライベートゾーン（VPC 内部解決）では考慮すべきポイントが異なり、それぞれに設計判断が必要です。

この記事では、パブリック DNS とプライベート DNS の両面から、マルチアカウント環境でのゾーン設計パターンを整理します。

## 前提: マルチアカウント構成

この記事では以下のようなアカウント構成を想定します。

| アカウント | 用途 | 例 |
|--|--|--|
| prd | 本番環境 | `example.com` |
| stg | ステージング環境 | `stg.example.com` |
| dev | 開発環境 | `dev.example.com` |

ドメインのレジストラは外部（お名前.com 等）で、権威サーバーとして Route53 を使用するケースです。

## パブリック DNS の環境分離

### なぜ分離が必要か

パブリックホストゾーンを1つのアカウントに集約していると、以下の問題が出てきます。

- **権限の集中**: stg 環境のデプロイで DNS レコードを更新するために、prd アカウントのゾーンへのアクセス権が必要になる
- **影響範囲の拡大**: stg のレコード変更ミスが prd のゾーンに波及するリスク
- **監査の困難さ**: どの環境の変更なのか CloudTrail のログが混在する

### パターン比較

| | 共有ゾーン（1アカウント集約） | サブドメイン委任（環境別） |
|--|--|--|
| 構成 | prd アカウントに全環境のレコード | 各アカウントに環境用のゾーン |
| 権限分離 | IAM ポリシーで制御 | アカウント境界で分離 |
| 影響範囲 | 全環境 | 該当環境のみ |
| 運用負荷 | 低い（ゾーン1つ） | やや高い（NS 委任の設定が必要） |
| 推奨度 | 小規模向け | **マルチアカウント環境では推奨** |

### サブドメイン委任の仕組み

サブドメイン委任では、親ゾーンに NS レコードを追加して、サブドメインの名前解決を別のホストゾーンに委任します。

**prd アカウント（親ゾーン: `example.com`）**

```
example.com.          NS    ns-xxx.awsdns-xx.com.  ← 自身のNS
stg.example.com.      NS    ns-yyy.awsdns-yy.org.  ← stg アカウントのゾーンへ委任
dev.example.com.      NS    ns-zzz.awsdns-zz.net.  ← dev アカウントのゾーンへ委任
```

**stg アカウント（ゾーン: `stg.example.com`）**

```
stg.example.com.      NS    ns-yyy.awsdns-yy.org.
app.stg.example.com.  A     10.1.0.100
api.stg.example.com.  A     10.1.0.200
```

これで stg アカウントの IAM 権限だけで stg 環境の DNS レコードを管理できます。

### 委任時の注意点

- **NS レコードの TTL**: 委任先のゾーンを作り直すと NS レコードが変わる。TTL を長くしすぎると切り替え時に影響が出る。300〜900 秒程度が無難
- **SOA レコードとの整合**: 親ゾーンの SOA レコードのネガティブキャッシュ TTL が長いと、委任先で追加したレコードの反映が遅れることがある
- **ACM 証明書の検証**: `*.stg.example.com` の証明書を ACM で発行する場合、CNAME 検証レコードは stg アカウントのゾーンに追加する。親ゾーンではない点に注意

## プライベート DNS の環境分離

### Route53 Private Hosted Zone（PHZ）とは

Route53 Private Hosted Zone — 以下 **PHZ** と呼びます — は、**VPC 内部でのみ名前解決できる**ホストゾーンです。パブリックゾーンとは独立して同じドメイン名を使えるため、内部向けの名前解決に使います。

```
パブリック:  api.example.com  →  203.0.113.10（ALB のパブリック IP）
プライベート: api.example.com  →  10.0.1.100 （ALB のプライベート IP）
```

VPC 内のリソースは、まず PHZ を参照します。**一致する PHZ が存在しない場合**はパブリック DNS にフォールバックしますが、**一致する PHZ があっても該当レコードが存在しない場合**はパブリック DNS にはフォールバックせず `NXDOMAIN` になります。

### VPC DNS 設定の前提

PHZ を利用するには、VPC 側で以下の設定が有効になっている必要があります。

| 設定 | 説明 | デフォルト |
|--|--|--|
| `enableDnsSupport` | VPC 内で Route53 Resolver（.2 リゾルバ）を使用可能にする | 有効 |
| `enableDnsHostnames` | EC2 にパブリック DNS ホスト名を付与する | **default VPC では有効、それ以外は無効** |

PHZ や PrivateLink の private DNS を使う場合は、両方を `true` にする必要があります。特にカスタム VPC では `enableDnsHostnames` がデフォルトで無効なので、作成時に見落としやすい点に注意が必要です。

### 分離パターン

プライベート DNS の分離には主に3つのパターンがあります。

#### パターン1: 環境別に独立したゾーン名

各環境で異なるプライベートゾーン名を使うパターンです。

| アカウント | プライベートゾーン | 例 |
|--|--|--|
| prd | `internal.example.com` | `db.internal.example.com` |
| stg | `internal.stg.example.com` | `db.internal.stg.example.com` |
| dev | `internal.dev.example.com` | `db.internal.dev.example.com` |

**メリット**: ゾーン名が一意なので混乱しにくい。将来的に複数 VPC やオンプレミスから横断的に名前解決させる構成にも拡張しやすい。

**デメリット**: 環境ごとにアプリケーションの接続先設定を変える必要がある。

#### パターン2: 同じゾーン名を環境ごとに作成

各アカウントで同じプライベートゾーン名を使い、異なる VPC に関連付けるパターンです。

| アカウント | プライベートゾーン | 関連付け VPC | レコード例 |
|--|--|--|--|
| prd | `internal.example.com` | prd-vpc | `db.internal.example.com → 10.0.1.50` |
| stg | `internal.example.com` | stg-vpc | `db.internal.example.com → 10.1.1.50` |
| dev | `internal.example.com` | dev-vpc | `db.internal.example.com → 10.2.1.50` |

**メリット**: アプリケーションの接続先設定を環境間で共通化できる。環境変数でエンドポイントを切り替える必要がない。

**デメリット**: 将来的に複数 VPC やオンプレミスから横断的に名前解決させる場合、同名ゾーンが設計上の制約や混乱の原因になりやすい。

### スプリットビュー DNS の落とし穴

パターン2のように、パブリックゾーンと同名の PHZ を作る構成は**スプリットビュー DNS** と呼ばれます。一見シンプルに見えますが、VPC 内部での名前解決順序に起因する落とし穴があります。

Route53 が VPC 内の DNS クエリを解決する際の流れは以下のとおりです。

1. リクエストのドメインに完全一致する PHZ を探す
2. 完全一致した場合、そのゾーン内のレコードを返す
3. 完全一致しない場合、サブドメインを左から順に切り離して一致する PHZ を探す
4. ドメインが一致したゾーン内のレコードを返す
5. **どの PHZ にもドメインが一致しない場合のみ**、パブリック DNS リゾルバに転送する

ここで問題になるのは**ステップ4**です。PHZ のドメインが一致しても、クエリ対象のレコードがそのゾーンに存在しない場合、Route53 は**パブリックゾーンにフォールバックせず `NXDOMAIN` を返します**。

具体例を挙げます。

- パブリックゾーン `example.com` に `www.example.com` の A レコードがある
- PHZ `example.com`（同名）には `proxy.example.com` のレコードだけがある
- VPC 内から `www.example.com` にアクセスすると、PHZ にドメイン `example.com` が一致するため PHZ 内を探索 → レコードが見つからない → **`NXDOMAIN`**

パブリックゾーンには `www.example.com` が登録されているのに、VPC 内部からだけアクセスできないという状況になります。回避するにはパブリックゾーンのレコードを PHZ にも複製する必要がありますが、管理が煩雑になります。

### おすすめの運用方針: パブリックとプライベートでゾーン名を分ける

上記の落とし穴を踏まえると、**PHZ にはパブリックゾーンとは別のドメイン名を使う**のが実務上安全です。

```
パブリック:   example.com           → 外部公開用
プライベート: internal.example.com  → VPC 内部用（proxy, DB 等）
```

この構成であれば、VPC 内から `www.example.com` へのアクセスはパブリック DNS にそのまま転送されます。プライベートゾーンの存在がパブリック側の名前解決に影響を与えることがなく、意図しない `NXDOMAIN` を避けられます。

プライベートゾーンの命名は一度決めれば規則的に運用するだけなので、大きな負担にはなりません。スプリットビュー DNS は ACM のドメイン検証やパブリックゾーンとのレコード同期など考慮事項が増えるため、明確な理由がない限り避けた方が無難です。

#### パターン3: 共有ゾーン + クロスアカウント関連付け

共通のプライベートゾーンを1つのアカウント（例: ネットワーク管理アカウント）に作成し、各環境の VPC にクロスアカウントで関連付けるパターンです。

**メリット**: 共有サービス（例: 踏み台サーバー、監視基盤）の名前解決を一元管理できる。

**デメリット**: 各環境固有のレコードは別途環境別ゾーンが必要。権限管理が複雑になる。

### クロスアカウントでの PHZ 関連付け

異なるアカウントの VPC に PHZ を関連付けるには、以下の手順が必要です。

1. **PHZ 所有アカウント**: `CreateVPCAssociationAuthorization` で対象 VPC への関連付けを許可
2. **VPC 所有アカウント**: `AssociateVPCWithHostedZone` で関連付けを実行
3. **PHZ 所有アカウント**: 関連付け完了後、`DeleteVPCAssociationAuthorization` で許可を削除（セキュリティ上推奨）

```bash
# PHZ 所有アカウント（例: prd）で許可を作成
aws route53 create-vpc-association-authorization \
  --hosted-zone-id Z1234567890 \
  --vpc VPCRegion=ap-northeast-1,VPCId=vpc-stg12345

# VPC 所有アカウント（例: stg）で関連付けを実行
aws route53 associate-vpc-with-hosted-zone \
  --hosted-zone-id Z1234567890 \
  --vpc VPCRegion=ap-northeast-1,VPCId=vpc-stg12345

# PHZ 所有アカウント（例: prd）で許可を削除
aws route53 delete-vpc-association-authorization \
  --hosted-zone-id Z1234567890 \
  --vpc VPCRegion=ap-northeast-1,VPCId=vpc-stg12345
```

なお、PHZ に関連付けられた**最後の VPC は解除できません**。最後の VPC の関連付けを外したい場合は、先に別の VPC を関連付けるか、不要であればホストゾーン自体を削除します。

### Route53 Resolver と組み合わせる場合

オンプレミスや他のクラウドとのハイブリッド環境では、Route53 Resolver の Inbound / Outbound エンドポイントを使って DNS クエリを転送できます。

| コンポーネント | 方向 | 用途 |
|--|--|--|
| Inbound Endpoint | オンプレ → VPC | オンプレから PHZ のレコードを解決 |
| Outbound Endpoint | VPC → オンプレ | VPC からオンプレの DNS サーバーへ転送 |
| Resolver Rule | — | 転送先とドメインのマッピング |

Resolver Rule は RAM（Resource Access Manager）を使って他のアカウントと共有できます。これにより、**オンプレ向けのアウトバウンド転送**では各アカウントに個別の outbound endpoint を作らずに済む場合があります。一方で、**オンプレや他 VPC から PHZ を引かせる**用途では inbound endpoint と PHZ の関連付けを別途設計する必要があります。

## 設計判断のポイント

パブリック・プライベートを横断して、設計時に考慮すべきポイントをまとめます。

### ゾーン分割の判断基準

| 観点 | パブリック | プライベート |
|--|--|--|
| 環境分離の必要性 | **高い** — 権限分離・影響範囲の限定 | **中〜高い** — VPC 境界で自然に分離されるが、共有サービスは要検討 |
| 推奨パターン | サブドメイン委任 | パターン2（同一ゾーン名）が多くの場合シンプル |
| 環境横断で名前解決させる場合 | — | パターン1（環境別ゾーン名）で名前空間の曖昧さを避けやすい |
| 共有サービスがある場合 | — | パターン3（クロスアカウント共有）を追加 |

### よくある構成例

実務でよく見る組み合わせは以下の構成です。

**パブリック**: サブドメイン委任で環境分離

```
prd: example.com        → prd アカウント
stg: stg.example.com    → stg アカウント
dev: dev.example.com    → dev アカウント
```

**プライベート**: 同一ゾーン名 + 共有ゾーン

```
各環境: internal.example.com   → 各アカウントの VPC に関連付け（環境固有リソース）
共通:   shared.example.com     → 全環境の VPC にクロスアカウント関連付け（共有リソース）
```

この構成であれば、アプリケーションから見た接続先は全環境で `db.internal.example.com` のように統一でき、環境変数による切り替えが不要になります。

## まとめ

- **パブリック DNS** はサブドメイン委任で環境分離するのが、マルチアカウント環境では推奨
- **プライベート DNS** は VPC 境界で自然に分離されるが、共有サービスの名前解決にはクロスアカウント関連付けが必要
- 環境横断で名前解決させる設計では、同名のプライベートゾーンが制約になりやすい
- PHZ のクロスアカウント関連付けは許可→関連付け→許可削除の3ステップ
- Route53 Resolver Rule は RAM で共有できるが、削減できるのは主に outbound endpoint。PHZ を引かせるには inbound endpoint と関連付け設計も必要
- パブリック・プライベートの設計は独立して考えず、**命名規則を揃えて全体で一貫性を持たせる**ことが重要

## 参考リンク

- [Creating a subdomain that uses Amazon Route 53 as the DNS service](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html)
- [Working with private hosted zones - Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-private.html)
- [Considerations when working with a private hosted zone - Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zone-private-considerations.html)
- [Associating an Amazon VPC and a private hosted zone that you created with different AWS accounts](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zone-private-associate-vpcs-different-accounts.html)
- [Disassociating VPCs from a private hosted zone - Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zone-private-disassociate-vpcs.html)
- [Resolving DNS queries between VPCs and your network - Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html)
- [Sharing Route 53 Resolver rules with other AWS accounts - Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-rules-managing.html)
- [DNS attributes for your VPC - Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html)
- [Understanding Amazon DNS - Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/AmazonDNS-concepts.html)
