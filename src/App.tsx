import { useEffect, useRef, type RefObject } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "./usePageMeta.ts";
import { BOOKING_URL } from "./booking.ts";

function useReveal<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function ContactSection({ ref }: { ref: RefObject<HTMLElement | null> }) {
  return (
    <section id="contact" className="section" ref={ref}>
      <div className="contact-inner">
        <span className="section-label-en">Contact</span>
        <h2>お問い合わせ</h2>
        <p className="contact-text">
          初回のご相談は無料です。お気軽にお問い合わせください。
        </p>
        <a href={BOOKING_URL} className="contact-button">
          <span>無料相談を予約する</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <div className="trust-badges">
          <span className="trust-badge">初回相談無料</span>
          <span className="trust-badge">NDA対応可</span>
          <span className="trust-badge">リモート対応</span>
        </div>
      </div>
    </section>
  );
}

function App() {
  usePageMeta("", "株式会社団野ソフトウェア - AWS / GCP / Azure のクラウドインフラ設計・構築から運用最適化、アプリケーション開発まで。", "/");

  const aboutRef = useReveal<HTMLElement>();
  const credentialsRef = useReveal<HTMLElement>();
  const servicesRef = useReveal<HTMLElement>();
  const contactRef = useReveal<HTMLElement>();

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">Danno Software</p>
          <h1>
            <span className="hero-line">クラウドインフラと開発の</span>
            <span className="hero-line hero-line--delayed">技術パートナー</span>
          </h1>
          <div className="hero-rule" />
          <p className="hero-sub">
            AWS / GCP / Azure の設計・構築から運用最適化、
            <br />
            アプリケーション開発まで一貫して支援します。
          </p>
          <a href={BOOKING_URL} className="hero-cta">
            無料相談を予約する
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <p className="hero-trust">初回相談無料 / NDA対応可 / リモート対応</p>
        </div>
      </section>

      <section id="about" className="section" ref={aboutRef}>
        <div className="section-layout">
          <div className="section-label">
            <span className="section-label-en">About</span>
            <h2>会社概要</h2>
          </div>
          <div className="section-body">
            <dl className="about-list">
              <div className="about-row">
                <dt>会社名</dt>
                <dd>株式会社団野ソフトウェア</dd>
              </div>
              <div className="about-row">
                <dt>代表</dt>
                <dd>団野 優人</dd>
              </div>
              <div className="about-row">
                <dt>設立</dt>
                <dd>2024年</dd>
              </div>
              <div className="about-row">
                <dt>事業内容</dt>
                <dd>クラウドインフラ設計・構築 / クラウド運用・最適化 / アプリケーション開発 / 技術コンサルティング</dd>
              </div>
            </dl>
            <Link to="/about" className="services-more" style={{ marginTop: 32 }}>
              <span>詳しく見る</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section id="credentials" className="section section-alt" ref={credentialsRef}>
        <div className="section-layout">
          <div className="section-label">
            <span className="section-label-en">Credentials</span>
            <h2>実績・資格</h2>
          </div>
          <div className="section-body">
            <div className="cred-numbers">
              <div className="cred-number-item">
                <span className="cred-number">8</span>
                <span className="cred-number-unit">年</span>
                <span className="cred-number-label">インフラ実務経験</span>
              </div>
              <div className="cred-number-item">
                <span className="cred-number">23</span>
                <span className="cred-number-unit">件</span>
                <span className="cred-number-label">保有資格</span>
              </div>
              <div className="cred-number-item">
                <span className="cred-number">3</span>
                <span className="cred-number-unit">社</span>
                <span className="cred-number-label">対応クラウド</span>
              </div>
            </div>
            <div className="cred-certs">
              <div className="cred-group">
                <h3>AWS</h3>
                <ul>
                  <li>Solutions Architect Professional</li>
                  <li>DevOps Engineer Professional</li>
                  <li>Solutions Architect Associate</li>
                  <li>Developer Associate</li>
                </ul>
              </div>
              <div className="cred-group">
                <h3>Google Cloud</h3>
                <ul>
                  <li>Professional Cloud Architect</li>
                </ul>
              </div>
              <div className="cred-group">
                <h3>Microsoft Azure</h3>
                <ul>
                  <li>Azure Fundamentals</li>
                  <li>Azure AI Fundamentals</li>
                  <li>Security, Compliance, and Identity Fundamentals</li>
                </ul>
              </div>
              <div className="cred-group">
                <h3>Linux / インフラ</h3>
                <ul>
                  <li>LinuC Level 1 / 2 / 3（仮想化・セキュリティ・異種混在環境）</li>
                  <li>CompTIA Server+</li>
                </ul>
              </div>
              <div className="cred-group">
                <h3>その他</h3>
                <ul>
                  <li>Oracle Master Bronze / Silver</li>
                  <li>JDLA Deep Learning for General</li>
                  <li>Python 3 エンジニア認定（基礎・データ分析）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section" ref={servicesRef}>
        <div className="section-layout">
          <div className="section-label">
            <span className="section-label-en">Services</span>
            <h2>事業内容</h2>
          </div>
          <div className="section-body">
            <div className="services-grid">
              <article className="service-card">
                <span className="service-index">01</span>
                <h3>クラウドインフラ設計・構築</h3>
                <p>
                  AWS / GCP / Azure の設計・構築からIaC導入、ネットワーク・セキュリティ設計まで一貫して対応します。
                </p>
              </article>
              <article className="service-card">
                <span className="service-index">02</span>
                <h3>クラウド運用・最適化</h3>
                <p>
                  コスト分析、監視基盤の整備、運用改善など、既存環境をより効率的に保つための支援を行います。
                </p>
              </article>
              <article className="service-card">
                <span className="service-index">03</span>
                <h3>アプリケーション開発</h3>
                <p>
                  Webアプリケーションの設計・開発から、AIツールを活用したプロトタイプの素早い構築まで対応します。
                </p>
              </article>
              <article className="service-card">
                <span className="service-index">04</span>
                <h3>技術コンサルティング</h3>
                <p>
                  アーキテクチャレビュー、技術選定、チームへのナレッジ共有など、技術的な意思決定を支援します。
                </p>
              </article>
              <Link to="/services" className="services-more">
                <span>詳しく見る</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContactSection ref={contactRef} />
    </>
  );
}

export default App;
