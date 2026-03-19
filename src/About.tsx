import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function About() {
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
            <Link to="/services">事業</Link>
            <Link to="/blog">ブログ</Link>
            <Link to="/#contact">お問い合わせ</Link>
          </nav>
        </div>
      </header>

      <section className="services-hero">
        <p className="hero-label">About</p>
        <h1>会社概要</h1>
      </section>

      <section className="about-detail">
        <div className="about-detail-inner">
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
            <div className="about-row">
              <dt>所在地</dt>
              <dd>東京都</dd>
            </div>
          </dl>
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

export default About;
