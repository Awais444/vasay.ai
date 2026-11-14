import { notFound } from "next/navigation";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import AuthorBox from "@/components/blog/AuthorBox";
import { EmptyState, PostGrid } from "@/components/blog/Listing";
import { getAuthors, getPosts } from "@/sanity/data";
import { imageUrl } from "@/sanity/client";

export async function generateStaticParams() {
  const authors = await getAuthors();
  // Cache Components needs at least one entry; the placeholder 404s.
  return authors.length ? authors.map((a) => ({ slug: a.slug })) : [{ slug: "team" }];
}

export async function generateMetadata({ params }: PageProps<"/insights/author/[slug]">) {
  const { slug } = await params;
  const a = (await getAuthors()).find((x) => x.slug === slug);
  if (!a) return {};
  return pageMetadata({
    title: `${a.name}${a.role ? `, ${a.role}` : ""} | Smart Solutions Insights`,
    description: a.bio?.slice(0, 160) || `Articles by ${a.name} on marketing, websites, SEO and automation.`,
    path: `/insights/author/${a.slug}`,
  });
}

export const instant = false;

export default async function AuthorPage({ params }: PageProps<"/insights/author/[slug]">) {
  const { slug } = await params;
  const [authors, posts] = await Promise.all([getAuthors(), getPosts()]);
  const author = authors.find((a) => a.slug === slug);
  if (!author) notFound();
  const mine = posts.filter((p) => p.author?.slug === slug);
  const url = `${site.url}/insights/author/${author.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: author.name,
            jobTitle: author.role,
            description: author.bio,
            image: imageUrl(author.photo, 400, 400) ?? undefined,
            url,
            sameAs: author.socials?.map((s) => s.url),
            worksFor: { "@id": `${site.url}/#organization` },
          },
        }}
      />
      <PageHero
        compact
        crumbs={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: author.name }]}
        eyebrow="Author"
        title={author.name}
        sub={author.role}
      />
      <section aria-label={`About ${author.name}`} className="insights-sheet !pb-0">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <AuthorBox author={author} />
        </div>
      </section>
      <section aria-label={`Articles by ${author.name}`} className="section-y tone-light !pt-[var(--section-y)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Articles by {author.name}</h2>
          <div className="mt-10">{mine.length ? <PostGrid posts={mine} /> : <EmptyState title="No articles yet" />}</div>
        </div>
      </section>
    </>
  );
}
