"use client";

import { useEffect, useState } from "react";

/** Prev/next buttons for a CSS scroll-snap track (found by id). Scrolls by one card; disabled at the ends. */
export default function CarouselArrows({ targetId, label }: { targetId: string; label: string }) {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  const go = (dir: 1 | -1) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > li");
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduced ? "auto" : "smooth" });
  };

  const btn =
    "flex h-12 w-12 items-center justify-center rounded-full border border-brand-silver bg-white text-brand-black transition-[background-color,color,border-color,opacity] duration-300 hover:border-accent hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className="flex gap-2" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => go(-1)} disabled={!canPrev} aria-label="Previous" aria-controls={targetId}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button type="button" className={btn} onClick={() => go(1)} disabled={!canNext} aria-label="Next" aria-controls={targetId}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
