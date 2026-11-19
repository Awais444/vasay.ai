import { getContent } from "@/cms/content";
import { breadcrumbs, leaderPeople, ORG_ID, teamPeople, webPage } from "@/lib/schema";
import Leadership from "@/components/Leadership";
import { memberPhoto } from "@/lib/team";
import { pageMetadata, withSeo } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import { Stats } from "@/components/Sections";
import { Heading, Team } from "@/components/StaticSections";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";

const ABOUT_D =
  "Meet Smart Solutions, powered by VASAY.AI: a Concord, Ontario digital marketing agency with 15+ years of experience in branding, websites, ads and automation.";
const ABOUT_T = "About Smart Solutions | Marketing Agency in Concord, ON";

export async function generateMetadata() {
  const { about } = await getContent();
  return withSeo(pageMetadata({ title: ABOUT_T, description: ABOUT_D, path: "/about" }), about.seo);
}

export default async function AboutPage() {
  const c = await getContent();
  const about = c.about;
  return (
    <>
      <JsonLd
        data={[
          webPage({ type: "AboutPage", path: "/about", name: ABOUT_T, description: ABOUT_D, about: { "@id": ORG_ID } }),
          breadcrumbs("/about", [
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          // Founders: Person entries without an image (Leadership cards are text-only).
          ...(about.leadership.show ? leaderPeople(about.leadership.members.map((m) => ({ ...m, image: undefined }))) : []),
          ...(about.showTeam ? teamPeople(c.team.map((m) => ({ ...m, image: memberPhoto(m)?.src }))) : []),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow={about.eyebrow}
        lines={about.lines}
        sub={about.sub}
        primary={about.primaryCta}
        secondary={{ ...about.secondaryCta, icon: about.secondaryCta.href.startsWith("#") ? "down" : "right" }}
      />

      {about.story.show && (
      <section aria-label="Our story" className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_1.2fr] section-y tone-light">
        <Heading eyebrow={about.story.eyebrow} title={about.story.title} />
        <div className="space-y-6 text-lg leading-relaxed text-ink-2">
          {about.story.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </section>
      )}

      <Leadership data={about.leadership} settings={c.settings} />

      {about.mission.show && (
      <section aria-label="Mission and values" className="bg-brand-black text-white section-y">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <Heading eyebrow={about.mission.eyebrow} title={about.mission.title} dark />
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

      )}

      {about.showStats && c.home.stats.items.length > 0 && <Stats data={c.home.stats} withManifesto={false} />}
      {about.showTeam && <Team head={{ ...c.home.team, show: true }} members={c.team} />}
      <Contact contact={c.contact} settings={c.settings} />
    </>
  );
}
