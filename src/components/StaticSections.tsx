// Server Components: static sections with CSS scroll-reveal (no client JavaScript of their own).
import Image from "next/image";
import type { Home, TeamMember, Testimonial, WorkItem } from "@/cms/types";
import { imageUrl } from "@/sanity/client";
import { memberPhoto, initials } from "@/lib/team";
import { revealProps } from "@/lib/reveal";
import WorkCard from "./WorkCard";

export { Heading } from "./Heading";
import { Heading } from "./Heading";

/* ---------- 3. Why us ---------- */
const whyIcons = ["◎", "▤", "$", "✦"];
export function WhyUs({ data: whyUs }: { data: Home["whyUs"] }) {
  if (!whyUs.show) return null;
  return (
    <section aria-labelledby="why" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Heading eyebrow={whyUs.eyebrow} title={whyUs.title} />
          <p className="mt-6 max-w-md text-lg text-ink-2">{whyUs.intro}</p>
          <a
            href={whyUs.cta.href}
            className="mt-8 inline-flex rounded-full bg-accent px-6 py-4 font-semibold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-accent-bright"
          >
            {whyUs.cta.label}
          </a>
        </div>
        {/* Clean, equal-height 2×2 grid (no offset cards) */}
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
          {whyUs.items.map((it, i) => (
            <div key={it.title} {...revealProps(i * 0.08)}
              className="group flex h-full flex-col rounded-[var(--radius-card)] border border-brand-silver bg-white p-8 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-xl text-white">
                {whyIcons[i]}
              </span>
              <h3 className="mt-8 text-2xl font-semibold">{it.title}</h3>
              <p className="mt-3 text-base text-ink-2 sm:text-[17px]">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. Work ---------- */
export function Work({ head: workSection, items: work }: { head: Home["work"]; items: WorkItem[] }) {
  if (!workSection.show || !work.length) return null;
  return (
    <section id="work" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <Heading {...workSection} />
      <div className="mt-[var(--head-gap)] grid gap-x-8 gap-y-14 md:grid-cols-2">
        {work.map((w, i) => (
          <WorkCard key={w.title} item={w} index={i} src={(w.image ? imageUrl(w.image, 1200, 900) : w.imageSrc) ?? undefined} />
        ))}
      </div>
    </section>
  );
}

/* ---------- 6. Testimonials (visibility rules: showTestimonials in content.ts) ---------- */
function TRow({ items, reverse }: { items: Testimonial[]; reverse?: boolean; showPlaceholderLabel?: boolean }) {
  return (
    <div className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className={`marquee-track flex w-max gap-4 ${reverse ? "reverse" : ""}`}>
        {[...items, ...items].map((t, i) => (
          <figure
            key={i}
            aria-hidden={i >= items.length}
            className="w-[320px] shrink-0 rounded-[var(--radius-card)] bg-white/[0.05] p-7 ring-1 ring-white/10 sm:w-[400px]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-brand-orange" aria-label="5 stars">★★★★★</div>
            </div>
            <blockquote className="mt-4 text-lg leading-snug text-white/90">“{t.quote}”</blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="font-semibold text-white">{t.name}</span>
              <span className="text-white/75"> · {t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function Testimonials({
  head: testimonialsSection,
  items: visibleTestimonials,
  showLabel,
}: {
  head: Home["testimonials"];
  items: Testimonial[];
  showLabel: boolean;
}) {
  if (!testimonialsSection.show || !visibleTestimonials.length) return null;
  const half = Math.ceil(visibleTestimonials.length / 2);
  return (
    <section aria-label="Testimonials" className="bg-brand-black text-white section-y">
      <Heading {...testimonialsSection} dark className="mx-auto max-w-7xl px-5 sm:px-6" />
      <div className="mt-[var(--head-gap)] space-y-4">
        <TRow items={visibleTestimonials.slice(0, half)} showPlaceholderLabel={showLabel} />
        <TRow items={visibleTestimonials.slice(half)} reverse showPlaceholderLabel={showLabel} />
      </div>
    </section>
  );
}

/* ---------- 7. Team ---------- */
/** Card width per breakpoint: 2 columns (mobile, tablet), 3 on desktop; an unfilled last row is centred. */
const teamCard = "w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/3)]";

export function Team({ head: teamSection, members: team }: { head: Home["team"]; members: TeamMember[] }) {
  if (!teamSection.show || !team.length) return null;
  return (
    <section id="team" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <Heading {...teamSection} />
      <ul className="mx-auto mt-[var(--head-gap)] flex max-w-5xl flex-wrap justify-center gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-12">
        {team.map((member, i) => {
          const src = memberPhoto(member);
          return (
            <li key={member.slug} {...revealProps(i * 0.07)} className={`group ${teamCard}`}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-accent">
                {src ? (
                  <>
                    <Image
                      src={src}
                      alt={member.photo?.alt || `${member.name}, ${member.role} at Smart Solutions`}
                      fill
                      sizes="(min-width: 1024px) 330px, 50vw"
                      className="team-photo object-cover"
                    />
                    {/* Klein Blue fade over the bottom quarter */}
                    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-accent/55 to-transparent" />
                  </>
                ) : (
                  // No real photo yet: initials tile in brand colours (no illustrated avatars).
                  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent to-accent-deep font-display text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                    {initials(member.name)}
                    <span className="absolute bottom-5 left-5 h-2 w-10 rounded-full bg-brand-orange" />
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-ink-2">{member.role}</p>
              {member.bio && (
                <p className="team-bio mt-2 line-clamp-2 text-sm text-ink-2">{member.bio}</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
