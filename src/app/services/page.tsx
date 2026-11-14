import Link from "@/components/TransitionLink";
import JsonLd from "@/components/JsonLd";
import { abs, breadcrumbs, offerCatalog, ORG_ID, webPage } from "@/lib/schema";
import ButtonArrow from "@/components/ButtonArrow";
import { serviceList } from "@/lib/services";
import { servicesSection } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import { ServiceIconBox } from "@/components/ServiceIcon";
import { Process } from "@/components/Sections";
import Contact from "@/components/Contact";

const meta = {
  title: "Digital Marketing Services, Vaughan & GTA | Smart Solutions",
  description:
    "Brand identity, website design and development, SEO, social media, paid ads, AI automation and cybersecurity, all under one roof in Concord, Ontario.",
  path: "/services",
};
export const metadata = pageMetadata(meta);

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          { ...webPage({ type: "CollectionPage", path: meta.path, name: meta.title, description: meta.description }), mainEntity: { "@id": `${abs("/services")}#catalog` } },
          breadcrumbs(meta.path, [
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          { ...offerCatalog(), provider: { "@id": ORG_ID } },
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow="Services"
        title={servicesSection.title}
        accent={servicesSection.accent}
        sub={servicesSection.intro}
        primary={{ label: "Book a free strategy call", href: "#contact" }}
        secondary={{ label: "Browse services", href: "#all-services", icon: "down" }}
      />
      <section id="all-services" aria-label="All services" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
        <ul className="grid gap-4 md:grid-cols-2">
          {serviceList.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-brand-silver bg-white p-8 transition-[transform,border-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-accent/30 sm:p-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-32 -top-32 h-80 w-80 bg-[radial-gradient(closest-side,rgb(255_112_1/0.25)_30%,transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
                <span className="flex items-center justify-between">
                  <ServiceIconBox name={s.icon} />
                  <span className="rounded-full bg-brand-bg px-3 py-1 text-[13px] font-semibold text-brand-orange ring-1 ring-brand-silver">
                    {s.tag}
                  </span>
                </span>
                <h2 className="mt-10 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{s.title}</h2>
                <p className="mt-4 flex-1 text-ink-2 sm:text-lg">{s.description}</p>
                <span className="mt-8 inline-flex items-center gap-2 font-semibold text-accent">
                  Explore
                  <ButtonArrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Process />
      <Contact />
    </>
  );
}
