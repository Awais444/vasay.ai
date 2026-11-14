"use client";

import type { ReactNode } from "react";
import { matches, setSearchQuery, useSearchQuery } from "@/lib/search-store";

/**
 * Swaps the normal listing for filtered results while a search is active. The cards are rendered on
 * the server and passed in (`cards`, in the same order as `texts`); this only shows or hides them.
 */
export default function InsightsResults({ texts, cards, children }: { texts: string[]; cards: ReactNode[]; children: ReactNode }) {
  const q = useSearchQuery();
  if (!q) return <>{children}</>;

  const hits = texts.map((t, i) => (matches(t, q) ? i : -1)).filter((i) => i >= 0);
  return (
    <div aria-live="polite">
      <p className="text-lg text-ink-2">
        <strong className="text-brand-black">{hits.length}</strong> {hits.length === 1 ? "result" : "results"} for &lsquo;{q}&rsquo;
      </p>
      {hits.length ? (
        <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {hits.map((i) => (
            <li key={i}>{cards[i]}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-[28px] border border-dashed border-brand-silver bg-white px-6 py-14 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight">No articles match &lsquo;{q}&rsquo;</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              const url = new URL(window.location.href);
              url.searchParams.delete("q");
              window.history.replaceState(window.history.state, "", url);
              const input = document.querySelector<HTMLInputElement>(".search-input");
              if (input) {
                // Keep the hero box in sync
                const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
                setter?.call(input, "");
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.focus();
              }
            }}
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-accent px-6 font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
