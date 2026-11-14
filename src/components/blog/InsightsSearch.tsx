"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Search, X } from "lucide-react";
import { setSearchQuery } from "@/lib/search-store";

/**
 * Search box in the Insights hero. No dropdown: the (debounced, 200ms) query filters the article
 * grid below in place (InsightsResults). Enter writes ?q= to the URL so a search can be shared.
 */
export default function InsightsSearch({ enabled = true }: { enabled?: boolean }) {
  const id = useId();
  const [value, setValue] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Start from ?q= when the page is opened with a search.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") ?? "";
    if (!q) return;
    // After hydration (the server render has no query), so the input and grid pick it up.
    const t = setTimeout(() => {
      setValue(q);
      if (enabled) setSearchQuery(q);
    }, 0);
    return () => clearTimeout(t);
  }, [enabled]);

  useEffect(() => () => {
    clearTimeout(timer.current);
    setSearchQuery("");
  }, []);

  const update = (v: string) => {
    setValue(v);
    if (!enabled) return; // no articles yet: nothing to filter, no popup
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSearchQuery(v.trim()), 200);
  };

  const commit = () => {
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set("q", value.trim());
    else url.searchParams.delete("q");
    window.history.replaceState(window.history.state, "", url);
    if (enabled) {
      clearTimeout(timer.current);
      setSearchQuery(value.trim());
    }
  };

  const clear = () => {
    update("");
    if (enabled) setSearchQuery("");
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    window.history.replaceState(window.history.state, "", url);
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        commit();
      }}
      style={{ "--i": 2 } as CSSProperties}
      className="ph-fade ph-gap-lg mx-auto w-full max-w-xl text-left"
    >
      <label htmlFor={id} className="sr-only">
        Search articles
      </label>
      <div className="search-pill">
        <Search size={20} strokeWidth={2} aria-hidden="true" className="shrink-0 text-ink-2" />
        <input
          id={id}
          type="text"
          role="searchbox"
          enterKeyHint="search"
          value={value}
          onChange={(e) => update(e.target.value)}
          placeholder="Search articles, e.g. Google Maps"
          autoComplete="off"
          className="search-input"
        />
        {value && (
          <button type="button" onClick={clear} aria-label="Clear search" className="search-clear">
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  );
}
