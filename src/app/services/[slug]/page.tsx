import { notFound } from "next/navigation";
import { getService, serviceList } from "@/lib/services";
import { site } from "@/lib/content";
import { pageMetadata, provider } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import ServiceVisual from "@/components/ServiceVisual";
import { Problems, Included, Deliverables, Timeline, Related } from "@/components/ServiceSections";
import { WhyUs, Faq } from "@/components/Sections";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";

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
  if (!s) notFound();

  const related = s.related.map((r) => getService(r)).filter((r) => r !== undefined);
  const url = `${site.url}/services/${s.slug}`;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            serviceType: s.title,
            description: s.seoDescription,
            url,
            provider,
            areaServed: { "@type": "Place", name: "Greater Toronto Area" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: s.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site.url },
              { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
              { "@type": "ListItem", position: 3, name: s.title, item: url },
            ],
          },
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: s.title }]}
        eyebrow={s.tag}
        icon={s.icon}
        title={s.heroTitle}
        accent={s.heroAccent}
        sub={s.sub}
        primary={{ label: "Book a free strategy call", href: "#contact" }}
        secondary={{ label: "See what's included", href: "#included" }}
        visual={<ServiceVisual slug={s.slug} />}
      />
      <Problems items={s.problems} />
      <Included items={s.included} title={s.title} />
      <Deliverables service={s} />
      <Timeline steps={s.process} />
      <WhyUs />
      <Faq items={s.faqs} heading={{ eyebrow: "FAQ", title: "Good", accent: "questions." }} />
      <Related items={related} />
      <Contact defaultService={s.title} />
    </>
  );
}
