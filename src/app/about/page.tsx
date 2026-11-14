import { about } from "@/lib/content";
import { breadcrumbs, ORG_ID, webPage } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import { Heading, Stats, Team } from "@/components/Sections";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";

const ABOUT_D =
  "Meet Smart Solutions, powered by VASAY.AI: a Concord, Ontario digital marketing agency with 15+ years of experience in branding, websites, ads and automation.";
const ABOUT_T = "About Smart Solutions | Marketing Agency in Concord, ON";

export const metadata = pageMetadata({
  title: ABOUT_T,
  description: ABOUT_D,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ type: "AboutPage", path: "/about", name: ABOUT_T, description: ABOUT_D, about: { "@id": ORG_ID } }),
          breadcrumbs("/about", [
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
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
