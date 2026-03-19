import { useParams, Link, Navigate } from "react-router-dom";
import { getPostBySlug } from "./blogLoader.ts";
import { usePageMeta } from "./usePageMeta.ts";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  usePageMeta(
    post?.title ?? "記事が見つかりません",
    post?.description ?? ""
  );

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <article className="blog-post">
        <div className="blog-post-header">
          <time className="blog-post-date">{formatDate(post.date)}</time>
          <h1>{post.title}</h1>
        </div>
        {post.toc.length > 0 && (
          <nav className="blog-toc">
            <p className="blog-toc-title">目次</p>
            <ul>
              {post.toc.map((item) => (
                <li key={item.id} className={item.level === 3 ? "blog-toc-sub" : ""}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div
          className="blog-post-body"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      <section className="blog-post-cta">
        <p className="blog-post-cta-text">
          お仕事のご依頼・ご相談はお気軽にどうぞ。
        </p>
        <a href="/#contact" className="blog-post-cta-button">
          お問い合わせページへ
        </a>
        <p className="blog-post-cta-email">
          フォームから送信できない場合は{" "}
          <a href="mailto:yuto7924@gmail.com">yuto7924@gmail.com</a>{" "}
          までご連絡ください。
        </p>
      </section>

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
    </>
  );
}

export default BlogPost;
