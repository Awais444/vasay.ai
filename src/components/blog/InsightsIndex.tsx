import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, webPage } from "@/lib/schema";
import PageHero from "@/components/PageHero";
import InsightsSearch from "./InsightsSearch";
import PostCard, { FeaturedPostCard } from "./PostCard";
import InsightsResults from "./InsightsResults";
import { CategoryPills, EmptyState, Pagination, PostGrid } from "./Listing";
import { getCategories, getPosts, PER_PAGE } from "@/sanity/data";

export const insightsHero = {
  title: "Marketing that actually works,",
  accent: "explained.",
  sub: "Practical guides on branding, websites, SEO, ads and AI automation, from the team that does it every day.",
};

/** /insights and /insights/page/[n]: featured article (page 1), grid of 12, category pills, pagination. */
export default async function InsightsIndex({ page }: { page: number }) {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  const [featured, ...rest] = posts;
  const pages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  if (page > pages) notFound();
  const slice = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const usedCategories = categories.filter((c) => posts.some((p) => p.category?.slug === c.slug));

  return (
    <>
      <JsonLd
        data={[
          webPage({ type: "CollectionPage", path: page === 1 ? "/insights" : `/insights/page/${page}`, name: "Insights", description: insightsHero.sub }),
          breadcrumbs(page === 1 ? "/insights" : `/insights/page/${page}`, [
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
          ]),
        ]}
      />
      <PageHero
        compact
        crumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
        eyebrow="Insights"
        title={insightsHero.title}
        accent={insightsHero.accent}
        sub={insightsHero.sub}
      >
        <InsightsSearch enabled={posts.length > 0} />
      </PageHero>

      <section aria-label="Articles" className="insights-sheet">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <InsightsResults
              texts={posts.map((p) => `${p.title} ${p.excerpt} ${p.category?.title ?? ""}`)}
              cards={posts.map((p) => <PostCard key={p._id} post={p} />)}
            >
              <CategoryPills categories={usedCategories} />
              {page === 1 && featured && (
                <div className="mt-10">
                  <FeaturedPostCard post={featured} />
                </div>
              )}
              {slice.length > 0 && (
                <div className="mt-16">
                  <PostGrid posts={slice} />
                </div>
              )}
              <Pagination page={page} pages={pages} />
            </InsightsResults>
          )}
        </div>
      </section>
    </>
  );
}
