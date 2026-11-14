import Link from "@/components/TransitionLink";
import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import { PostGrid } from "./Listing";
import { getPostsInCategory } from "@/sanity/data";

/** Service pages: the 3 latest articles from the service's category. Renders nothing until there are some. */
export default async function LatestInsights({ categorySlug, topic }: { categorySlug: string; topic: string }) {
  const posts = await getPostsInCategory(categorySlug, 3);
  if (!posts.length) return null;
  return (
    <section aria-labelledby="latest-insights" className="bg-white section-y tone-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-2">Insights</p>
            <h2 id="latest-insights" className="mt-3 font-display text-[clamp(30px,3.6vw,48px)] font-semibold tracking-[-0.035em]">
              Learn more about <span className="text-brand-orange">{topic}</span>
            </h2>
          </div>
          <Link href={`/insights/category/${categorySlug}`} className={`${arrowLink} font-semibold text-accent hover:text-accent-bright`}>
            All {topic} articles
            <ButtonArrow size={16} />
          </Link>
        </div>
        <div className="mt-12">
          <PostGrid posts={posts} />
        </div>
      </div>
    </section>
  );
}
