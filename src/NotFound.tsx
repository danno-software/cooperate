import { Link } from "react-router-dom";
import { usePageMeta } from "./usePageMeta.ts";

function NotFound() {
  usePageMeta("ページが見つかりません", "");

  return (
    <section className="not-found">
      <p className="not-found-code">404</p>
      <h1>ページが見つかりません</h1>
      <p className="not-found-text">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link to="/" className="contact-button">
        <span>トップページへ</span>
      </Link>
    </section>
  );
}

export default NotFound;
