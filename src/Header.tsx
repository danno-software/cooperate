import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          株式会社団野ソフトウェア
        </Link>
        <button
          className={`hamburger${menuOpen ? " hamburger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav${menuOpen ? " nav--open" : ""}`}>
          <Link to="/about">概要</Link>
          <Link to="/services">事業</Link>
          <Link to="/blog">ブログ</Link>
          {isHome ? (
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              お問い合わせ
            </a>
          ) : (
            <a
              href="mailto:yuto7924@gmail.com?subject=お問い合わせ&body=【お名前】%0A%0A【ご相談内容】%0A"
              onClick={() => setMenuOpen(false)}
            >
              お問い合わせ
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
