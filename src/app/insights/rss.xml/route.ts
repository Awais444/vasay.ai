import { site } from "@/lib/content";
import { getPosts } from "@/sanity/data";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 feed of the latest 50 articles: /insights/rss.xml */
export async function GET() {
  const posts = (await getPosts()).slice(0, 50);
  const items = posts
    .map((p) => {
      const url = `${site.url}/insights/${p.slug}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.excerpt)}</description>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>${p.category ? `\n      <category>${esc(p.category.title)}</category>` : ""}${
        p.author ? `\n      <dc:creator>${esc(p.author.name)}</dc:creator>` : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Smart Solutions Insights</title>
    <link>${site.url}/insights</link>
    <description>Practical guides on branding, websites, SEO, ads and AI automation.</description>
    <language>en-ca</language>
    <atom:link href="${site.url}/insights/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
