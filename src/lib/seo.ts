import type { Metadata } from "next";
import type { Seo } from "@/cms/types";
import { imageUrl } from "@/sanity/client";
import { siteUrl } from "./env";

/**
 * Only the production deployment is indexable. On Vercel, previews and branch deploys
 * (VERCEL_ENV !== "production") get noindex. Elsewhere, set NEXT_PUBLIC_NOINDEX=1 to block indexing.
 * Hosts other than the canonical one also get an X-Robots-Tag: noindex header (next.config.ts).
 */
export const isIndexable = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NEXT_PUBLIC_NOINDEX !== "1";

export const SITE_NAME = "Smart Solutions, Powered by VASAY.AI";

/** Unique title, description, canonical, Open Graph and Twitter card for a page. */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    // Images come from each route's opengraph-image.tsx file (generated with next/og).
    openGraph: { title, description, url, siteName: SITE_NAME, locale: "en_CA", type },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * Apply an editor's SEO fields (meta title, description, social image, canonical, noindex) on top of
 * a page's default metadata. Empty fields keep the default.
 */
export function withSeo(meta: Metadata, seo?: Seo): Metadata {
  if (!seo) return meta;
  const title = seo.metaTitle || (meta.title as string | undefined);
  const description = seo.metaDescription || meta.description || undefined;
  const og = seo.ogImage ? imageUrl(seo.ogImage, 1200, 630) : null;
  return {
    ...meta,
    title,
    description,
    alternates: seo.canonical ? { ...meta.alternates, canonical: seo.canonical } : meta.alternates,
    robots: seo.noindex ? { index: false, follow: true } : meta.robots,
    openGraph: { ...meta.openGraph, title: title ?? undefined, description: description ?? undefined, ...(og ? { images: [{ url: og, width: 1200, height: 630 }] } : {}) },
    twitter: { ...meta.twitter, title: title ?? undefined, description: description ?? undefined, ...(og ? { images: [og] } : {}) },
  };
}
