import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { getPostBySlug } from "./blogLoader.ts";
import "./App.css";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            株式会社団野ソフトウェア
          </Link>
          <nav className="nav">
            <Link to="/">トップ</Link>
            <Link to="/blog">ブログ</Link>
            <Link to="/#contact">お問い合わせ</Link>
          </nav>
        </div>
      </header>

      <article className="blog-post">
        <div className="blog-post-header">
          <time className="blog-post-date">{formatDate(post.date)}</time>
          <h1>{post.title}</h1>
        </div>
        <div
          className="blog-post-body"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      <div className="blog-post-back">
        <Link to="/blog" className="blog-back-link">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>記事一覧へ戻る</span>
        </Link>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-logo">株式会社団野ソフトウェア</span>
          <p>&copy; {new Date().getFullYear()} Danno Software</p>
        </div>
      </footer>
    </>
  );
}

export default BlogPost;
