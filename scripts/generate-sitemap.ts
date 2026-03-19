/**
 * ビルド時に sitemap.xml を自動生成するスクリプト。
 * content/blog/*.md から個別記事の URL を取得し、静的ページと合わせて出力する。
 */
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const SITE_URL = "https://danno-software.com";
const BLOG_DIR = join(import.meta.dirname, "..", "content", "blog");
const OUT_PATH = join(import.meta.dirname, "..", "public", "sitemap.xml");

interface PageEntry {
  loc: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
}

// 静的ページ
const staticPages: PageEntry[] = [
  { loc: "/", changefreq: "monthly", priority: "1.0" },
  { loc: "/about", changefreq: "monthly", priority: "0.8" },
  { loc: "/services", changefreq: "monthly", priority: "0.8" },
  { loc: "/blog", changefreq: "weekly", priority: "0.8" },
];

// ブログ記事から slug と date を取得
function getBlogEntries(): PageEntry[] {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const raw = readFileSync(join(BLOG_DIR, file), "utf-8");
      const match = raw.match(/^---\n([\s\S]*?)\n---/);
      if (!match) return null;
      const meta: Record<string, string> = {};
      match[1].split("\n").forEach((line) => {
        const idx = line.indexOf(":");
        if (idx === -1) return;
        meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      });
      const slug = file.replace(/\.md$/, "");
      return {
        loc: `/blog/${slug}`,
        changefreq: "monthly",
        priority: "0.6",
        lastmod: meta.date || undefined,
      };
    })
    .filter((e): e is PageEntry => e !== null)
    .sort((a, b) => (b.lastmod ?? "").localeCompare(a.lastmod ?? ""));
}

function buildSitemap(entries: PageEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>
    <loc>${SITE_URL}${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const entries = [...staticPages, ...getBlogEntries()];
const xml = buildSitemap(entries);
writeFileSync(OUT_PATH, xml, "utf-8");
console.log(`sitemap.xml generated: ${entries.length} URLs`);
