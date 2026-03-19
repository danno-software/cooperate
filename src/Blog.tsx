import { useEffect, useRef, useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "./blogLoader.ts";
import { usePageMeta } from "./usePageMeta.ts";

function useRevealAll(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(".page-reveal:not(.page-visible)");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("page-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function Blog() {
  usePageMeta("ブログ", "技術的な知見やお知らせを発信しています。株式会社団野ソフトウェア。", "/blog");

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const posts = getAllPosts();
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort(
    (a, b) => a.localeCompare(b, "ja")
  );
  const searchTerms = deferredQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.every((term) => post.searchText.includes(term));
    const matchesTag = activeTag === null || post.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const wrapperRef = useRevealAll([filteredPosts]);

  return (
    <div ref={wrapperRef}>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label">Blog</span>
          <div className="page-hero-line" />
          <h1>ブログ</h1>
          <p className="page-hero-sub">
            技術的な知見やお知らせを発信しています。
          </p>
        </div>
      </section>

      <section className="blog-list-section">
        <div className="blog-list-inner">
          <div className="blog-list-toolbar page-reveal">
            <div className="blog-list-summary">
              <p className="blog-list-label">Knowledge Base</p>
              <p className="blog-list-count">
                {filteredPosts.length} / {posts.length} 件の記事
              </p>
            </div>

            <label className="blog-search">
              <span className="blog-search-label">記事を検索</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Azure, MySQL, AI など"
              />
            </label>
          </div>

          {allTags.length > 0 && (
            <div className="blog-tag-filter page-reveal" aria-label="記事タグ">
              <button
                type="button"
                className={`blog-tag-chip${activeTag === null ? " is-active" : ""}`}
                onClick={() => setActiveTag(null)}
              >
                すべて
              </button>
              {allTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className={`blog-tag-chip${activeTag === tag ? " is-active" : ""}`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {filteredPosts.length > 0 ? (
            <div className="blog-grid">
              {filteredPosts.map((post, i) => (
                <Link
                  to={`/blog/${post.slug}`}
                  key={post.slug}
                  className="blog-card page-reveal"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="blog-card-meta">
                    <time className="blog-card-date">{formatDate(post.date)}</time>
                    <span className="blog-card-type">Article</span>
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-desc">{post.description}</p>
                  {post.tags.length > 0 && (
                    <div className="blog-card-tags">
                      {post.tags.map((tag) => (
                        <span key={tag} className="blog-card-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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
            </div>
          ) : (
            <p className="blog-empty">
              条件に一致する記事はまだありません。
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Blog;
