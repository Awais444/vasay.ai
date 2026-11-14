import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import InsightsIndex from "@/components/blog/InsightsIndex";
import { getPosts, PER_PAGE } from "@/sanity/data";

/** Pages 2..n. Page 1 is /insights (the featured article is not counted in the 12 per page). */
export async function generateStaticParams() {
  const posts = await getPosts();
  const pages = Math.ceil(Math.max(0, posts.length - 1) / PER_PAGE);
  const params = Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ page: String(i + 2) }));
  // Cache Components needs at least one entry; "2" simply 404s until there are enough articles.
  return params.length ? params : [{ page: "2" }];
}

export async function generateMetadata({ params }: PageProps<"/insights/page/[page]">) {
  const { page } = await params;
  return pageMetadata({
    title: `Insights, page ${page} | Smart Solutions`,
    description: "Practical marketing, SEO, ads and AI automation guides from Smart Solutions.",
    path: `/insights/page/${page}`,
  });
}

export const instant = false;

export default async function InsightsPaged({ params }: PageProps<"/insights/page/[page]">) {
  const { page } = await params;
  const n = Number(page);
  if (!Number.isInteger(n) || n < 2) notFound();
  return <InsightsIndex page={n} />;
}
