import { marked } from "marked";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  html: string;
  toc: TocItem[];
}

const modules = import.meta.glob("/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  });
  return { meta, body: match[2] };
}

function toId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u3000-\u9fff\uff00-\uffef]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildPosts(): BlogPost[] {
  const renderer = new marked.Renderer();
  const toc: TocItem[] = [];

  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map((t) => t.raw).join("");
    const id = toId(text);
    if (depth === 2 || depth === 3) {
      toc.push({ id, text, level: depth });
    }
    return `<h${depth} id="${id}">${marked.parser(tokens, { async: false })}</h${depth}>`;
  };

  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = path.split("/").pop()!.replace(/\.md$/, "");
      const { meta, body } = parseFrontmatter(raw);
      toc.length = 0;
      const html = (marked.parse(body, { renderer, async: false }) as string).replace(
        /<table\b[^>]*>[\s\S]*?<\/table>/g,
        '<div class="blog-table-wrap">$&</div>'
      );
      return {
        slug,
        title: meta.title ?? slug,
        date: meta.date ?? "",
        description: meta.description ?? "",
        html,
        toc: [...toc],
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

const posts = buildPosts();

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
