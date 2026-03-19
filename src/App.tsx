import { useEffect, useRef, type RefObject } from "react";
import { Link } from "react-router-dom";
import "./App.css";

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
          お仕事のご依頼・ご相談はお気軽にどうぞ。
        </p>
        <a
          href="mailto:yuto7924@gmail.com?subject=お問い合わせ"
          className="contact-button"
        >
          <span>メールで問い合わせる</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}

function App() {
  const aboutRef = useReveal<HTMLElement>();
  const servicesRef = useReveal<HTMLElement>();
  const contactRef = useReveal<HTMLElement>();

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo">
            株式会社団野ソフトウェア
          </a>
          <nav className="nav">
            <a href="#about">概要</a>
            <a href="#services">事業</a>
            <a href="#contact">お問い合わせ</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">Danno Software</p>
          <h1>
            <span className="hero-line">ソフトウェア開発で、</span>
            <span className="hero-line hero-line--delayed">ビジネスを前へ。</span>
          </h1>
          <div className="hero-rule" />
          <p className="hero-sub">
            Webアプリケーション開発・システム設計を通じて
            <br />
            お客様の課題解決をサポートします。
          </p>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
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
                <dd>2025年</dd>
              </div>
              <div className="about-row">
                <dt>事業内容</dt>
                <dd>ソフトウェア開発・技術コンサルティング</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section id="services" className="section section-alt" ref={servicesRef}>
        <div className="section-layout">
          <div className="section-label">
            <span className="section-label-en">Services</span>
            <h2>事業内容</h2>
          </div>
          <div className="section-body">
            <div className="services-grid">
              <article className="service-card">
                <span className="service-index">01</span>
                <h3>クラウドインフラ構築・IaC導入</h3>
                <p>
                  AWS / GCP / Azure のインフラ設計から、Terraform・Bicepによるコード管理の導入まで支援します。
                </p>
              </article>
              <article className="service-card">
                <span className="service-index">02</span>
                <h3>ネットワーク設計</h3>
                <p>
                  VPC・VNet設計など、セキュアで拡張性のあるクラウドネットワークを構築します。
                </p>
              </article>
              <article className="service-card">
                <span className="service-index">03</span>
                <h3>AIを活用したプロトタイプ開発</h3>
                <p>
                  Claude CodeやCodexを活用し、Webアプリのモック・プロトタイプを素早く作成します。
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

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-logo">株式会社団野ソフトウェア</span>
          <p>&copy; {new Date().getFullYear()} Danno Software</p>
        </div>
      </footer>
    </>
  );
}

export default App;
