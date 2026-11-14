"use client";

import { useEffect, type RefObject } from "react";
import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";

type Gsap = typeof GSAP;
type Loaded = { gsap: Gsap; ScrollTrigger: typeof ST };

let loading: Promise<Loaded> | null = null;
let loaded: Loaded | null = null;

/**
 * GSAP + ScrollTrigger, loaded on demand (a separate chunk, never in the critical path).
 * Every caller shares one instance.
 */
export function loadGsap(): Promise<Loaded> {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
    g.gsap.registerPlugin(s.ScrollTrigger);
    loaded = { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
    return loaded;
  });
  return loading;
}

/** ScrollTrigger.refresh() if GSAP has already been loaded; does nothing (and loads nothing) otherwise. */
export function refreshScrollTriggers() {
  loading?.then(({ ScrollTrigger }) => ScrollTrigger.refresh());
}

/** Keep ScrollTriggers in sync with Lenis' smooth scroll (no-op until GSAP is loaded). */
export function updateScrollTriggers() {
  loaded?.ScrollTrigger.update();
}

/**
 * Like useGSAP, but GSAP is imported lazily. `setup` runs inside a gsap.context scoped to `scope`,
 * so every tween, ScrollTrigger and matchMedia it creates is reverted on unmount.
 */
export function useLazyGsap(setup: (gsap: Gsap, ScrollTrigger: typeof ST) => void, scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let ctx: ReturnType<Gsap["context"]> | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !scope.current) return;
      ctx = gsap.context(() => setup(gsap, ScrollTrigger), scope.current);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
