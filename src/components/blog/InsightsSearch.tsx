"use client";

import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Link from "@/components/TransitionLink";

export type SearchItem = { slug: string; title: string; excerpt: string; category?: string };

/** Instant search over article titles, excerpts and categories (index built with the page). */
export default function InsightsSearch({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const id = useId();
  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return items
      .filter((it) => {
        const hay = `${it.title} ${it.excerpt} ${it.category ?? ""}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
      .slice(0, 8);
  }, [q, items]);

  return (
    <div style={{ "--i": 2 } as React.CSSProperties} className="ph-fade ph-gap-lg relative mx-auto w-full max-w-xl text-left">
      <label htmlFor={id} className="sr-only">
        Search articles
      </label>
      <div className="flex items-center gap-3 rounded-full bg-white px-5 text-brand-black shadow-[0_10px_40px_rgb(0_0_0/0.15)] focus-within:ring-2 focus-within:ring-brand-orange">
        <Search size={20} strokeWidth={2} aria-hidden="true" className="shrink-0 text-ink-2" />
        <input
          id={id}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles, e.g. Google Maps"
          autoComplete="off"
          aria-controls={q.trim() ? `${id}-results` : undefined}
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-ink-2/70 focus-visible:shadow-none focus-visible:outline-none"
        />
      </div>
      {q.trim() && (
        <div
          id={`${id}-results`}
          role="region"
          aria-live="polite"
          className="absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[20px] bg-white text-brand-black shadow-[0_20px_60px_rgb(0_0_0/0.25)]"
        >
          {results.length ? (
            <ul className="max-h-[50vh] overflow-y-auto py-2">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link href={`/insights/${r.slug}`} className="block px-5 py-3 hover:bg-brand-bg">
                    <span className="block font-semibold">{r.title}</span>
                    {r.category && <span className="text-[13px] text-accent">{r.category}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-4 text-ink-2">{items.length ? "No articles match that search yet." : "No articles published yet."}</p>
          )}
        </div>
      )}
    </div>
  );
}
