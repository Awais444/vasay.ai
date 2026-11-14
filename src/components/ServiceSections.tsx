"use client";

import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import { useRef } from "react";
import Link from "@/components/TransitionLink";
import { m } from "framer-motion";
import { useLazyGsap } from "@/lib/gsap-lazy";
import {
  History,
  Copy,
  Shuffle,
  Smartphone,
  MousePointerClick,
  Signpost,
  Timer,
  Puzzle,
  Wrench,
  TrendingDown,
  MapPinOff,
  Filter,
  CalendarX,
  Clock,
  HeartCrack,
  Flame,
  MousePointer2,
  HelpCircle,
  Snowflake,
  BellOff,
  CalendarX2,
  Bug,
  DatabaseBackup,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import type { ProblemIconName, Service } from "@/lib/services";
import { Heading, reveal } from "./Sections";


const pad = (i: number) => String(i + 1).padStart(2, "0");

const PROBLEM_ICONS: Record<ProblemIconName, LucideIcon> = {
  History,
  Copy,
  Shuffle,
  Smartphone,
  MousePointerClick,
  Signpost,
  Timer,
  Puzzle,
  Wrench,
  TrendingDown,
  MapPinOff,
  Filter,
  CalendarX,
  Clock,
  HeartCrack,
  Flame,
  MousePointer2,
  HelpCircle,
  Snowflake,
  BellOff,
  CalendarX2,
  Bug,
  DatabaseBackup,
  ShieldAlert,
};

function ProblemIcon({ name }: { name: ProblemIconName }) {
  const Icon = PROBLEM_ICONS[name];
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#FFF1EB] text-brand-red transition-colors duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-brand-red group-hover:text-white">
      <Icon
        size={22}
        strokeWidth={1.75}
        aria-hidden="true"
        className="transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-6"
      />
    </span>
  );
}

export function Problems({ items }: { items: Service["problems"] }) {
  return (
    <section aria-labelledby="problems" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <Heading eyebrow="The problem" title="Sound" accent="familiar?" />
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {items.map((p, i) => (
          <m.div
            key={p.title}
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.08 }}
            className="group flex flex-col rounded-[var(--radius-card)] border border-brand-silver bg-white p-8 transition-[transform,border-color] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[rgba(255,54,0,0.25)]"
          >
            <ProblemIcon name={p.icon} />
            <h3 className="mt-8 text-2xl font-semibold">{p.title}</h3>
            <p className="mt-3 text-base text-ink-2 sm:text-[17px]">{p.body}</p>
            <div className="mt-auto pt-7">
              <a
                href="#included"
                className="flex items-center gap-2 border-t border-brand-silver pt-5 text-sm font-semibold text-accent transition-colors hover:text-accent-bright"
              >
                How we fix it
                <ButtonArrow size={16} />
              </a>
            </div>
          </m.div>
        ))}
      </div>
    </section>
  );
}

export function Included({ items, title }: { items: Service["included"]; title: string }) {
  return (
    <section id="included" className="bg-white section-y tone-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <Heading eyebrow={title} title="What's" accent="included." />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <m.li
              key={it.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 3) * 0.08 }}
              className="group rounded-[var(--radius-card)] border border-brand-silver bg-brand-bg p-7 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-display text-sm font-semibold text-white transition-colors group-hover:bg-brand-orange">
                {pad(i)}
              </span>
              <h3 className="mt-6 text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-base text-ink-2 sm:text-[17px]">{it.body}</p>
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Tick() {
  return (
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white">
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Deliverables({ service }: { service: Service }) {
  return (
    <section aria-label="Deliverables" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <Heading eyebrow="Deliverables" title="What you" accent="walk away with." />
          {service.note && (
            <p className="mt-8 rounded-[var(--radius-card)] border border-brand-orange/30 bg-brand-orange/[0.06] p-6 text-ink-2">
              <strong className="font-semibold text-brand-black">Good to know: </strong>
              {service.note}
            </p>
          )}
        </div>
        <div className="space-y-6">
          <ul className="rounded-[var(--radius-card)] border border-brand-silver bg-white p-4 sm:p-6">
            {service.deliverables.map((d) => (
              <li key={d} className="flex gap-4 border-b border-brand-silver p-3 text-lg last:border-0 sm:p-4">
                <Tick />
                {d}
              </li>
            ))}
          </ul>
          {service.extraList && (
            <div className="rounded-[var(--radius-card)] bg-brand-black p-7 text-white">
              <h3 className="text-xl font-semibold">{service.extraList.title}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {service.extraList.items.map((x) => (
                  <li key={x} className="rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Timeline({ steps }: { steps: Service["process"] }) {
  const root = useRef<HTMLElement>(null);
  useLazyGsap(
    (gsap) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".tl-line",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".tl-list", start: "top 70%", end: "bottom 60%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>(".tl-step").forEach((el) => {
          gsap.from(el, { opacity: 0, y: 24, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 80%", once: true } });
        });
      });
    },
    root,
  );
  return (
    <section ref={root} aria-label="How it works" className="bg-accent-deep text-white section-y">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Heading eyebrow="How it works" title="Four steps," accent="no surprises." dark />
        </div>
        <ol className="tl-list relative space-y-10 pl-12 sm:pl-16">
          <span aria-hidden="true" className="absolute bottom-2 left-[19px] top-2 w-px bg-white/15 sm:left-[23px]">
            <span className="tl-line block h-full w-full origin-top bg-brand-orange" />
          </span>
          {steps.map((s, i) => (
            <li key={s.title} className="tl-step relative">
              <span className="absolute -left-12 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange font-display text-sm font-semibold sm:-left-16 sm:h-12 sm:w-12">
                {pad(i)}
              </span>
              <h3 className="text-2xl font-semibold sm:text-3xl">{s.title}</h3>
              <p className="mt-2 max-w-lg text-white/75">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Related({ items }: { items: Pick<Service, "slug" | "title" | "tag" | "description">[] }) {
  return (
    <section aria-label="Related services" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <Heading eyebrow="Related services" title="Works even better" accent="together." />
        <Link href="/services" className={`${arrowLink} shrink-0 font-semibold text-accent hover:text-accent-bright`}>
          All services
          <ButtonArrow size={16} />
        </Link>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {items.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="group flex flex-col rounded-[var(--radius-card)] border border-brand-silver bg-white p-8 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
          >
            <span className="text-sm font-semibold text-brand-orange">{s.tag}</span>
            <h3 className="mt-3 text-2xl font-semibold">{s.title}</h3>
            <p className="mt-3 flex-1 text-ink-2">{s.description}</p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-accent">
              Explore
              <ButtonArrow />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
