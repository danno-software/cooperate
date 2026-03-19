import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
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
        </nav>
      </div>
    </header>
  );
}

export default Header;
