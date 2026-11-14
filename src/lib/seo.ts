import type { Metadata } from "next";
import { site } from "./content";

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
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    // Images come from each route's opengraph-image.tsx file (generated with next/og).
    openGraph: { title, description, url, siteName: SITE_NAME, locale: "en_CA", type },
    twitter: { card: "summary_large_image", title, description },
  };
}
