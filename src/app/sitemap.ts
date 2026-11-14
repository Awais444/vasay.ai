import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { serviceList } from "@/lib/services";
import { serviceGuides } from "@/lib/serviceGuides";
import { getAuthors, getCategories, getPosts } from "@/sanity/data";

/** Date the static pages' content last changed. Update it when you edit copy in content.ts. */
const CONTENT_UPDATED = "2026-11-14";
const LEGAL_UPDATED = "2026-11-13";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${site.url}${path}`;
  const [posts, categories, authors] = await Promise.all([getPosts(), getCategories(), getAuthors()]);
  const used = (slug: string) => posts.some((p) => p.category?.slug === slug);
  const latestPost = posts[0]?.updatedAt || posts[0]?.publishedAt;

  return [
    { url: site.url, lastModified: CONTENT_UPDATED, priority: 1 },
    { url: url("/services"), lastModified: CONTENT_UPDATED, priority: 0.9 },
    ...serviceList.map((s) => ({ url: url(`/services/${s.slug}`), lastModified: serviceGuides[s.slug]?.updated ?? CONTENT_UPDATED, priority: 0.8 })),
    { url: url("/about"), lastModified: CONTENT_UPDATED, priority: 0.7 },
    { url: url("/contact"), lastModified: CONTENT_UPDATED, priority: 0.7 },
    { url: url("/insights"), lastModified: latestPost ?? CONTENT_UPDATED, priority: 0.8 },
    { url: url("/privacy-policy"), lastModified: LEGAL_UPDATED, priority: 0.2 },
    { url: url("/terms"), lastModified: LEGAL_UPDATED, priority: 0.2 },
    // Blog: noindex articles are left out
    ...posts
      .filter((p) => !p.noindex)
      .map((p) => ({ url: url(`/insights/${p.slug}`), lastModified: p.updatedAt || p.publishedAt, priority: 0.7 })),
    ...categories.filter((c) => used(c.slug)).map((c) => ({ url: url(`/insights/category/${c.slug}`), priority: 0.5 })),
    ...authors.map((a) => ({ url: url(`/insights/author/${a.slug}`), priority: 0.4 })),
  ];
}
