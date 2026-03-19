declare module "virtual:blog-posts" {
  export const posts: Array<{
    slug: string;
    title: string;
    date: string;
    description: string;
    html: string;
    toc: Array<{ id: string; text: string; level: number }>;
    searchText: string;
    tags: string[];
  }>;
}
