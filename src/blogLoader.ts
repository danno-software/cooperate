import { marked } from "marked";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  html: string;
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

function buildPosts(): BlogPost[] {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = path.split("/").pop()!.replace(/\.md$/, "");
      const { meta, body } = parseFrontmatter(raw);
      return {
        slug,
        title: meta.title ?? slug,
        date: meta.date ?? "",
        description: meta.description ?? "",
        html: marked.parse(body, { async: false }) as string,
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
