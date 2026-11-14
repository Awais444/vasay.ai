"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny shared store for the Insights search: the box lives in the hero, the filtered grid in the
 * section below. Holds the debounced query.
 */
let query = "";
const listeners = new Set<() => void>();

export function setSearchQuery(q: string) {
  if (q === query) return;
  query = q;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useSearchQuery() {
  return useSyncExternalStore(subscribe, () => query, () => "");
}

/** Lower-case terms; an item matches when its text contains every term. */
export const matches = (text: string, q: string) => {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hay = text.toLowerCase();
  return terms.every((t) => hay.includes(t));
};
