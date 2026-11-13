import { about, site } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import { Heading, Stats, Team } from "@/components/Sections";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMetadata({
  title: "About Smart Solutions | Digital Marketing Agency in Concord, ON",
  description:
    "Meet Smart Solutions, powered by VASAY.AI: a Concord, Ontario digital marketing agency with 15+ years of experience in branding, websites, ads and AI automation.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.legalName,
          alternateName: "Smart Solutions — Powered by VASAY.AI",
          url: site.url,
          logo: `${site.url}/brand/logo.webp`,
          telephone: "+1-647-559-3900",
          description: site.description,
          address: {
            "@type": "PostalAddress",
            streetAddress: site.address.street,
            addressLocality: site.address.city,
            addressRegion: site.address.region,
            postalCode: site.address.postalCode,
            addressCountry: site.address.country,
          },
          sameAs: site.socials.map((s) => s.href),
        }}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow={about.eyebrow}
        title={about.title}
        accentLead={about.accentLead}
        accent={about.accent}
        sub={about.sub}
        primary={{ label: "Book a free strategy call", href: "#contact" }}
        secondary={{ label: "Meet the team", href: "#team", icon: "down" }}
      />

      <section aria-label="Our story" className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_1.2fr] section-y tone-light">
        <Heading eyebrow={about.story.eyebrow} title={about.story.title} accent={about.story.accent} />
        <div className="space-y-6 text-lg leading-relaxed text-ink-2">
          {about.story.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </section>

      <section aria-label="Mission and values" className="bg-brand-black text-white section-y">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <Heading eyebrow={about.mission.eyebrow} title={about.mission.title} accent={about.mission.accent} dark />
          <p className="mt-8 max-w-3xl font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-medium leading-snug tracking-tight text-white/90">
            {about.mission.statement}
          </p>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.mission.values.map((v, i) => (
              <li key={v.title} className="rounded-[var(--radius-card)] bg-white/[0.05] p-7 ring-1 ring-white/10">
                <span className="font-display text-sm text-brand-orange">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-xl font-semibold">{v.title}</h3>
                <p className="mt-2 text-white/75">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Stats withManifesto={false} />
      <Team />
      <Contact />
    </>
  );
}
