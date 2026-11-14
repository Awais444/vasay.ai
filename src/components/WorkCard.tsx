"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "@/components/TransitionLink";
import ButtonArrow from "@/components/ButtonArrow";
import { useLazyGsap } from "@/lib/gsap-lazy";
import { revealProps } from "@/lib/reveal";
import type { work } from "@/lib/content";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Work card with a scroll parallax image (GSAP, loaded lazily). */
export default function WorkCard({ item, index }: { item: (typeof work)[number]; index: number }) {
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
    <div ref={ref} {...revealProps()} className={index % 2 ? "md:mt-24" : ""}>
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
    </div>
  );
}
