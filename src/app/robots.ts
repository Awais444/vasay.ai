import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { isIndexable } from "@/lib/seo";

/** Search and AI answer-engine crawlers we explicitly welcome (they also match "*"). */
const CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
];
const PRIVATE = ["/api/", "/studio"];

export default function robots(): MetadataRoute.Robots {
  // Previews and staging: block everything.
  if (!isIndexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [
      { userAgent: CRAWLERS, allow: "/", disallow: PRIVATE },
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
