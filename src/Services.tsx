import { usePageMeta } from "./usePageMeta.ts";

function Services() {
  usePageMeta(
    "事業内容",
    "クラウドインフラ設計・構築、クラウド運用・最適化、アプリケーション開発、技術コンサルティング。株式会社団野ソフトウェア。",
    "/services"
  );

  return (
    <>
      <section className="services-hero">
        <p className="hero-label">Services</p>
        <h1>事業内容</h1>
        <p className="services-hero-sub">
          クラウドインフラからアプリケーション開発まで、<br />
          実務経験に基づいた技術支援を提供します。
        </p>
      </section>

      <section className="services-target">
        <div className="services-target-inner">
          <h2>こんな課題はありませんか？</h2>
          <ul className="target-list">
            <li>クラウド環境を手動で管理していて、属人化やミスが不安</li>
            <li>インフラ専任のエンジニアがおらず、設計・構築を任せたい</li>
            <li>採用が決まるまでの間、インフラまわりを外部に頼りたい</li>
            <li>クラウドの月額コストが高いが、どこを削ればいいかわからない</li>
            <li>新しいサービスを素早く形にして検証したい</li>
            <li>技術的な判断を相談できる相手がいない</li>
          </ul>
        </div>
      </section>

      <section className="services-strength">
        <div className="services-strength-inner">
          <h2>1人法人だからできること</h2>
          <div className="strength-grid">
            <div className="strength-item">
              <h3>伝言ゲームなし</h3>
              <p>窓口と作業者が同一人物。要件の認識ずれが起きません。</p>
            </div>
            <div className="strength-item">
              <h3>意思決定が速い</h3>
              <p>社内承認不要。相談から見積もり・着手まで最短で対応します。</p>
            </div>
            <div className="strength-item">
              <h3>柔軟な関わり方</h3>
              <p>スポットの技術相談から継続的な開発支援まで、規模を問わず対応できます。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services-detail">
        <div className="services-detail-inner">

          <article className="service-detail-card">
            <div className="service-detail-header">
              <span className="service-index">01</span>
              <h2>クラウドインフラ設計・構築</h2>
            </div>
            <div className="service-detail-body">
              <p>
                クラウド環境の設計・構築を、IaC（Infrastructure as Code）による再現性の高い形で提供します。
                ネットワーク設計やセキュリティ設計も含め、インフラ全体を一貫して対応します。
              </p>
              <div className="service-detail-tags">
                <h3>対応技術</h3>
                <ul className="tag-list">
                  <li>AWS</li>
                  <li>Google Cloud</li>
                  <li>Azure</li>
                  <li>Terraform</li>
                  <li>Bicep</li>
                </ul>
              </div>
              <div className="service-detail-scope">
                <h3>支援内容</h3>
                <ul>
                  <li>クラウド環境の設計・構築（新規・移行）</li>
                  <li>Terraform / Bicep によるIaC導入・既存環境のコード化</li>
                  <li>VPC / VNet 設計、サブネット分割、ルーティング設計</li>
                  <li>セキュリティグループ・IAM ポリシーの設計</li>
                  <li>マルチアカウント / マルチクラウド構成の設計</li>
                  <li>CI/CD パイプラインとの連携</li>
                </ul>
              </div>
            </div>
          </article>

          <article className="service-detail-card">
            <div className="service-detail-header">
              <span className="service-index">02</span>
              <h2>クラウド運用・最適化</h2>
            </div>
            <div className="service-detail-body">
              <p>
                稼働中のクラウド環境を対象に、コスト削減・監視強化・運用フロー改善を支援します。
                現状を調査したうえで、優先度の高い施策から着手します。
              </p>
              <div className="service-detail-tags">
                <h3>対応技術</h3>
                <ul className="tag-list">
                  <li>AWS</li>
                  <li>Google Cloud</li>
                  <li>Azure</li>
                  <li>CloudWatch</li>
                  <li>Datadog</li>
                </ul>
              </div>
              <div className="service-detail-scope">
                <h3>支援内容</h3>
                <ul>
                  <li>クラウド利用料の分析・コスト削減提案</li>
                  <li>未使用・過剰リソースの洗い出しと整理</li>
                  <li>リザーブドインスタンス・Savings Plans の検討</li>
                  <li>監視・アラート基盤の設計と導入</li>
                  <li>ログ収集・分析基盤の構築</li>
                  <li>運用手順の整備・自動化</li>
                </ul>
              </div>
            </div>
          </article>

          <article className="service-detail-card">
            <div className="service-detail-header">
              <span className="service-index">03</span>
              <h2>アプリケーション開発</h2>
            </div>
            <div className="service-detail-body">
              <p>
                Webアプリケーションの設計・開発を行います。
                AIツールを活用した高速なプロトタイピングから、本番運用を見据えた開発まで対応します。
              </p>
              <div className="service-detail-tags">
                <h3>対応技術</h3>
                <ul className="tag-list">
                  <li>React</li>
                  <li>TypeScript</li>
                  <li>Node.js</li>
                  <li>Python</li>
                  <li>Claude Code</li>
                </ul>
              </div>
              <div className="service-detail-scope">
                <h3>支援内容</h3>
                <ul>
                  <li>Webアプリケーションの設計・実装</li>
                  <li>AIツールを活用したプロトタイプの素早い構築</li>
                  <li>API 設計・バックエンド開発</li>
                  <li>既存アプリケーションの改修・機能追加</li>
                </ul>
              </div>
            </div>
          </article>

          <article className="service-detail-card">
            <div className="service-detail-header">
              <span className="service-index">04</span>
              <h2>技術コンサルティング</h2>
            </div>
            <div className="service-detail-body">
              <p>
                技術選定やアーキテクチャの意思決定を第三者の視点から支援します。
                特定の技術や製品に偏らない、実務経験に基づいた助言を提供します。
              </p>
              <div className="service-detail-tags">
                <h3>対応領域</h3>
                <ul className="tag-list">
                  <li>クラウドアーキテクチャ</li>
                  <li>技術選定</li>
                  <li>セキュリティ</li>
                  <li>DevOps</li>
                </ul>
              </div>
              <div className="service-detail-scope">
                <h3>支援内容</h3>
                <ul>
                  <li>既存アーキテクチャのレビュー・改善提案</li>
                  <li>技術選定・ツール選定の支援</li>
                  <li>チームへのナレッジ共有・ハンズオン支援</li>
                  <li>セキュリティ観点でのレビュー・助言</li>
                </ul>
              </div>
            </div>
          </article>

        </div>
      </section>

      <section className="services-cta">
        <p>まずはお気軽にご相談ください。</p>
        <a
          href="mailto:yuto7924@gmail.com?subject=お問い合わせ"
          className="contact-button"
        >
          <span>メールで問い合わせる</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <p className="contact-email">
          フォームから送信できない場合は{" "}
          <a href="mailto:yuto7924@gmail.com">yuto7924@gmail.com</a>{" "}
          までご連絡ください。
        </p>
      </section>
    </>
  );
}

export default Services;
