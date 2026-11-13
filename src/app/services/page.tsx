import Link from "@/components/TransitionLink";
import ButtonArrow from "@/components/ButtonArrow";
import { serviceList } from "@/lib/services";
import { servicesSection } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import { ServiceIconBox } from "@/components/ServiceIcon";
import { Process } from "@/components/Sections";
import Contact from "@/components/Contact";

export const metadata = pageMetadata({
  title: "Digital Marketing Services in Concord & the GTA | Smart Solutions",
  description:
    "Brand identity, website design and development, SEO, social media, paid ads, AI automation and cybersecurity, all under one roof in Concord, Ontario.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow="Services"
        title={servicesSection.title}
        accent={servicesSection.accent}
        sub={servicesSection.intro}
        primary={{ label: "Book a free strategy call", href: "#contact" }}
        secondary={{ label: "Browse services", href: "#all-services", icon: "down" }}
      />
      <section id="all-services" aria-label="All services" className="mx-auto max-w-7xl px-4 sm:px-6 section-y tone-light">
        <ul className="grid gap-4 md:grid-cols-2">
          {serviceList.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-brand-silver bg-white p-8 transition-[transform,border-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-accent/30 sm:p-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-orange/0 blur-3xl transition-colors duration-700 group-hover:bg-brand-orange/25"
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
