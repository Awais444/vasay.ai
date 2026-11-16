import { notFound } from "next/navigation";
import { getContent } from "@/cms/content";
import { pageMetadata, withSeo } from "@/lib/seo";
import { breadcrumbs, faqPage, service as serviceSchema, webPage } from "@/lib/schema";
import PageHero from "@/components/PageHero";
import ServiceVisual from "@/components/ServiceVisual";
import ServiceGuide from "@/components/ServiceGuide";
import { Problems, Included, Deliverables, Timeline, Related } from "@/components/ServiceSections";
import { Faq } from "@/components/Sections";
import { WhyUs } from "@/components/StaticSections";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import LatestInsights from "@/components/blog/LatestInsights";

/** One page per service in the CMS (a new service gets its page automatically). */
export async function generateStaticParams() {
  const { services } = await getContent();
  // Cache Components needs at least one entry; "seo" simply 404s if it doesn't exist.
  return services.length ? services.map((s) => ({ slug: s.slug })) : [{ slug: "seo" }];
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = (await getContent()).services.find((x) => x.slug === slug);
  if (!s) return {};
  return withSeo(pageMetadata({ title: s.seoTitle, description: s.seoDescription, path: `/services/${s.slug}` }), s.seo);
}

// Every slug is prerendered (generateStaticParams), so wait for the full page on navigation
// instead of showing a loading fallback. This avoids a blank screen during the page transition.
export const instant = false;

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const c = await getContent();
  const s = c.services.find((x) => x.slug === slug);
  if (!s) notFound();

  const related = s.related.map((r) => c.services.find((x) => x.slug === r)).filter((r) => r !== undefined);
  const path = `/services/${s.slug}`;

  return (
    <>
      <JsonLd
        data={[
          webPage({ path, name: s.seoTitle, description: s.seoDescription, dateModified: s.updated || undefined, about: { "@id": `${path}#service` } }),
          breadcrumbs(path, [
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: s.title, path },
          ]),
          serviceSchema(s, s.definition.a || s.description),
          ...(s.faqs.length ? [faqPage(path, s.faqs)] : []),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: s.title }]}
        h1Lead={s.h1Keyword}
        icon={s.icon}
        title={s.heroTitle}
        accent={s.heroAccent}
        sub={s.sub}
        primary={{ label: "Book a free strategy call", href: "#contact" }}
        secondary={s.included.length ? { label: "See what's included", href: "#included" } : undefined}
        visual={<ServiceVisual slug={s.slug} fallback={{ label: s.title, items: s.included.map((i) => i.title) }} />}
      />
      <Problems items={s.problems} />
      <ServiceGuide guide={s} title={s.title} />
      <Included items={s.included} title={s.title} />
      <Deliverables service={s} />
      <Timeline steps={s.process} />
      <WhyUs data={c.home.whyUs} />
      <LatestInsights categorySlug={s.slug} topic={s.title} />
      {s.faqs.length > 0 && <Faq items={s.faqs} heading={c.home.faq} />}
      <Related items={related} />
      <Contact contact={c.contact} settings={c.settings} defaultService={s.title} />
    </>
  );
}
