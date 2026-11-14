import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import InsightsIndex from "@/components/blog/InsightsIndex";

const base = pageMetadata({
  title: "Insights: Marketing, SEO & AI Guides | Smart Solutions",
  description:
    "Practical guides on branding, websites, SEO, paid ads and AI automation for GTA businesses, from the Smart Solutions team in Concord, Ontario.",
  path: "/insights",
});

export const metadata: Metadata = {
  ...base,
  alternates: { ...base.alternates, types: { "application/rss+xml": "/insights/rss.xml" } },
};

export default function InsightsPage() {
  return <InsightsIndex page={1} />;
}
