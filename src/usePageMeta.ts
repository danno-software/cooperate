import { useEffect } from "react";

const SITE_URL = "https://danno-software.com";
const SITE_NAME = "株式会社団野ソフトウェア";
const DEFAULT_OG_IMAGE = `${SITE_URL}/ogp.png`;

function setMetaContent(selector: string, content: string) {
  const el = document.querySelector(selector);
  if (el) {
    el.setAttribute("content", content);
  }
}

function setOrCreateLink(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

export function usePageMeta(title: string, description: string, path?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    const url = path ? `${SITE_URL}${path}` : SITE_URL;

    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', fullTitle);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', url);
    setMetaContent('meta[property="og:type"]', path?.startsWith("/blog/") ? "article" : "website");
    setMetaContent('meta[property="og:image"]', DEFAULT_OG_IMAGE);

    setOrCreateLink("canonical", url);
  }, [title, description, path]);
}
