import { cacheLife, cacheTag } from "next/cache";
import { defineQuery } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import { client } from "./client";

/*
 * Blog data. Every fetch is cached ("use cache") and tagged, so:
 * - publishing in Sanity calls /api/revalidate, which refreshes these tags (on-demand ISR);
 * - cacheLife("hours") also refreshes hourly, so scheduled (future-dated) articles appear on time.
 * Only published documents are read, and only articles whose publish date has passed.
 */

export type SanityImage = { asset?: { _ref?: string; _id?: string }; alt?: string; hotspot?: unknown; crop?: unknown; caption?: string };
export type CategoryRef = { title: string; slug: string };
export type AuthorRef = { name: string; slug: string; role?: string; photo?: SanityImage };

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: SanityImage;
  category?: CategoryRef;
  author?: AuthorRef;
  words: number;
  noindex?: boolean;
};

export type Author = AuthorRef & { bio?: string; socials?: { platform?: string; url: string }[] };

export type Post = PostCard & {
  keyTakeaways?: string[];
  body?: PortableTextBlock[];
  author?: Author;
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: SanityImage; canonical?: string; noindex?: boolean };
};

export type Category = CategoryRef & { description?: string };

const live = `_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()`;
const card = `_id, title, "slug": slug.current, excerpt, publishedAt, updatedAt, coverImage,
  "category": category->{title, "slug": slug.current},
  "author": author->{name, "slug": slug.current, role, photo},
  "words": length(string::split(pt::text(body), " ")),
  "noindex": seo.noindex`;

const POSTS = defineQuery(`*[${live}] | order(publishedAt desc) { ${card} }`);
const POST = defineQuery(`*[${live} && slug.current == $slug][0] {
  ${card}, keyTakeaways, body, seo,
  "author": author->{name, "slug": slug.current, role, photo, bio, socials}
}`);
const CATEGORIES = defineQuery(`*[_type == "category" && defined(slug.current)] | order(title asc) { title, "slug": slug.current, description }`);
const AUTHORS = defineQuery(`*[_type == "author" && defined(slug.current)] { name, "slug": slug.current, role, photo, bio, socials }`);

async function sanityFetch<T>(query: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!client) return null;
  return client.fetch<T>(query, params);
}

/** All live articles, newest first (lists, pagination, search index, related posts, sitemap, RSS). */
export async function getPosts(): Promise<PostCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  return (await sanityFetch<PostCard[]>(POSTS)) ?? [];
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts", `post:${slug}`);
  return sanityFetch<Post>(POST, { slug });
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  return (await sanityFetch<Category[]>(CATEGORIES)) ?? [];
}

export async function getAuthors(): Promise<Author[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("authors");
  return (await sanityFetch<Author[]>(AUTHORS)) ?? [];
}

export const PER_PAGE = 12;

/** Reading time at ~220 words a minute, at least 1 minute. */
export const readMinutes = (words: number) => Math.max(1, Math.round((words || 0) / 220));

export const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Toronto" }) : "";

/** Latest articles in a category (service pages: "Learn more about …"). */
export async function getPostsInCategory(slug: string, limit?: number) {
  const posts = (await getPosts()).filter((p) => p.category?.slug === slug);
  return limit ? posts.slice(0, limit) : posts;
}
