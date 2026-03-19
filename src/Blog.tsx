import { Link } from "react-router-dom";
import { getAllPosts } from "./blogLoader.ts";
import { usePageMeta } from "./usePageMeta.ts";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function Blog() {
  usePageMeta("ブログ", "技術的な知見やお知らせを発信しています。株式会社団野ソフトウェア。");

  const posts = getAllPosts();

  return (
    <>
      <section className="blog-hero">
        <p className="hero-label">Blog</p>
        <h1>ブログ</h1>
        <p className="blog-hero-sub">
          技術的な知見やお知らせを発信しています。
        </p>
      </section>

      <section className="blog-list-section">
        <div className="blog-list-inner">
          {posts.map((post) => (
            <Link
              to={`/blog/${post.slug}`}
              key={post.slug}
              className="blog-card"
            >
              <time className="blog-card-date">{formatDate(post.date)}</time>
              <h2 className="blog-card-title">{post.title}</h2>
              <p className="blog-card-desc">{post.description}</p>
              <span className="blog-card-read">
                続きを読む
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
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}

          {posts.length === 0 && (
            <p className="blog-empty">まだ記事がありません。</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Blog;
