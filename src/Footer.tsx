function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">株式会社団野ソフトウェア</span>
        <p>&copy; {new Date().getFullYear()} Danno Software</p>
      </div>
    </footer>
  );
}

export default Footer;
