import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            株式会社団野ソフトウェア
          </Link>
          <nav className="nav">
            <Link to="/">トップ</Link>
            <Link to="/#contact">お問い合わせ</Link>
          </nav>
        </div>
      </header>

      <section className="services-hero">
        <p className="hero-label">Services</p>
        <h1>事業内容</h1>
        <p className="services-hero-sub">
          クラウドインフラからアプリケーション開発まで、<br />
          実務経験に基づいた技術支援を提供します。
        </p>
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
              <h2>Webアプリケーション開発</h2>
            </div>
            <div className="service-detail-body">
              <p>
                要件定義から設計・開発・運用まで、Webアプリケーションの構築をトータルでサポートします。
              </p>
              <div className="service-detail-tags">
                <h3>対応技術</h3>
                <ul className="tag-list">
                  <li>TypeScript</li>
                  <li>React</li>
                  <li>Node.js</li>
                </ul>
              </div>
              <div className="service-detail-scope">
                <h3>支援内容</h3>
                <ul>
                  <li>Webアプリケーションの新規開発</li>
                  <li>既存システムの改修・機能追加</li>
                  <li>フロントエンド・バックエンドの設計</li>
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

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-logo">株式会社団野ソフトウェア</span>
          <p>&copy; {new Date().getFullYear()} Danno Software</p>
        </div>
      </footer>
    </>
  );
}

export default Services;
