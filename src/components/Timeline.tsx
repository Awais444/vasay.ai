"use client";

import { useRef } from "react";
import { useLazyGsap } from "@/lib/gsap-lazy";
import type { Service } from "@/lib/services";
import { Heading } from "./StaticSections";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Service process timeline: the line draws in on scroll (GSAP, loaded lazily). */
export default function Timeline({ steps }: { steps: Service["process"] }) {
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
