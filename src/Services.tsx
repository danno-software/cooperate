import { usePageMeta } from "./usePageMeta.ts";

function Services() {
  usePageMeta(
    "事業内容",
    "クラウドインフラ構築・IaC導入、ネットワーク設計、AIプロトタイプ開発、クラウドコスト最適化。株式会社団野ソフトウェア。"
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
              <h2>クラウドインフラ構築・IaC導入</h2>
            </div>
            <div className="service-detail-body">
              <p>
                手動で管理されているクラウド環境を、Terraform や Bicep を用いてコードとして管理できる状態へ移行します。
                インフラの変更履歴が残り、再現性が高まることで、運用コストの削減と障害リスクの低減を実現します。
              </p>
              <div className="service-detail-tags">
                <h3>対応クラウド・ツール</h3>
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
                  <li>既存環境のコード化（Infrastructure as Code 導入）</li>
                  <li>新規クラウド環境の設計・構築</li>
                  <li>マルチクラウド構成の設計</li>
                  <li>CI/CD パイプラインとの連携</li>
                </ul>
              </div>
            </div>
          </article>

          <article className="service-detail-card">
            <div className="service-detail-header">
              <span className="service-index">02</span>
              <h2>ネットワーク設計</h2>
            </div>
            <div className="service-detail-body">
              <p>
                クラウド上のネットワーク設計を、セキュリティと拡張性を両立する形で構築します。
                VPC / VNet の設計からサブネット分割、ファイアウォールルールの策定まで対応します。
              </p>
              <div className="service-detail-tags">
                <h3>対応技術</h3>
                <ul className="tag-list">
                  <li>AWS VPC</li>
                  <li>Azure VNet</li>
                  <li>GCP VPC</li>
                  <li>サブネット設計</li>
                  <li>セキュリティグループ</li>
                </ul>
              </div>
              <div className="service-detail-scope">
                <h3>支援内容</h3>
                <ul>
                  <li>VPC / VNet のアーキテクチャ設計</li>
                  <li>サブネット分割とルーティング設計</li>
                  <li>セキュリティグループ・NSG の設計</li>
                  <li>VPN / ピアリング接続の構築</li>
                </ul>
              </div>
            </div>
          </article>

          <article className="service-detail-card">
            <div className="service-detail-header">
              <span className="service-index">03</span>
              <h2>AIを活用したプロトタイプ開発</h2>
            </div>
            <div className="service-detail-body">
              <p>
                Claude CodeやCodexなどのAIツールを活用し、Webアプリケーションのモック・プロトタイプを素早く作成します。
                アイデアの検証やデモ用の画面を短期間で形にしたい場合に最適です。
              </p>
              <div className="service-detail-tags">
                <h3>活用ツール</h3>
                <ul className="tag-list">
                  <li>Claude Code</li>
                  <li>Codex</li>
                  <li>React</li>
                  <li>TypeScript</li>
                </ul>
              </div>
              <div className="service-detail-scope">
                <h3>支援内容</h3>
                <ul>
                  <li>Webアプリケーションのモック・プロトタイプ作成</li>
                  <li>アイデア検証用のデモ画面構築</li>
                  <li>AIツールを活用した高速な画面実装</li>
                </ul>
              </div>
            </div>
          </article>

          <article className="service-detail-card">
            <div className="service-detail-header">
              <span className="service-index">04</span>
              <h2>クラウドコスト最適化</h2>
            </div>
            <div className="service-detail-body">
              <p>
                既存のアプリケーションコードやインフラ構成を調査し、コストのボトルネックを特定します。
                不要なリソースの整理やアーキテクチャの見直しを通じて、クラウド利用料の削減を実現します。
              </p>
              <div className="service-detail-tags">
                <h3>対応クラウド</h3>
                <ul className="tag-list">
                  <li>AWS</li>
                  <li>Google Cloud</li>
                  <li>Azure</li>
                </ul>
              </div>
              <div className="service-detail-scope">
                <h3>支援内容</h3>
                <ul>
                  <li>アプリケーションコード・設定の調査によるボトルネック特定</li>
                  <li>未使用・過剰スペックなリソースの洗い出しと整理</li>
                  <li>リザーブドインスタンス・Savings Plans の提案</li>
                  <li>インフラ構成の見直しによるコスト削減</li>
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
      </section>
    </>
  );
}

export default Services;
