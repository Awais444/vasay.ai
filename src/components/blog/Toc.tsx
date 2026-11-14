"use client";

import { useEffect, useState } from "react";
import type { Heading } from "./PostBody";

/** Sticky table of contents (desktop). Highlights the section currently being read. */
export default function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const update = () => {
      // The last heading above the upper third of the screen is the current section.
      const line = window.innerHeight * 0.3;
      let current = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headings]);

  if (headings.length < 2) return null;
  return (
    <nav aria-label="On this page" className="sticky top-[calc(var(--nav-h)+32px)]">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-2">On this page</p>
      <ol className="mt-4 space-y-1 border-l border-brand-silver">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              className={`-ml-px block border-l-2 py-1.5 text-sm leading-snug transition-colors ${h.level === 3 ? "pl-7" : "pl-4"} ${
                active === h.id ? "border-accent font-semibold text-accent" : "border-transparent text-ink-2 hover:text-brand-black"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
