import type { Metadata } from "next";
import { site } from "./content";

/** Unique title, description, canonical and Open Graph for a page. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${site.url}${path}`,
      siteName: "Smart Solutions — Powered by VASAY.AI",
      locale: "en_CA",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const provider = {
  "@type": "Organization",
  name: site.legalName,
  url: site.url,
  telephone: "+1-647-559-3900",
};
