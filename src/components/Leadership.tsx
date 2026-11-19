// Server Component: About page "Leadership" (founders and leaders picked in Sanity). No client JavaScript.
// Cards fill their height with whatever content exists (bio, quote or highlights). With none, the
// photo stays 4:5 and the content is centred vertically, so they never show an empty block.
import Image from "next/image";
import type { AboutPage, Settings } from "@/cms/types";
import { revealProps } from "@/lib/reveal";
import { memberPhoto } from "@/lib/team";
import { Heading } from "./Heading";
import InitialsTile from "./InitialsTile";

const REGIONS: Record<string, string> = { ON: "Ontario", BC: "British Columbia", AB: "Alberta", QC: "Quebec" };

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

export default function Leadership({ data, settings }: { data: AboutPage["leadership"]; settings: Settings }) {
  if (!data.show || !data.members.length) return null;
  const { city, region } = settings.address;
  const location = [city, REGIONS[region] ?? region].filter(Boolean).join(", ");

  return (
    <section id="leadership" aria-labelledby="leadership-title" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <div id="leadership-title">
        <Heading eyebrow={data.eyebrow} title={data.title} />
      </div>
      <ul className={`mt-[var(--head-gap)] grid items-start gap-6 ${data.members.length > 1 ? "lg:grid-cols-2" : "max-w-3xl"}`}>
        {data.members.map((m, i) => {
          const photo = memberPhoto(m, 900);
          const highlights = m.highlights ?? [];
          // What fills the middle of the card: bio/quote first, then highlights; nothing = content centred.
          const middle = m.quote || m.bio ? "text" : highlights.length ? "chips" : null;
          const compact = !middle;
          return (
            <li
              key={m.slug || m.name}
              {...revealProps(i * 0.08)}
              className="group grid overflow-hidden rounded-[var(--radius-card)] border border-brand-silver bg-white sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
            >
              {/* The spacer keeps the photo at least 4:5 in every state; it stretches with taller content. */}
              <div className="relative overflow-hidden rounded-[22px] bg-accent sm:m-3 sm:mr-0">
                <span aria-hidden="true" className="block aspect-[4/5]" />
                {photo ? (
                  <>
                    <Image
                      src={photo.src}
                      alt={m.photo?.alt || `${m.name}, ${m.role} at Smart Solutions`}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
                      className="team-photo object-cover"
                      style={{ objectPosition: photo.position }}
                    />
                    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-accent/55 to-transparent" />
                  </>
                ) : (
                  <InitialsTile name={m.name} size="lg" />
                )}
              </div>

              <div className={`flex flex-col gap-6 p-7 sm:p-8 ${compact ? "justify-center" : "justify-between"}`}>
                <div>
                  <h3 className="font-display text-[28px] font-semibold leading-tight tracking-tight lg:text-[32px]">{m.name}</h3>
                  {m.role && <p className="mt-2 text-base font-semibold text-accent">{m.role}</p>}
                </div>

                {middle === "text" && (
                  <div className="space-y-4">
                    {m.quote && (
                      <blockquote className="relative pl-7 font-display text-xl font-medium leading-snug tracking-tight text-brand-black">
                        <span aria-hidden="true" className="absolute -top-1 left-0 font-display text-4xl leading-none text-brand-orange">
                          “
                        </span>
                        {m.quote}
                      </blockquote>
                    )}
                    {m.bio && <p className="line-clamp-4 text-base leading-relaxed text-ink-2 sm:text-[17px]">{m.bio}</p>}
                  </div>
                )}
                {middle === "chips" && (
                  <ul className="flex flex-wrap gap-2" aria-label={`${m.name}: highlights`}>
                    {highlights.map((h) => (
                      <li key={h} className="rounded-full bg-accent/[0.07] px-3.5 py-1.5 text-sm font-semibold text-accent">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-brand-silver pt-5 text-sm">
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on LinkedIn`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-accent-bright"
                    >
                      <LinkedInIcon />
                    </a>
                  )}
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="font-semibold text-accent underline-offset-4 hover:underline">
                      {m.email}
                    </a>
                  )}
                  {location && (
                    <span className="inline-flex items-center gap-1.5 text-ink-2">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
                        <circle cx="12" cy="9.5" r="2.5" />
                      </svg>
                      {location}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
