---
title: Azure Database for MySQL を 8.0 から 8.4 にアップグレードした話
date: 2026-03-19
description: Azure Database for MySQL Flexible Server の 8.0 → 8.4 アップグレードを、AIを活用した検証スクリプトで安全に進めたアプローチを紹介します。
tags: Azure, MySQL, Flexible Server, アップグレード, AI活用
---

## はじめに

MySQL 8.0 Community Edition は 2026年4月30日に community support が終了予定です。Azure Database for MySQL Flexible Server でも 8.0 はその後に Extended Support の対象となるため、8.4 へのアップグレードを検討している方も多いのではないでしょうか。

Azure 利用者にとって重要なのは、これは単なる「サポート期限」の話ではなく、**追加コストの話でもある**ことです。現行の Microsoft Learn では、MySQL 8.0 の Azure Standard Support は 2026年12月31日まで、**有償の Extended Support は 2027年1月1日開始予定**と案内されています。つまり、8.0 を使い続けると、いずれ延長サポート料金の対象になります。

なお、以前の案内では MySQL 8.0 の Extended Support 課金開始日は 2026年6月1日予定とされていましたが、2026年3月の更新で **2027年1月1日へ延長**されています。古い通知を見ている場合は、この日付差分に注意が必要です。

今回、クライアントの stg 環境で 8.0 → 8.4 のアップグレードを実施しました。この記事では、実際のアップグレード作業そのものよりも、**どういう考え方で検証を進めたか**にフォーカスして紹介します。

> **注意**: 本記事の内容は特定の環境での結果です。MySQL のアップグレードは環境ごとに影響が異なります。必ずご自身の環境で検証を行ってください。
>
> Azure 公式では、Read Replica の先行アップグレード、XA トランザクションの解消、MySQL Shell Upgrade Checker の実行、アプリケーションの回帰テストが推奨されています。本記事はそれらの前提を踏まえた上で、さらに as-is 検証で何が変わるかを確認した記録です。

## 検証の方針: まず「そのまま上げてみる」

アップグレードの検証というと、事前に一つひとつ互換性を潰してから慎重にアップグレードする、というアプローチを取りがちです。

今回は逆のアプローチを取りました。

1. **as-is検証**: バックアップから検証用サーバーを作り、**何も手を加えずにアップグレード**する
2. **差分を確認**: アップグレード前後のスナップショットを比較し、何が変わったかを確認する
3. **対応要否を判断**: 変わった部分について、対応が必要かどうかを分類する

なぜこの順番かというと、今回の Azure Database for MySQL Flexible Server では、**アップグレード時に Azure 側で吸収される変更が想像以上に多かった**からです。事前に広く手を動かす前に、「今回の環境では何が自動で処理され、何が手動対応になるのか」を先に把握した方が効率的でした。

## AIを使ったチェックスクリプトの作成

検証にあたって、アップグレード前後のチェックを自動化するスクリプトを作成しました。ここで活躍したのが **Claude Code** と **Codex** です。

### 公式ドキュメント4本をインプットに

MySQL と Azure の公式ドキュメントから、アップグレード時に確認すべき項目を洗い出しました。

- [MySQL 8.4 のリリースノート（What Is New）](https://dev.mysql.com/doc/refman/8.4/en/mysql-nutshell.html)
- [MySQL 8.0 → 8.4 アップグレードガイド](https://dev.mysql.com/doc/refman/8.4/en/upgrading-from-previous-series.html)
- [Azure の MySQL アップグレード手順](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/how-to-upgrade)
- [Azure 公式ブログのアップグレードガイド](https://techcommunity.microsoft.com/blog/adformysql/guide-to-upgrade-azure-database-for-mysql-from-8-0-to-8-4/4493669)

これらのドキュメントを Claude Code に読ませながら、チェック項目を網羅的にリストアップしました。

### Claude Code で作り、Codex でレビュー

スクリプトの作成は以下の流れで進めました。

- **Claude Code** でチェックスクリプトのベースを作成。公式ドキュメントの内容をもとに、58項目のチェックを自動実行するシェルスクリプトを生成
- **Codex** にスクリプトをレビューさせ、抜け漏れや誤りがないかをチェック
- さらに Claude Code で修正、という**AIどうしのクロスレビュー**を繰り返す

人間がゼロから58項目のチェックスクリプトを書くと相当な工数がかかりますが、AIを使うことで短期間で網羅的なスクリプトを作ることができました。

## 何をチェックしたか

スクリプトでは大きく3つの観点でチェックしています。

### 1. アップグレード互換性チェック（58項目）

公式ドキュメントに記載されている互換性に関わる項目を網羅的にチェックしました。

- **認証**: `mysql_native_password` を使っているユーザーの有無
- **削除済み変数**: 8.4 で削除されたシステム変数を使用していないか
- **SQL Mode**: 非互換な SQL Mode が設定されていないか
- **スキーマ**: 外部キーの文字セット不一致、非 InnoDB テーブル、空間インデックスの問題など
- **Azure 固有**: SKU、HA構成、Read Replica の互換性
- **MySQL Shell Upgrade Checker**: MySQL 公式の互換性チェックツールの実行

各項目に対して OK / NG / INFO / SKIP を判定し、CSV で出力する形にしました。

### 2. スナップショット（22カテゴリ）

アップグレード前後で**同じ SQL を実行し、出力を diff で比較**する仕組みです。

- バージョン情報、データベース一覧、テーブル統計
- 全テーブルの行数、全カラム定義、全インデックス定義、全外部キー制約
- InnoDB / TempTable の設定値
- 認証プラグイン、TLS 設定、optimizer_switch
- ビュー / ストアドプロシージャ / トリガー / イベントの定義ハッシュ

データの整合性からサーバー設定まで、アップグレードで「何が変わって何が変わらなかったか」を正確に把握できるようにしました。

### 3. エラーログの比較

アップグレード前後のエラーログを比較し、新たに出現したエラーや警告を分類しました。

- 8.0 から出ていたもの（アップグレードと無関係）
- 8.4 で新規に出たもの（アップグレード起因）
- 8.0 で出ていて 8.4 で消えたもの

## as-is検証でわかったこと

検証用サーバーを作成し、**何も手を加えずに** 8.0 → 8.4 にアップグレードした結果、以下のことがわかりました。

### 今回の環境で Azure が自動で吸収してくれたこと

- **削除済みシステム変数**: 8.4 で削除された10件の変数は、Azure が自動的に処理
- **InnoDB / TempTable のデフォルト値変更**: 8.4 の新しいデフォルト値に自動で切り替え
- **Azure 管理ユーザーの認証プラグイン**: `mysql_native_password` → `caching_sha2_password` に自動移行
- **MySQL Shell Upgrade Checker のエラー15件**: 全て Azure が自動解消

### データ整合性

スナップショットの前後比較で、**データに関わる差分はゼロ**でした。

- テーブル数、インデックス数、オブジェクト数: 全て一致
- カラム定義、インデックス定義、外部キー制約: 全て一致
- 行数: 一致

### アップグレード後に対応した方がいい項目

- アプリケーションユーザーの認証プラグインを `caching_sha2_password` に移行（将来のバージョンで `mysql_native_password` が削除予定のため）

### 対応不可の項目（Azure 側の問題）

Azure の system-default 設定に起因する Warning がいくつか出ましたが、ユーザー側では対応できないものでした。これらは「想定内のログ」として本番手順に記載しました。

## 検証の結論

**今回の環境では、アップグレード前に必須だったアプリケーション修正やスキーマ修正はありませんでした。** as-is で上げても致命的な差分は出ず、Azure 側で吸収された変更が多いことを確認できました。

もちろん、これは今回の環境での結果です。利用している MySQL の機能やアプリケーションの構成によっては、事前対応が必要になるケースもあります。Azure 公式が案内している事前チェックや回帰テストは、引き続き実施前提で考えるべきです。

ただ、「まず上げてみて差分を確認する」というアプローチを取ることで、**本当に対応が必要な項目だけに集中**でき、検証を効率的に進めることができました。

## まとめ

- MySQL 8.0 Community Edition のサポート終了に加え、Azure では将来的に Extended Support の追加料金も発生するため、早めの検証開始がおすすめ
- 検証は「事前に全部潰す」よりも、**「まず上げてみて差分を確認する」** 方が効率的
- AIを活用すれば、網羅的なチェックスクリプトを短期間で作成できる。**Claude Code で作り、Codex でレビュー**するクロスレビューが有効
- 今回の Azure Database for MySQL Flexible Server では、多くの互換性の問題が Azure 側で吸収された

アップグレードを検討されている方の参考になれば幸いです。

## 参考リンク

- [Version Support Policy - Azure Database for MySQL](https://learn.microsoft.com/en-us/azure/mysql/concepts-version-policy)
- [Major Version Upgrade - Azure Database for MySQL](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/how-to-upgrade)
- [Major Version Upgrade FAQ - Azure Database for MySQL](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/how-to-upgrade-faq)
- [Azure Database for MySQL Flexible Server September 2025 release notes](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/release-notes/september-2025)
- [MySQL 8.4 Reference Manual: What Is New in MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/mysql-nutshell.html)
- [MySQL 8.4 Reference Manual: Upgrading from MySQL 8.0 to 8.4](https://dev.mysql.com/doc/refman/8.4/en/upgrading-from-previous-series.html)
- [Guide to upgrade Azure Database for MySQL from 8.0 to 8.4](https://techcommunity.microsoft.com/blog/adformysql/guide-to-upgrade-azure-database-for-mysql-from-8-0-to-8-4/4493669)
