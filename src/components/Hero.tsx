"use client";

import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { hero, marquee } from "@/lib/content";
import { Star } from "./Logo";
import HeroBackground from "./HeroBackground";
import { whenPageReady } from "@/lib/transition";

gsap.registerPlugin(useGSAP);

/** Sets --nav-h to the navbar's real bottom edge (+16px breathing room) so the hero spacer matches it. */
function useNavHeight() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header.vt-navbar");
    if (!header) return;
    const set = () =>
      document.documentElement.style.setProperty("--nav-h", `${header.offsetTop + header.offsetHeight + 16}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);
}

const spring = { stiffness: 60, damping: 20, mass: 0.6 };

/** Vertical gaps that compress on short screens (see .hero-gap in globals.css). */
const gap = "hero-gap";

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true">
      <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const chip = "float rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md";

/** Above-the-fold hero: always exactly one screen tall. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useNavHeight();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);
  const chipX = useTransform(sx, (v) => v * 14);
  const chipY = useTransform(sy, (v) => v * 14);
  const chipX2 = useTransform(sx, (v) => v * -18);
  const chipY2 = useTransform(sy, (v) => v * -18);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Paused: the "from" states apply now, playback waits for the page transition to finish.
        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.from(".hero-line", { yPercent: 110, duration: 1.3, stagger: 0.12 }, 0.15)
          .from(".hero-fade", { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.45)
          .from(".hero-cue", { opacity: 0, duration: 1 }, 1.1);
        return whenPageReady(() => tl.play());
      });
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      onMouseMove={onMove}
      // Grid: [navbar spacer] [content] [scroll cue]. Sizes in globals.css (.hero-screen).
      className="hero-screen relative isolate overflow-hidden bg-accent text-white"
    >
      <div aria-hidden="true" />
      <HeroBackground ringsClassName="top-1/2" />

      {/* Floating chips: side gutters only, ≥1280px wide and ≥760px tall */}
      <div aria-hidden="true" className="hero-chips pointer-events-none absolute inset-0 -z-[5]">
        <motion.div style={{ x: chipX, y: chipY }} className="absolute left-[2.5%] top-[24%]">
          <div className={`${chip} flex items-center gap-3 px-4 py-3`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/90 text-[13px] font-bold text-brand-black">✓</span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold">{hero.chips.lead.title}</span>
              <span className="text-white/75">{hero.chips.lead.meta}</span>
            </span>
          </div>
        </motion.div>
        <motion.div style={{ x: chipX2, y: chipY2 }} className="absolute right-[2.5%] top-[24%]">
          <div className={`${chip} flex items-center gap-3 px-4 py-3 [animation-delay:-2s]`}>
            <span className="h-2.5 w-2.5 rounded-full bg-brand-orange shadow-[0_0_10px_var(--brand-orange)]" />
            <span className="text-sm leading-tight">
              <span className="block font-semibold">{hero.chips.ads.title}</span>
              <span className="text-white/75">{hero.chips.ads.meta}</span>
            </span>
          </div>
        </motion.div>
        <motion.div style={{ x: chipX2, y: chipY }} className="absolute bottom-[20%] left-[4%]">
          <div className={`${chip} rounded-full px-4 py-2 text-sm font-semibold [animation-delay:-4s]`}>{hero.chips.brand.title}</div>
        </motion.div>
        <motion.div style={{ x: chipX, y: chipY2 }} className="absolute bottom-[16%] right-[3.5%]">
          <div className={`${chip} p-4 [animation-delay:-3s]`}>
            <div className="flex h-12 items-end gap-1.5">
              {[35, 55, 45, 70, 60, 100].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} className={`w-2.5 rounded-sm ${i === 5 ? "bg-brand-orange" : "bg-white/60"}`} />
              ))}
            </div>
            <p className="mt-2 text-[13px] text-white/75">{hero.chips.chart.title}</p>
          </div>
        </motion.div>
      </div>

      <div className="hero-content mx-auto w-full max-w-7xl px-4 py-4 text-center sm:px-6">
        <p className="hero-fade mx-auto inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-4 text-[13px] ring-1 ring-white/20 backdrop-blur sm:text-sm">
          <span className="shrink-0 rounded-full bg-brand-orange px-2.5 py-1 font-semibold text-white">{hero.badge}</span>
          <span className="truncate text-white/90">{hero.trust}</span>
        </p>

        {/* Size follows both width and height so it fits one screen. */}
        <h1 className={`${gap} hero-h1 font-display font-semibold tracking-[-0.045em]`}>
          {hero.lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span className={`hero-line block ${i === hero.lines.length - 1 ? "text-brand-orange" : ""}`}>{line}</span>
            </span>
          ))}
        </h1>

        <p className={`hero-fade hero-sub mx-auto ${gap} text-white/85`}>{hero.sub}</p>

        <div className={`hero-fade ${gap} flex flex-col items-center justify-center gap-3 sm:flex-row`}>
          <a
            href={hero.primaryCta.href}
            className="group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-6 pr-1.5 font-semibold text-accent shadow-[0_10px_40px_rgb(0_0_0/0.15)] transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5"
          >
            {hero.primaryCta.label}
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white">
              <ButtonArrow dir="up-right" />
            </span>
          </a>
          <a
            href={hero.secondaryCta.href}
            className={`hero-btn ${arrowLink} rounded-full px-6 font-semibold ring-1 ring-white/40 transition-colors duration-300 hover:bg-white/10`}
          >
            {hero.secondaryCta.label}
            <ButtonArrow />
          </a>
        </div>

        <ul className={`hero-fade ${gap} flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/85`}>
          {hero.checks.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <Check />
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* Row 3: scroll cue, below the checkmarks (hidden on screens shorter than 760px) */}
      <div className="hero-cue-row items-start justify-center">
        <a
          href="#intro"
          aria-label="Scroll to see what we do"
          className="hero-cue flex flex-col items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.18em] text-white/75 hover:text-white"
        >
          Scroll
          <span className="relative block h-7 w-px overflow-hidden bg-white/25">
            <span className="scroll-cue-line absolute inset-x-0 top-0 h-1/2 bg-white" />
          </span>
        </a>
      </div>

      {/* Row 4: subtle services marquee, fully inside the hero. The 40px below it is where the next section overlaps. */}
      <div className="hero-marquee marquee relative overflow-hidden border-t border-white/15">
        <div className="marquee-track flex w-max">
          {[0, 1].map((k) => (
            <ul key={k} aria-hidden={k === 1} className="flex shrink-0 items-center">
              {marquee.map((m) => (
                <li key={m} className="flex items-center gap-5 px-2.5">
                  {m}
                  <Star size={10} className="text-brand-orange/70" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
