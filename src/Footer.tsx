import { Link } from "react-router-dom";
import { BOOKING_URL } from "./booking.ts";

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
              <a href={BOOKING_URL}>
                無料相談を予約する
              </a>
              <a href="mailto:yuto7924@gmail.com">
                yuto7924@gmail.com
              </a>
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
