"use client";

import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/TransitionLink";
import { m } from "framer-motion";
import { useLazyGsap } from "@/lib/gsap-lazy";
import {
  stats,
  manifesto,
  servicesSection,
  services,
  whyUs,
  process,
  workSection,
  work,
  testimonialsSection,
  visibleTestimonials,
  showPlaceholderLabel,
  teamSection,
  team,
  faqSection,
  faqs,
} from "@/lib/content";
import { Star } from "./Logo";
import { ServiceIconBox } from "./ServiceIcon";
import RichText from "./RichText";


const ease = [0.22, 1, 0.36, 1] as const;
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

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

export const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  // Starts when ~10% of the element is in view; `once` so it can never get stuck half-faded.
  viewport: { once: true, amount: 0.1, margin: "0px 0px -10% 0px" },
  transition: { duration: 0.9, ease },
};

/* ---------- 1. Stats + manifesto ---------- */
export function Stats({
  withManifesto = true,
  overlapHero = false,
}: {
  withManifesto?: boolean;
  /** Homepage: pull up 40px over the hero (below its marquee) with rounded top corners. */
  overlapHero?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  useLazyGsap(
    (gsap) => {
      gsap.utils.toArray<HTMLElement>(".count").forEach((el) => {
        const end = Number(el.dataset.end);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = Math.round(obj.v).toString()),
        });
      });
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (!withManifesto) return;
        gsap.fromTo(
          ".mword",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: { trigger: ".manifesto", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });
    },
    root,
  );

  return (
    <section
      ref={root}
      id={overlapHero ? "intro" : undefined}
      aria-label="About"
      className={
        overlapHero
          ? "relative z-10 -mt-10 rounded-t-[40px] bg-brand-bg pb-[var(--section-y)] pt-[clamp(80px,9vw,120px)] tone-light"
          : "section-y tone-light"
      }
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[18px] border border-brand-silver bg-white p-3.5 sm:rounded-[var(--radius-card)] sm:p-8">
            <p className="font-display text-[clamp(28px,9vw,40px)] font-semibold leading-none tracking-[-0.05em] text-accent sm:text-7xl">
              <span className="count" data-end={s.value}>
                {s.value}
              </span>
              <span className="text-brand-orange">{s.suffix}</span>
            </p>
            <p className="mt-2 text-[13px] leading-snug text-ink-2 sm:mt-3 sm:text-base">{s.label}</p>
          </div>
        ))}
      </div>
      {withManifesto && (
      <p className="manifesto mt-24 max-w-5xl font-display text-[clamp(1.6rem,3.6vw,3rem)] font-medium leading-[1.2] tracking-[-0.03em]">
        {manifesto.split(" ").map((w, i) => (
          <span key={i} className="mword">
            {w}{" "}
          </span>
        ))}
      </p>
      )}
      </div>
    </section>
  );
}

/* ---------- 2. Services ---------- */
export function Services() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="services" className="bg-white section-y tone-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-end">
          <Heading {...servicesSection} />
          <p className="text-lg text-ink-2">{servicesSection.intro}</p>
        </div>
        <ul className="mt-16 border-t border-brand-silver">
          {services.map((s, i) => {
            const on = open === i;
            return (
              <li key={s.title} className="border-b border-brand-silver" onMouseEnter={() => setOpen(i)}>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`svc-${i}`}
                  onClick={() => setOpen(on ? null : i)}
                  className="group flex w-full items-center gap-4 py-6 text-left sm:gap-8 sm:py-7"
                >
                  <span className="w-8 font-display text-sm text-ink-2">{String(i + 1).padStart(2, "0")}</span>
                  <ServiceIconBox name={s.icon} active={on} className="hidden sm:flex" />
                  <span
                    className={`flex-1 font-display text-2xl font-semibold tracking-tight transition-colors duration-300 sm:text-4xl ${
                      on ? "text-accent" : ""
                    }`}
                  >
                    {s.title}
                  </span>
                  <span className="hidden text-sm text-ink-2 md:block">{s.tag}</span>
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-[var(--ease-out-expo)] ${
                      on ? "rotate-45 border-accent bg-accent text-white" : "border-brand-silver"
                    }`}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                {/* Always rendered (crawlable); collapsed visually with grid rows. */}
                <div
                  id={`svc-${i}`}
                  inert={!on}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${
                    on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-4 pb-8 pl-12 sm:flex-row sm:items-end sm:justify-between sm:pl-16">
                        <p className="max-w-xl text-ink-2 sm:text-lg">{s.description}</p>
                        <span className="flex shrink-0 gap-5">
                          <Link href={s.href} className={`${arrowLink} font-semibold text-accent hover:text-accent-bright`}>
                            Learn more<span className="sr-only"> about {s.title}</span>
                            <ButtonArrow size={16} />
                          </Link>
                          <a href="#contact" className={`${arrowLink} font-semibold text-ink-2 hover:text-accent`}>
                            Discuss this<span className="sr-only"> service: {s.title}</span>
                            <ButtonArrow size={16} />
                          </a>
                        </span>
                      </div>
                    </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
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
            <m.div
              key={it.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
              className="group flex h-full flex-col rounded-[var(--radius-card)] border border-brand-silver bg-white p-8 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-xl text-white">
                {whyIcons[i]}
              </span>
              <h3 className="mt-8 text-2xl font-semibold">{it.title}</h3>
              <p className="mt-3 text-base text-ink-2 sm:text-[17px]">{it.body}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Process: Expanding Panels ---------- */
const PROCESS_GRADIENTS = [
  "linear-gradient(150deg, var(--accent), var(--accent-deep))",
  "linear-gradient(150deg, var(--accent-bright), var(--accent))",
  "linear-gradient(150deg, #FF3600, #FF7001)",
  "linear-gradient(150deg, #3A3940, #141317)",
];
const AUTOPLAY_MS = 3500;

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {items.map((c) => (
        <li key={c} className="rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-medium ring-1 ring-white/25">
          {c}
        </li>
      ))}
    </ul>
  );
}

const panelStagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const panelItem = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export function Process() {
  const steps = process.steps;
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const desktop = useMedia("(min-width: 1024px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");

  const running = autoplay && desktop && !reduced && inView && !hovering && !focused;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % steps.length), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [running, active, steps.length]);

  // Any manual interaction stops auto-play for good.
  const choose = (i: number) => {
    setAutoplay(false);
    setActive(i);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key;
    const dir = k === "ArrowRight" ? 1 : k === "ArrowLeft" ? -1 : 0;
    const edge = k === "Home" ? 0 : k === "End" ? steps.length - 1 : -1;
    if (!dir && edge < 0) return;
    e.preventDefault();
    const next = edge >= 0 ? edge : (active + dir + steps.length) % steps.length;
    choose(next);
    tabs.current[next]?.focus();
  };

  const flexEase = "transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

  return (
    <section id="process" ref={root} className="bg-brand-black text-white section-y">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <m.div {...reveal}>
          <Heading eyebrow={process.eyebrow} title={process.title} accent={process.accent} dark />
        </m.div>

        {/* Desktop: expanding panels */}
        <m.div
          role="group"
          aria-label="Our process"
          variants={panelStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
          }}
          className="mt-14 hidden h-[520px] gap-3 lg:flex"
        >
          {steps.map((s, i) => {
            const on = i === active;
            return (
              <m.div
                key={s.num}
                variants={panelItem}
                style={{ flexGrow: on ? 3.2 : 1 }}
                className={`relative basis-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#1F1E24] ${flexEase}`}
                onMouseEnter={() => choose(i)}
              >
                {/* Gradient fades in on the active panel */}
                <div
                  aria-hidden="true"
                  style={{ background: PROCESS_GRADIENTS[i] }}
                  className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${on ? "opacity-100" : "opacity-0"}`}
                />

                {/* Collapsed state: vertical title and small number */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 flex flex-col justify-between p-7 transition-opacity duration-300 motion-reduce:transition-none ${on ? "opacity-0" : "opacity-100"}`}
                >
                  <span className="rotate-180 self-start font-display text-[22px] font-medium text-white/75 [writing-mode:vertical-rl]">
                    {s.title}
                  </span>
                  <span className="font-display text-[64px] font-semibold leading-none tracking-[-0.04em] text-brand-orange">{s.num}</span>
                </div>

                {/* Expanded content. The min-width stops text reflowing while the panel grows. */}
                <div
                  id={`process-panel-${i}`}
                  role="region"
                  aria-labelledby={`process-tab-${i}`}
                  aria-hidden={!on}
                  className="pointer-events-none absolute inset-0 min-w-[420px] p-9"
                >
                  <div
                    className={`flex h-full flex-col justify-between transition-[opacity,transform] motion-reduce:transition-none ${
                      on ? "translate-y-0 opacity-100 delay-150 duration-500" : "translate-y-5 opacity-0 duration-200"
                    }`}
                  >
                    <span className="font-display text-[110px] font-semibold leading-[0.85] tracking-[-0.05em]">{s.num}</span>
                    <div>
                      <span className="inline-block rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-white/25">{s.time}</span>
                      <h3 className="mt-5 text-[44px] font-semibold leading-none">{s.title}</h3>
                      <p className="mt-4 max-w-[440px] text-[17px] leading-relaxed text-white/85">{s.body}</p>
                      <Chips items={s.chips} />
                    </div>
                  </div>
                </div>

                {/* The whole panel is the tab button */}
                <button
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  id={`process-tab-${i}`}
                  aria-expanded={on}
                  aria-controls={`process-panel-${i}`}
                  onClick={() => choose(i)}
                  className="absolute inset-0 rounded-[28px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                >
                  <span className="sr-only">
                    Step {s.num}: {s.title}
                  </span>
                </button>

                {/* Auto-play progress */}
                {on && running && (
                  <m.span
                    key={`progress-${active}`}
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left bg-brand-orange"
                  />
                )}
              </m.div>
            );
          })}
        </m.div>

        {/* Mobile and tablet: accordion (no auto-play) */}
        <ul className="mt-12 space-y-3 lg:hidden">
          {steps.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.num} className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#1F1E24]">
                <div
                  aria-hidden="true"
                  style={{ background: PROCESS_GRADIENTS[i] }}
                  className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${on ? "opacity-100" : "opacity-0"}`}
                />
                <h3 className="relative">
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`process-acc-${i}`}
                    onClick={() => choose(i)}
                    className="flex h-[90px] w-full items-center gap-5 px-6 text-left"
                  >
                    <span className={`font-display text-4xl font-semibold tracking-[-0.04em] ${on ? "text-white" : "text-brand-orange"}`}>
                      {s.num}
                    </span>
                    <span className="flex-1 font-display text-2xl font-semibold">{s.title}</span>
                    <span className={`text-sm font-semibold ${on ? "text-white/85" : "text-white/75"}`}>{s.time}</span>
                  </button>
                </h3>
                <div
                  id={`process-acc-${i}`}
                  className={`relative grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden" inert={!on}>
                    <div
                      className={`px-6 pb-7 transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
                        on ? "translate-y-0 opacity-100 delay-150" : "translate-y-5 opacity-0"
                      }`}
                    >
                      <p className="text-[17px] leading-relaxed text-white/85">{s.body}</p>
                      <Chips items={s.chips} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex justify-center">
          <a
            href={process.cta.href}
            className={`${arrowLink} rounded-full bg-brand-orange px-7 py-4 font-semibold text-white transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5`}
          >
            {process.cta.label}
            <ButtonArrow />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. Work ---------- */
function WorkCard({ item, index }: { item: (typeof work)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useLazyGsap(
    (gsap) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".parallax",
          { yPercent: -8 },
          { yPercent: 8, ease: "none", scrollTrigger: { trigger: ref.current, scrub: true } },
        );
      });
    },
    ref,
  );
  return (
    <m.div ref={ref} {...reveal} className={index % 2 ? "md:mt-24" : ""}>
      <Link href={item.href} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
          <div className={`parallax absolute -inset-y-[10%] inset-x-0 bg-gradient-to-br ${item.gradient} transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105`}>
            {item.image ? (
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center font-display text-[12vw] font-semibold tracking-tighter text-white/15 md:text-[6vw]" aria-hidden="true">
                {item.category.split(/[ &+]/)[0]}
              </span>
            )}
          </div>
          <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-brand-black">
            {item.category}
          </span>
          <span className="absolute right-5 top-5 flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-white text-brand-black opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100" aria-hidden="true">
            <ButtonArrow dir="up-right" size={20} nudge={false} />
          </span>
        </div>
        <h3 className="mt-5 text-2xl font-semibold">{item.title}</h3>
        <p className="mt-2 text-base text-ink-2 sm:text-[17px]">{item.description}</p>
        {/* Only real, verified results belong here (see TODO in content.ts). */}
        {item.result && <p className="mt-2 text-sm font-semibold text-accent">{item.result}</p>}
      </Link>
    </m.div>
  );
}

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
          <m.li key={member.slug} {...reveal} transition={{ ...reveal.transition, delay: i * 0.07 }} className="group">
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
          </m.li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- 8. FAQ: pinned left column (CSS sticky) ---------- */
export function Faq({
  items = faqs,
  heading = faqSection,
  id = "faq",
  overlap = false,
}: {
  items?: { q: string; a: string }[];
  heading?: { eyebrow: string; title: string; accent: string; intro?: string };
  id?: string;
  /** Pull up 40px over a dark section above, with rounded top corners (like the hero hand-off). */
  overlap?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const [current, setCurrent] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const intro = heading.intro ?? faqSection.intro;

  // Progress: the question nearest the viewport centre.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      [...list.children].forEach((li, i) => {
        const r = li.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setCurrent(best);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id={id}
      className={`bg-white section-y tone-white ${overlap ? "relative z-10 -mt-10 rounded-t-[40px]" : ""}`}
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:items-start">
        {/* Left column: sticky on desktop. The pin ends naturally where the grid (the questions) ends. */}
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+40px)]">
          <Heading eyebrow={heading.eyebrow} title={heading.title} accent={heading.accent} />
          {intro && <p className="mt-6 max-w-md text-base text-ink-2 sm:text-[17px]">{intro}</p>}

          <div className="mt-8 hidden max-w-xs lg:block" aria-hidden="true">
            <p className="font-display text-sm font-semibold tabular-nums text-ink-2">
              <span className="text-brand-black">{pad(current + 1)}</span> / {pad(items.length)}
            </p>
            <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-brand-silver">
              <div
                className="h-full origin-left rounded-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)]"
                style={{ transform: `scaleX(${(current + 1) / items.length})` }}
              />
            </div>
          </div>

          <a
            href={faqSection.cta.href}
            className="mt-8 inline-flex rounded-full bg-accent px-6 py-4 font-semibold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-accent-bright"
          >
            {faqSection.cta.label}
          </a>
        </div>

        <ul ref={listRef} className="divide-y divide-brand-silver border-y border-brand-silver">
          {items.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`${id}-${i}`}
                    onClick={() => setOpen(on ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold sm:text-xl"
                  >
                    {f.q}
                    <span
                      aria-hidden="true"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-[var(--ease-out-expo)] ${
                        on ? "rotate-45 bg-accent text-white" : "bg-brand-bg"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                {/* Always rendered (crawlable, matches FAQPage schema); collapsed visually with grid rows. */}
                <div
                  id={`${id}-${i}`}
                  inert={!on}
                  className={`grid transition-[grid-template-rows,opacity] duration-[450ms] ease-[var(--ease-out-expo)] ${
                    on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-base text-ink-2 sm:text-[17px]">
                      <RichText text={f.a} />
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
