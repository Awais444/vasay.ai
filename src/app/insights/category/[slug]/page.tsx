import { notFound } from "next/navigation";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { CategoryPills, EmptyState, PostGrid } from "@/components/blog/Listing";
import { getCategories, getPosts } from "@/sanity/data";

export async function generateStaticParams() {
  const cats = await getCategories();
  // Cache Components needs at least one entry; the placeholder 404s.
  return cats.length ? cats.map((c) => ({ slug: c.slug })) : [{ slug: "marketing-tips" }];
}

export async function generateMetadata({ params }: PageProps<"/insights/category/[slug]">) {
  const { slug } = await params;
  const cat = (await getCategories()).find((c) => c.slug === slug);
  if (!cat) return {};
  return pageMetadata({
    title: `${cat.title} articles | Smart Solutions Insights`,
    description: cat.description || `Practical ${cat.title} guides for GTA businesses from Smart Solutions.`,
    path: `/insights/category/${cat.slug}`,
  });
}

export const instant = false;

export default async function CategoryPage({ params }: PageProps<"/insights/category/[slug]">) {
  const { slug } = await params;
  const [categories, posts] = await Promise.all([getCategories(), getPosts()]);
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const inCat = posts.filter((p) => p.category?.slug === slug);
  const used = categories.filter((c) => posts.some((p) => p.category?.slug === c.slug));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: "Insights", item: `${site.url}/insights` },
            { "@type": "ListItem", position: 3, name: cat.title, item: `${site.url}/insights/category/${cat.slug}` },
          ],
        }}
      />
      <PageHero
        compact
        crumbs={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: cat.title }]}
        eyebrow="Insights"
        title={cat.title}
        sub={cat.description}
      />
      <section aria-label={`${cat.title} articles`} className="section-y tone-light">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          {inCat.length === 0 ? (
            <EmptyState title="Articles coming soon" text={`We haven't published anything on ${cat.title} yet. In the meantime, see how we can help.`} />
          ) : (
            <>
              <CategoryPills categories={used} active={cat.slug} />
              <div className="mt-12">
                <PostGrid posts={inCat} />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
