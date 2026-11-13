"use client";

import ButtonArrow, { arrowLink, type ArrowDir } from "@/components/ButtonArrow";
import { useRef, type ReactNode } from "react";
import Link from "@/components/TransitionLink";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import HeroBackground from "./HeroBackground";
import { Star } from "./Logo";
import { ServiceIcon } from "./ServiceIcon";
import type { ServiceIconName } from "@/lib/services";
import { whenPageReady } from "@/lib/transition";

gsap.registerPlugin(useGSAP);

type Crumb = { label: string; href?: string };

/** Blue inner-page hero, matching the homepage hero (same background and line reveal). */
export default function PageHero({
  crumbs,
  eyebrow,
  icon,
  title,
  accent,
  accentLead,
  sub,
  primary,
  secondary,
  visual,
  children,
}: {
  crumbs?: Crumb[];
  eyebrow?: string;
  /** Service icon shown in the eyebrow pill (service pages). */
  icon?: ServiceIconName;
  title: string;
  accent: string;
  /** Optional white text before the orange accent on line 2. */
  accentLead?: string;
  sub?: string;
  primary?: { label: string; href: string };
  /** `icon`: arrow direction after the label (default "right"). */
  secondary?: { label: string; href: string; icon?: ArrowDir };
  visual?: ReactNode;
  children?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Paused: the "from" states apply now, playback waits for the page transition to finish.
        const tl = gsap
          .timeline({ paused: true, defaults: { ease: "expo.out" } })
          .from(".ph-line", { yPercent: 110, duration: 1.3, stagger: 0.12 }, 0.1)
          .from(".ph-fade", { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.35)
          .from(".ph-visual", { y: 40, opacity: 0, duration: 1.4 }, 0.5);
        return whenPageReady(() => tl.play());
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="page-hero-screen relative isolate overflow-clip bg-accent text-white">
      <HeroBackground ringsClassName={visual ? "top-[45%] lg:left-[72%]" : "top-1/2"} />
      <div aria-hidden="true" />
      <div className={`page-hero-content mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-6 ${visual ? "lg:grid-cols-[minmax(55%,1.25fr)_1fr]" : ""}`}>
        <div className={visual ? "" : "mx-auto max-w-4xl text-center"}>
          {crumbs && (
            <nav aria-label="Breadcrumb" className={`ph-fade text-sm text-white/75 ${visual ? "" : "flex justify-center"}`}>
              <ol className="flex flex-wrap items-center gap-2">
                {crumbs.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-2">
                    {i > 0 && <ButtonArrow dir="chevron" size={14} nudge={false} className="text-white/50" />}
                    {c.href ? (
                      <Link href={c.href} className="hover:text-white">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-white">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && (
            <p className="ph-fade ph-gap inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-white/20 backdrop-blur">
              {icon ? <ServiceIcon name={icon} size={16} className="text-brand-orange" /> : <Star size={11} className="text-brand-orange" />}
              {eyebrow}
            </p>
          )}
          <h1
            className={`ph-gap font-display font-semibold tracking-[-0.045em] ${
              visual ? "text-[clamp(40px,4.6vw,72px)] leading-[1]" : "ph-h1"
            }`}
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="ph-line block">{title}</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="ph-line block">
                {accentLead && <>{accentLead} </>}
                <span className="text-brand-orange">{accent}</span>
              </span>
            </span>
          </h1>
          {sub && <p className={`ph-fade ph-gap ph-sub text-white/80 ${visual ? "" : "mx-auto"}`}>{sub}</p>}
          {(primary || secondary) && (
            <div className={`ph-fade ph-gap-lg flex flex-col gap-3 sm:flex-row ${visual ? "" : "justify-center"}`}>
              {primary && (
                <a
                  href={primary.href}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 font-semibold text-accent shadow-[0_10px_40px_rgb(0_0_0/0.15)] transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5"
                >
                  {primary.label}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white">
                    <ButtonArrow dir="up-right" />
                  </span>
                </a>
              )}
              {secondary && (
                <a
                  href={secondary.href}
                  className={`${arrowLink} justify-center rounded-full px-6 py-4 font-semibold ring-1 ring-white/40 transition-colors duration-300 hover:bg-white/10`}
                >
                  {secondary.label}
                  <ButtonArrow dir={secondary.icon ?? "right"} />
                </a>
              )}
            </div>
          )}
          {children}
        </div>
        {visual && <div className="ph-visual hidden lg:block">{visual}</div>}
      </div>
    </section>
  );
}
