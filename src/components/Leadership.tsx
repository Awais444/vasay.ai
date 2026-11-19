// Server Component: About page "Leadership" (founders and leaders picked in Sanity). No client JavaScript.
// Text-only cards: no photos or initials tiles here (the Sanity photo field is simply not used).
// Content order in the middle: quote, else bio, else highlight chips; with none, the card is shorter
// and the name block is centred vertically, so it never shows an empty area.
import type { AboutPage, Settings, TeamMember } from "@/cms/types";
import { revealProps } from "@/lib/reveal";
import { Heading } from "./Heading";
import { Star } from "./Logo";

/** Visual rhythm toggle: render the second card inverted (Klein Blue background, white text). */
const INVERT_SECOND_CARD = false;

const REGIONS: Record<string, string> = { ON: "Ontario", BC: "British Columbia", AB: "Alberta", QC: "Quebec" };
const STAR_PATH = "M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z";

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

const MapPin = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

const LIGHT = {
  card: "border-[#E7EAEC] bg-white hover:border-accent",
  pill: "bg-accent/[0.07] text-accent",
  muted: "text-ink-2",
  divider: "border-[#E7EAEC]",
  chip: "bg-accent/[0.07] text-accent",
  link: "text-accent",
  li: "bg-accent text-white hover:bg-accent-bright",
  deco: "text-accent/[0.06]",
};
const INVERTED = {
  card: "border-accent bg-accent text-white hover:border-accent-bright",
  pill: "bg-white/15 text-white",
  muted: "text-white/80",
  divider: "border-white/20",
  chip: "bg-white/15 text-white",
  link: "text-white",
  li: "bg-white text-accent hover:bg-white/90",
  deco: "text-white/[0.09]",
};

function LeaderCard({ m, location, inverted, index }: { m: TeamMember; location: string; inverted: boolean; index: number }) {
  const highlights = m.highlights ?? [];
  const middle = m.quote ? "quote" : m.bio ? "bio" : highlights.length ? "chips" : null;
  const t = inverted ? INVERTED : LIGHT;

  return (
    <li
      {...revealProps(index * 0.08)}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[24px] border p-[clamp(28px,3vw,44px)] transition-colors duration-300 ${t.card}`}
    >
      {/* Decorative outline star, bottom-right; rotates slightly on hover */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[15deg] ${t.deco}`}
      >
        <path d={STAR_PATH} fill="none" stroke="currentColor" strokeWidth="0.35" />
      </svg>

      <div className={`relative flex flex-1 flex-col gap-8 ${middle ? "justify-between" : "justify-center"}`}>
        <div>
          {m.role && (
            <p className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ${t.pill}`}>
              <Star size={12} className="text-brand-orange" />
              {m.role}
            </p>
          )}
          <h3 className="mt-5 font-display text-[clamp(32px,3.4vw,48px)] font-medium leading-[1.05] tracking-[-0.03em]">{m.name}</h3>
        </div>

        {middle === "quote" && (
          <blockquote className="relative pl-9 text-xl font-medium leading-snug">
            <span aria-hidden="true" className="absolute -top-2 left-0 font-display text-6xl leading-none text-brand-orange">
              “
            </span>
            {m.quote}
          </blockquote>
        )}
        {middle === "bio" && <p className={`line-clamp-5 text-base leading-relaxed sm:text-[17px] ${t.muted}`}>{m.bio}</p>}
        {middle === "chips" && (
          <ul className="flex flex-wrap gap-2" aria-label={`${m.name}: highlights`}>
            {highlights.map((h) => (
              <li key={h} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${t.chip}`}>
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 border-t pt-5 text-sm ${t.divider}`}>
          {m.linkedin && (
            <a
              href={m.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${m.name} on LinkedIn`}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-[background-color,transform] duration-300 hover:-translate-y-0.5 ${t.li}`}
            >
              <LinkedInIcon />
            </a>
          )}
          {m.email && (
            <a href={`mailto:${m.email}`} className={`font-semibold underline-offset-4 hover:underline ${t.link}`}>
              {m.email}
            </a>
          )}
          {location && (
            <span className={`inline-flex items-center gap-1.5 ${t.muted}`}>
              <MapPin />
              {location}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export default function Leadership({ data, settings }: { data: AboutPage["leadership"]; settings: Settings }) {
  if (!data.show || !data.members.length) return null;
  const { city, region } = settings.address;
  const location = [city, REGIONS[region] ?? region].filter(Boolean).join(", ");
  return (
    <section id="leadership" aria-labelledby="leadership-title" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <div id="leadership-title">
        <Heading eyebrow={data.eyebrow} title={data.title} />
      </div>
      <ul className={`mt-[var(--head-gap)] grid gap-6 ${data.members.length > 1 ? "md:grid-cols-2" : "max-w-3xl"}`}>
        {data.members.map((m, i) => (
          <LeaderCard key={m.slug || m.name} m={m} location={location} inverted={INVERT_SECOND_CARD && i === 1} index={i} />
        ))}
      </ul>
    </section>
  );
}
