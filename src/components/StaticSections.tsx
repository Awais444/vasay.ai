// Server Components: static sections with CSS scroll-reveal (no client JavaScript of their own).
import Image from "next/image";
import { whyUs, workSection, work, testimonialsSection, visibleTestimonials, showPlaceholderLabel, teamSection, team } from "@/lib/content";
import { revealProps } from "@/lib/reveal";
import { Star } from "./Logo";
import WorkCard from "./WorkCard";

/* ---------- Shared heading ---------- */
export function Heading({
  eyebrow,
  title,
  accent,
  dark = false,
  className = "",
}: {
  eyebrow: string;
  title: string;
  accent: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] ${dark ? "text-white/75" : "text-accent"}`}>
        <Star size={10} className="text-brand-orange" />
        {eyebrow}
      </p>
      <h2 className={`mt-4 font-display text-[clamp(2.3rem,5.5vw,4.5rem)] font-semibold leading-[1] ${dark ? "text-white" : ""}`}>
        {title} <span className="text-brand-orange">{accent}</span>
      </h2>
    </div>
  );
}

/* ---------- 3. Why us ---------- */
const whyIcons = ["◎", "▤", "$", "✦"];
export function WhyUs() {
  return (
    <section aria-labelledby="why" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Heading eyebrow={whyUs.eyebrow} title={whyUs.title} accent={whyUs.accent} />
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
export function Work() {
  return (
    <section id="work" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <Heading {...workSection} />
      <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2">
        {work.map((w, i) => (
          <WorkCard key={w.category} item={w} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ---------- 6. Testimonials (visibility rules: showTestimonials in content.ts) ---------- */
function TRow({ items, reverse }: { items: typeof visibleTestimonials; reverse?: boolean }) {
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
              {showPlaceholderLabel && !t.approved && (
                <span className="rounded-full border border-dashed border-brand-orange/70 bg-brand-orange/10 px-2.5 py-0.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-brand-orange">
                  Placeholder
                </span>
              )}
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

export function Testimonials() {
  const half = Math.ceil(visibleTestimonials.length / 2);
  return (
    <section aria-label="Testimonials" className="bg-brand-black text-white section-y">
      <Heading {...testimonialsSection} dark className="mx-auto max-w-7xl px-5 sm:px-6" />
      <div className="mt-16 space-y-4">
        <TRow items={visibleTestimonials.slice(0, half)} />
        <TRow items={visibleTestimonials.slice(half)} reverse />
      </div>
    </section>
  );
}

/* ---------- 7. Team ---------- */
export function Team() {
  return (
    <section id="team" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <Heading {...teamSection} />
      <ul className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {team.map((member, i) => (
          <li key={member.slug} {...revealProps(i * 0.07)} className="group">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)]"
              style={{ background: member.tint }}
            >
              {/* TODO: replace with real team photos */}
              <Image
                src={`/team/${member.slug}.svg`}
                alt={`Illustrated portrait of ${member.name}`}
                fill
                unoptimized
                className="object-contain object-bottom p-3 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-ink-2">{member.role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
