import Hero from "@/components/Hero";
import { Stats, Services, Process, Faq } from "@/components/Sections";
import { WhyUs, Work, Testimonials, Team } from "@/components/StaticSections";
import Contact from "@/components/Contact";
import Pillars from "@/components/Pillars";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/cms/content";
import { testimonialView } from "@/cms/testimonials";
import { pageMetadata, withSeo } from "@/lib/seo";
import { breadcrumbs, faqPage, ORG_ID, webPage } from "@/lib/schema";

const title = "Digital Marketing Agency in Vaughan & GTA | Smart Solutions";
const description = "Smart Solutions is a digital marketing agency in Vaughan and the GTA: branding, websites, SEO, paid ads and AI marketing automation that work together.";

export async function generateMetadata() {
  const { home } = await getContent();
  return withSeo(pageMetadata({ title, description, path: "/" }), home.seo);
}

export default async function Home() {
  const c = await getContent();
  const h = c.home;
  const t = testimonialView(c.testimonials);
  const services = c.services.map((s) => ({ slug: s.slug, icon: s.icon, title: s.title, tag: s.tag, description: s.description, href: `/services/${s.slug}` }));
  const faqs = c.faqs.home;
  return (
    <>
      <JsonLd
        data={[
          webPage({ path: "/", name: h.seo.metaTitle || title, description: h.seo.metaDescription || description, about: { "@id": ORG_ID } }),
          breadcrumbs("/", [{ name: "Home", path: "/" }]),
          ...(h.faq.show && faqs.length ? [faqPage("/", faqs)] : []),
        ]}
      />
      {h.hero.show && <Hero hero={h.hero} marquee={h.marquee} />}
      {/* Overlaps the hero's bottom edge with rounded top corners */}
      <Pillars data={h.pillars} />
      {h.stats.show && h.stats.items.length > 0 && <Stats data={h.stats} tightTop />}
      {h.services.show && services.length > 0 && <Services head={h.services} services={services} />}
      <WhyUs data={h.whyUs} />
      {h.process.show && h.process.steps.length > 0 && <Process data={h.process} />}
      <Work head={h.work} items={c.work} />
      {/* Live site: hidden until at least 3 testimonials are approved (src/cms/testimonials.ts). */}
      {t.show && <Testimonials head={h.testimonials} items={t.items} showLabel={t.showLabel} />}
      <Team head={h.team} members={c.team} />
      {h.faq.show && faqs.length > 0 && <Faq items={faqs} heading={h.faq} />}
      {h.contact.show && <Contact contact={c.contact} settings={c.settings} />}
    </>
  );
}
