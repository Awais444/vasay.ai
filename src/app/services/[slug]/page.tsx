import { notFound } from "next/navigation";
import { getService, serviceList } from "@/lib/services";
import { getGuide } from "@/lib/serviceGuides";
import { pageMetadata } from "@/lib/seo";
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

export function generateStaticParams() {
  return serviceList.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.seoTitle, description: s.seoDescription, path: `/services/${s.slug}` });
}

// Every slug is prerendered (generateStaticParams), so wait for the full page on navigation
// instead of showing a loading fallback. This avoids a blank screen during the page transition.
export const instant = false;

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  const guide = getGuide(slug);
  if (!s || !guide) notFound();

  const related = s.related.map((r) => getService(r)).filter((r) => r !== undefined);
  const path = `/services/${s.slug}`;
  const faqs = [...s.faqs, ...guide.moreFaqs];

  return (
    <>
      <JsonLd
        data={[
          webPage({ path, name: s.seoTitle, description: s.seoDescription, dateModified: guide.updated, about: { "@id": `${path}#service` } }),
          breadcrumbs(path, [
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: s.title, path },
          ]),
          serviceSchema(s, guide.definition.a),
          faqPage(path, faqs),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: s.title }]}
        h1Lead={guide.h1Keyword}
        icon={s.icon}
        title={s.heroTitle}
        accent={s.heroAccent}
        sub={s.sub}
        primary={{ label: "Book a free strategy call", href: "#contact" }}
        secondary={{ label: "See what's included", href: "#included" }}
        visual={<ServiceVisual slug={s.slug} />}
      />
      <Problems items={s.problems} />
      <ServiceGuide guide={guide} title={s.title} />
      <Included items={s.included} title={s.title} />
      <Deliverables service={s} />
      <Timeline steps={s.process} />
      <WhyUs />
      <LatestInsights categorySlug={s.slug} topic={s.title} />
      <Faq items={faqs} heading={{ eyebrow: "FAQ", title: "Good", accent: "questions." }} />
      <Related items={related} />
      <Contact defaultService={s.title} />
    </>
  );
}
