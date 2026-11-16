import type { Metadata } from "next";
import { pageMetadata, withSeo } from "@/lib/seo";
import { getContent } from "@/cms/content";
import InsightsIndex from "@/components/blog/InsightsIndex";

const base = pageMetadata({
  title: "Insights: Marketing, SEO & AI Guides | Smart Solutions",
  description:
    "Practical guides on branding, websites, SEO, paid ads and AI automation for GTA businesses, from the Smart Solutions team in Concord, Ontario.",
  path: "/insights",
});

export async function generateMetadata(): Promise<Metadata> {
  const { insightsPage } = await getContent();
  const m = withSeo(base, insightsPage.seo);
  return { ...m, alternates: { ...m.alternates, types: { "application/rss+xml": "/insights/rss.xml" } } };
}

export default function InsightsPage() {
  return <InsightsIndex page={1} />;
}
