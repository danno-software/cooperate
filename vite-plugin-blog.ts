import type { Plugin, ViteDevServer } from "vite";
import { marked } from "marked";
import { readFileSync, readdirSync, watch } from "node:fs";
import { join, basename } from "node:path";

function toId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u3000-\u9fff\uff00-\uffef]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseFrontmatter(raw: string) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: {} as Record<string, string>, body: raw };
  const meta: Record<string, string> = {};
  m[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  });
  return { meta, body: m[2] };
}

export default function blogPlugin(): Plugin {
  const virtualId = "virtual:blog-posts";
  const resolvedId = "\0" + virtualId;
  let root = process.cwd();

  function buildPosts() {
    const blogDir = join(root, "content/blog");
    let files: string[];
    try {
      files = readdirSync(blogDir).filter((f) => f.endsWith(".md"));
    } catch {
      return [];
    }

    const renderer = new marked.Renderer();

    return files
      .map((file) => {
        const raw = readFileSync(join(blogDir, file), "utf-8");
        const slug = basename(file, ".md");
        const { meta, body } = parseFrontmatter(raw);
        const tags = (meta.tags ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const toc: Array<{ id: string; text: string; level: number }> = [];
        renderer.heading = ({ tokens, depth }) => {
          const text = tokens.map((t) => t.raw).join("");
          const id = toId(text);
          if (depth === 2 || depth === 3) toc.push({ id, text, level: depth });
          return `<h${depth} id="${id}">${marked.parser(tokens, { async: false })}</h${depth}>`;
        };

        const html = (
          marked.parse(body, { renderer, async: false }) as string
        ).replace(
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
          searchText:
            `${meta.title ?? slug}\n${meta.description ?? ""}\n${tags.join(" ")}\n${body}`.toLowerCase(),
          tags,
        };
      })
      .sort((a, b) => (a.date > b.date ? -1 : 1));
  }

  return {
    name: "blog",
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id !== resolvedId) return;
      return `export const posts = ${JSON.stringify(buildPosts())};`;
    },
    configureServer(server: ViteDevServer) {
      const blogDir = join(root, "content/blog");
      watch(blogDir, (_event, filename) => {
        if (filename?.endsWith(".md")) {
          const mod = server.moduleGraph.getModuleById(resolvedId);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({ type: "full-reload" });
          }
        }
      });
    },
    handleHotUpdate({
      file,
      server,
    }: {
      file: string;
      server: ViteDevServer;
    }) {
      if (file.endsWith(".md") && file.includes("content/blog")) {
        const mod = server.moduleGraph.getModuleById(resolvedId);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          return [mod];
        }
      }
    },
  };
}
