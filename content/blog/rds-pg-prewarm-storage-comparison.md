---
title: RDS スナップショットリストア後の pg_prewarm を gp3 vs io2 で比較したら25倍速かった話
date: 2026-03-20
description: RDS PostgreSQL のスナップショットリストア後、pg_prewarm の所要時間がストレージタイプで劇的に変わります。gp3 vs io2 で計測した実データを公開します。
tags: AWS, RDS, PostgreSQL, pg_prewarm, パフォーマンス, マイグレーション
---

## はじめに

RDS のマイグレーション計画で「リストアにどれくらいかかるか」を聞かれて、正確に答えられるでしょうか。

スナップショットからのリストア自体はそこまで時間がかかりませんが、問題は**リストア直後のパフォーマンス**です。RDS のスナップショットリストアでは、データは EBS 上に即座に復元されるわけではなく、**初回アクセス時に S3 から読み込まれる（遅延ロード）** 仕組みになっています。

つまりリストア直後にアプリケーションを切り替えると、すべてのクエリが S3 からのフェッチを伴い、通常の数倍〜数十倍遅くなります。これを避けるために **pg_prewarm** でデータをメモリに載せるのですが、この prewarm 自体が遅延ロードの影響をモロに受けます。

今回、本番相当のデータ（数百 GB 規模）で pg_prewarm の所要時間をストレージタイプ別に計測しました。結果は想像以上に差が出たので共有します。

## 背景: なぜストレージタイプが問題になるのか

### RDS の遅延ロード

スナップショットからリストアした直後の RDS は、EBS 上にデータが存在しません。リストアは全データの S3 ダウンロード完了を待たず、**一部がロードされた時点で available** になります。残りはバックグラウンドで遅延ロードされ、アクセスされたブロックから優先的に S3 からフェッチされます。未アクセスのデータもバックグラウンドで徐々にロードされるため、時間経過でも解消されますが、リストア直後に本番トラフィックを流すのはリスクがあります。

なお、リストアの所要時間はデータ量に単純比例するわけではなく、AWS 基盤の状況にも左右されます。

通常運用では EBS のスループットがボトルネックになることは稀ですが、pg_prewarm のようにディスク全体をシーケンシャルに読み出す処理では、**EBS スループットが直接的なボトルネック**になります。

### なぜ pg_prewarm なのか

AWS の公式ドキュメントでは、lazy loading の影響を和らげる方法として `SELECT *` のような**フルテーブルスキャン**が案内されています。ただし、これだけではインデックスは温まりません。

また PostgreSQL のドキュメントを見ると、`SELECT count(*)` は index-only scan でヒープアクセスを省略できる場合があり、`VACUUM` も visibility map を使ってページをスキップできます。つまり「一度流せば全ブロックに触れるはず」という前提を置きにくい処理です。

一方 **pg_prewarm** は対象リレーションとブロック範囲を明示して読み込めるため、テーブルとインデックスを分けて**意図どおりに prewarm したい**今回の用途に向いていました。

実行時の注意点もいくつかあります。

- **テーブルとインデックスは個別に実行する必要がある** — テーブルの prewarm ではインデックスのブロックにはアクセスされない
- **全インスタンスで実行が必要** — 各インスタンスのバッファキャッシュは独立しているため、writer だけでは不十分です

| インスタンス | pg_prewarm 必要？ |
|--|--|
| ライター（プライマリ） | 必要 |
| リーダーインスタンス | 必要 |
| リードレプリカ | 必要 |
| クラスターエンドポイント | エンドポイントはライターへの接続口なので、ライターへの接続に使える |
- **リストア直後が最も効果的** — キャッシュがほぼ空の状態で実行するのがベスト。他のデータがキャッシュに載っている状態で実行すると、既存のキャッシュを追い出す可能性がある

### gp3 のスループット事情

RDS の gp3 には、あまり知られていない境界があります。

| | 400 GiB 未満 | 400 GiB 以上 |
|--|-------------|-------------|
| ボリューム構成 | 1 ボリューム | **4 ボリューム（ストライピング）** |
| ベースラインスループット | 125 MiB/s | **500 MiB/s** |
| ベースライン IOPS | 3,000 | **12,000** |

**400 GiB 以上でボリュームストライピングが有効化**され、ベースラインが 4 倍になります。400 GiB 未満では追加の IOPS / スループットを指定できません。なお、**Multi-AZ DB クラスターでは gp3 のスループット値は IOPS に応じて自動計算され、個別指定はできません**。

### 検討した選択肢

| | gp3 400 GiB 未満（現行） | gp3 400 GiB 以上 | io2（今回: 3,000 IOPS） |
|--|------------------------|-----------------|-----|
| スループット | 125 MiB/s | 500 MiB/s | **可変**（今回の構成では約 750 MiB/s 相当） |
| コスト | 低 | **微増** | **数倍〜** |
| 可逆性 | — | **不可逆（縮小不可）** | **可逆（gp3 に無停止で戻せる）** |

gp3 400 GiB 以上は微増のコストで 4 倍の性能になりコスパ最強ですが、**ストレージサイズの縮小はできない**ため不可逆です。一方 io2 はコストが高いですが、**gp3 への変更は無停止で可能**なため、移行時だけ一時的に使う運用ができます。

なお io1 と io2 はストレージ料金・IOPS 料金ともに同額ですが、io2 の方が性能面で優れているため、io1 を選ぶ理由はありません。

## 検証内容

### 環境

- **RDS**: マルチ AZ DB クラスター（writer / reader × 2）
- **エンジン**: PostgreSQL 16 系
- **ストレージ**: gp3（400 GiB 未満） / 比較対象の io2 は 3,000 IOPS
- **データ量**: テーブル + インデックスで合計約 180 GB

### 検証手順

1. 本番スナップショットからマルチ AZ DB クラスターをリストア
2. pg_prewarm 拡張を有効化
3. **テーブル prewarm** を実行。writer / read1 / read2 の各インスタンスで、対象 37 テーブルを**全並列実行**
4. **インデックス prewarm** を実行。`pg_indexes` から動的取得した一覧を、各インスタンスで**全並列実行**
5. gp3 と io2 の 2 パターンで実施

つまり、個々のテーブル / インデックスに出てくる elapsed は**単体実行時間ではなく、同時実行による競合を含んだ値**です。一方、移行作業の見積もりに使ったのは writer の**壁時計時間**です。

## 結果

### 全体サマリー（writer インスタンス）

以下は writer の**壁時計時間**です。

| | gp3（125 MiB/s） | io2（約 750 MiB/s 相当） | 倍率 |
|--|----------------|----------------|------|
| テーブル prewarm | **4 時間 28 分** | **10 分 42 秒** | **25 倍** |
| インデックス prewarm | **1 時間 1 分** | **3 分 48 秒** | **16 倍** |
| **合計（約 180 GB）** | **約 5 時間 30 分** | **約 14 分 30 秒** | **約 23 倍** |

**io2 にするだけで、5 時間半の作業が 15 分以下に短縮**されました。

### なぜインデックスの方が倍率が低いのか

テーブル（25 倍）に対してインデックス（16 倍）の改善幅が小さいのは、インデックスの方がランダム I/O の割合が高いためと考えられます。pg_prewarm はシーケンシャルリードが中心ですが、インデックスの B-tree 構造ではある程度のランダムアクセスが発生します。シーケンシャルリードではスループットの差がそのまま出る一方、**今回どちらも 3,000 IOPS で比較している**ため、ランダム I/O では IOPS が律速しやすく、差が縮まります。

### 最大テーブルの影響

特徴的だったのは、**全テーブルを同時に流しても**データの大半を占める 1 つの巨大テーブルが全体の所要時間を支配していたことです。gp3 では prewarm 全体のほぼ 100% をこのテーブルが占めていました。

125 MiB/s のスループット上限に対して S3 遅延ロードのオーバーヘッドが加わり、**理論値の約 20 倍**の時間がかかっています。一方 io2 では、約 750 MiB/s 相当のスループットが効いて同じテーブルでも大幅に短縮されました。

### 理論値 vs 実測値

EBS スループットだけで計算した理論値と実測値を比較します。

| | 理論値（EBS のみ） | 実測値 | 実測 / 理論 |
|--|------------------|--------|------------|
| gp3（125 MiB/s） | 約 24 分 | **約 5 時間 30 分** | **約 14 倍** |
| io2（約 750 MiB/s 相当） | 約 4 分 | **約 14 分 30 秒** | **約 4 倍** |

gp3 では理論値の 14 倍、io2 では 4 倍の時間がかかっています。どちらも S3 遅延ロードの影響を受けていますが、**スループットが高い方が遅延ロードの影響を相対的に吸収できている**ことがわかります。

## AWS サポートに確認したこと

今回の「io2 で移行して gp3 に戻す」運用が本当に成立するかを AWS サポートに確認しました。以下は**公式ドキュメントで確認できる事項**と、**Support Case ベースの運用メモ**を分けて整理します。

### ストレージタイプ変更は無停止

Multi-AZ DB クラスターの公式ドキュメントでは、**Allocated storage / Provisioned IOPS / Storage type の変更はいずれも downtime doesn't occur during this change** とされています。

一方で、一般の RDS DB instance ドキュメントには**ストレージサイズやタイプの変更開始後 6 時間は再変更できない**旨の記載があり、Support Case でも Multi-AZ DB クラスターで同趣旨の注意を受けました。ここは公式ドキュメントと Support の両方を見ながら、実施前に再確認するのが安全です。

### gp3 の 400 GiB 境界を跨ぐサイズ変更

RDS のストレージドキュメントでは、**1 ボリューム → 4 ボリューム**への変更時は Elastic Volumes ではなく新規ボリューム作成とデータ移行が走るため、I/O とスループットを大きく消費し、数時間かかることがあると説明されています。したがって、**400 GiB 境界を跨ぐ変更はピーク時間を避ける前提**で考えるのが無難です。これは公式ドキュメントからの推論です。

## 判断: 移行時だけ io2 に上げて戻す

結果と AWS サポートの回答を踏まえた判断です。

- **gp3 のまま移行**: prewarm に 5 時間半 → メンテナンスウィンドウに収まらない
- **gp3 400 GiB 以上に増量**: prewarm は大幅に短縮されるが、**不可逆**
- **io2 に一時変更**: prewarm 15 分、移行後に gp3 に戻せる → **採用**

具体的な運用フローは以下のとおりです。

1. 本番スナップショットから **io2 でリストア**
2. pg_prewarm で全インスタンスをウォームアップ（約 15 分）
3. アプリケーションの接続先を切り替え
4. 安定稼働を確認後、**io2 → gp3 へ無停止で変更**

io2 は月額が高いですが、移行後に gp3 に戻せるため**一時的なコスト増で済みます**。5 時間半のダウンタイムを 15 分に短縮できることを考えれば、十分にペイする選択です。

## まとめ

- RDS スナップショットリストア後の pg_prewarm は、**S3 遅延ロードがボトルネック**になる
- gp3（125 MiB/s）→ io2（約 750 MiB/s 相当）で **約 23 倍の高速化**
- 理論値（EBS スループットのみ）と実測値の乖離は、gp3 で 14 倍、io2 で 4 倍
- io2 は月額が高いが、**gp3 への変更は無停止で可能**なため、移行時だけ一時利用する運用が有効
- 約 180 GB のデータに対して、io2 なら **約 15 分で全テーブル・インデックスの prewarm が完了**

この手法はエンジンバージョンのアップグレードに限らず、**スナップショットリストアを伴う移行全般で有効**です。たとえば AWS も、Single-AZ deployment や既存の Multi-AZ deployment から **Multi-AZ DB クラスターへ移行する手段としてスナップショットリストア**を案内しています。このときも同じ遅延ロードが発生するため、io2 の一時利用は有力な選択肢になります。

マイグレーション計画でダウンタイムの見積もりに悩んでいる方は、ストレージタイプの一時変更を選択肢に入れてみてください。

## 参考リンク

- [Restoring to a DB instance - Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html)
- [Restoring from a snapshot to a Multi-AZ DB cluster - Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromMultiAZDBClusterSnapshot.Restoring.html)
- [Amazon RDS DB instance storage - Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html)
- [Settings for DB instances - Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ModifyInstance.Settings.html)
- [Creating a Multi-AZ DB cluster for Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/create-multi-az-db-cluster.html)
- [Modifying a Multi-AZ DB cluster for Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/modify-multi-az-db-cluster.html)
- [Migrating to a Multi-AZ DB cluster using a read replica - Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-migrating-to-with-read-replica.html)
- [Amazon RDS now supports io2 Block Express for consistent sub-millisecond latency and 99.999% durability](https://aws.amazon.com/about-aws/whats-new/2024/03/amazon-rds-io2-block-express-sub-millisecond-latency-99-999-durability/)
- [pg_prewarm - PostgreSQL Documentation](https://www.postgresql.org/docs/current/pgprewarm.html)
- [Index-Only Scans and Covering Indexes - PostgreSQL Documentation](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
- [Routine Vacuuming - PostgreSQL Documentation](https://www.postgresql.org/docs/current/routine-vacuuming.html)
