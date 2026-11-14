import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/content";
import { getService } from "@/lib/services";
import Link from "@/components/TransitionLink";
import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import { ServiceIconBox } from "@/components/ServiceIcon";
import JsonLd from "@/components/JsonLd";
import Contact from "@/components/Contact";
import PostBody, { getFaqs, getHeadings } from "@/components/blog/PostBody";
import Toc from "@/components/blog/Toc";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ShareButtons from "@/components/blog/ShareButtons";
import AuthorBox, { AuthorAvatar } from "@/components/blog/AuthorBox";
import { CategoryChip } from "@/components/blog/PostCard";
import { PostGrid } from "@/components/blog/Listing";
import { formatDate, getPost, getPosts, readMinutes } from "@/sanity/data";
import { imageUrl } from "@/sanity/client";

export async function generateStaticParams() {
  const posts = await getPosts();
  // Cache Components needs at least one entry; the placeholder 404s. New articles render on first visit.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "coming-soon" }];
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const title = post.seo?.metaTitle || `${post.title} | Smart Solutions`;
  const description = post.seo?.metaDescription || post.excerpt;
  const path = `/insights/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: post.seo?.canonical || path },
    robots: post.seo?.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: `${site.url}${path}`,
      siteName: "Smart Solutions — Powered by VASAY.AI",
      locale: "en_CA",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: post.author ? [`${site.url}/insights/author/${post.author.slug}`] : undefined,
      section: post.category?.title,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const instant = false;

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();

  const url = `${site.url}/insights/${post.slug}`;
  const headings = getHeadings(post.body);
  const faqs = getFaqs(post.body);
  const service = post.category ? getService(post.category.slug) : undefined;
  const cover = imageUrl(post.coverImage, 1600, 900);
  const sameCat = all.filter((p) => p._id !== post._id && p.category?.slug === post.category?.slug);
  const related = [...sameCat, ...all.filter((p) => p._id !== post._id && !sameCat.includes(p))].slice(0, 3);
  const updated = post.updatedAt && post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10) ? post.updatedAt : undefined;

  const crumbs = [
    { name: "Home", item: site.url },
    { name: "Insights", item: `${site.url}/insights` },
    ...(post.category ? [{ name: post.category.title, item: `${site.url}/insights/category/${post.category.slug}` }] : []),
    { name: post.title, item: url },
  ];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.seo?.metaDescription || post.excerpt,
            image: cover ? [cover] : [`${url}/opengraph-image`],
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
            author: post.author
              ? { "@type": "Person", name: post.author.name, jobTitle: post.author.role, url: `${site.url}/insights/author/${post.author.slug}` }
              : undefined,
            publisher: { "@id": `${site.url}/#organization` },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            articleSection: post.category?.title,
            wordCount: post.words,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
          },
          ...(faqs.length
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
                },
              ]
            : []),
        ]}
      />
      <ReadingProgress targetId="article-body" />

      <article className="bg-brand-bg">
        <header className="mx-auto max-w-[920px] px-5 pb-10 pt-[calc(var(--nav-h)+clamp(32px,6vh,64px))] sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-accent">Home</Link>
              </li>
              <li aria-hidden="true">
                <ButtonArrow dir="chevron" size={14} nudge={false} />
              </li>
              <li>
                <Link href="/insights" className="hover:text-accent">Insights</Link>
              </li>
              {post.category && (
                <>
                  <li aria-hidden="true">
                    <ButtonArrow dir="chevron" size={14} nudge={false} />
                  </li>
                  <li>
                    <Link href={`/insights/category/${post.category.slug}`} className="hover:text-accent">
                      {post.category.title}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>
          {post.category && (
            <Link href={`/insights/category/${post.category.slug}`} className="mt-8 inline-block">
              <CategoryChip title={post.category.title} />
            </Link>
          )}
          <h1 className="mt-4 font-display text-[clamp(34px,4.8vw,60px)] font-semibold leading-[1.04] tracking-[-0.04em]">{post.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-ink-2">{post.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-brand-silver pt-6 text-sm text-ink-2">
            {post.author && (
              <Link href={`/insights/author/${post.author.slug}`} className="flex items-center gap-3">
                <AuthorAvatar author={post.author} size={44} />
                <span>
                  <span className="block font-semibold text-brand-black">{post.author.name}</span>
                  {post.author.role && <span>{post.author.role}</span>}
                </span>
              </Link>
            )}
            <span>
              Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
            {updated && (
              <span>
                Updated <time dateTime={updated}>{formatDate(updated)}</time>
              </span>
            )}
            <span>{readMinutes(post.words)} min read</span>
          </div>
        </header>

        {cover && (
          <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
            <Image
              src={cover}
              alt={post.coverImage?.alt ?? ""}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1200px) 1112px, 100vw"
              className="h-auto w-full rounded-[28px]"
            />
          </div>
        )}

        <div className="mx-auto grid max-w-[1160px] gap-12 px-5 pb-[var(--section-y)] pt-12 sm:px-6 lg:grid-cols-[minmax(0,720px)_260px] lg:justify-between lg:pt-16">
          <div id="article-body" className="min-w-0">
            {!!post.keyTakeaways?.length && (
              <aside aria-label="Key takeaways" className="mb-12 rounded-[24px] border border-accent/20 bg-[#F3F2FD] p-6 sm:p-8">
                <p className="font-display text-xl font-semibold tracking-tight text-accent">Key takeaways</p>
                <ul className="mt-4 space-y-3 text-[17px] leading-relaxed">
                  {post.keyTakeaways.map((k) => (
                    <li key={k} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                      {k}
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <PostBody value={post.body} />

            {/* Want this done for you? + the matching service */}
            <aside className="mt-16 overflow-hidden rounded-[28px] bg-accent text-white">
              <div className="p-7 sm:p-9">
                <p className="font-display text-[clamp(26px,3vw,34px)] font-semibold leading-tight tracking-tight">Want this done for you?</p>
                <p className="mt-2 max-w-lg text-white/80">
                  Book a free 30-minute strategy call. We&apos;ll look at your business and tell you honestly what would help most.
                </p>
                <Link
                  href="/contact"
                  className={`${arrowLink} mt-6 rounded-full bg-white px-6 py-3.5 font-semibold text-accent transition-colors hover:bg-brand-orange hover:text-white`}
                >
                  Book a free strategy call
                  <ButtonArrow />
                </Link>
              </div>
              <Link
                href={service ? `/services/${service.slug}` : "/services"}
                className="group flex items-center gap-4 border-t border-white/15 bg-accent-deep/60 px-7 py-5 transition-colors hover:bg-accent-deep sm:px-9"
              >
                {service ? <ServiceIconBox name={service.icon} /> : null}
                <span className="flex-1">
                  <span className="block text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60">Related service</span>
                  <span className="block font-semibold">{service ? service.title : "See all our services"}</span>
                </span>
                <ButtonArrow />
              </Link>
            </aside>

            <div className="mt-12 border-t border-brand-silver pt-8">
              <ShareButtons url={url} title={post.title} />
            </div>
            {post.author && (
              <div className="mt-10">
                <AuthorBox author={post.author} />
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <Toc headings={headings} />
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-white section-y tone-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related-title" className="font-display text-[clamp(30px,3.6vw,48px)] font-semibold tracking-[-0.035em]">
                Keep reading
              </h2>
              <Link href="/insights" className={`${arrowLink} font-semibold text-accent hover:text-accent-bright`}>
                All articles
                <ButtonArrow size={16} />
              </Link>
            </div>
            <div className="mt-12">
              <PostGrid posts={related} />
            </div>
          </div>
        </section>
      )}
      <Contact />
    </>
  );
}
