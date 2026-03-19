import { useEffect } from "react";

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const suffix = "株式会社団野ソフトウェア";
    document.title = title ? `${title} | ${suffix}` : suffix;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", description);
    }
  }, [title, description]);
}
