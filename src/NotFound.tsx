import { Link } from "react-router-dom";
import { usePageMeta } from "./usePageMeta.ts";

function NotFound() {
  usePageMeta("ページが見つかりません", "");

  return (
    <section className="not-found">
      <p className="not-found-code not-found-fadein">404</p>
      <h1 className="not-found-fadein not-found-fadein--d1">ページが見つかりません</h1>
      <p className="not-found-text not-found-fadein not-found-fadein--d2">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link to="/" className="contact-button not-found-fadein not-found-fadein--d3">
        <span>トップページへ</span>
      </Link>
    </section>
  );
}

export default NotFound;
