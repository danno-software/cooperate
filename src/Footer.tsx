import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">株式会社団野ソフトウェア</Link>
          <p className="footer-desc">
            クラウドインフラと開発の技術パートナー
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <p className="footer-col-title">ページ</p>
            <nav className="footer-nav">
              <Link to="/about">会社概要</Link>
              <Link to="/services">事業内容</Link>
              <Link to="/blog">ブログ</Link>
            </nav>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">お問い合わせ</p>
            <div className="footer-nav">
              <a href="mailto:yuto7924@gmail.com?subject=お問い合わせ&body=【お名前】%0A%0A【ご相談内容】%0A">
                yuto7924@gmail.com
              </a>
              <span className="footer-address">大阪市北区梅田1-2-2</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Danno Software</p>
      </div>
    </footer>
  );
}

export default Footer;
