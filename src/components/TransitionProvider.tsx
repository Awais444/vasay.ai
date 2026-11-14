"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { loadGsap, refreshScrollTriggers } from "@/lib/gsap-lazy";
import { getLenis } from "@/lib/lenis";
import { PAGE_NAVIGATE, PAGE_READY } from "@/lib/transition";

type Direction = "forward" | "back";
type Ctx = { navigate: (href: string) => void };

const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const MAX_WAIT = 4000;

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

function scrollTopNow() {
  const l = getLenis();
  if (l) {
    l.scrollTo(0, { immediate: true, force: true });
    l.start();
  }
  window.scrollTo(0, 0);
}

/** Wraps the page (everything except the fixed Navbar) for the GSAP fallback. */
export const PAGE_ROOT_ID = "page-root";

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const busy = useRef(false);
  const resolveRendered = useRef<(() => void) | null>(null);
  const stack = useRef<string[]>([]);
  const replaying = useRef(false);

  // Resolve the pending "new route rendered" promise once the pathname commits.
  useEffect(() => {
    const s = stack.current;
    if (s[s.length - 1] !== pathname) s.push(pathname);
    resolveRendered.current?.();
    resolveRendered.current = null;
  }, [pathname]);

  const waitForRender = useCallback(
    () =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(resolve, MAX_WAIT);
        resolveRendered.current = () => {
          window.clearTimeout(t);
          // Give the new page one frame to apply its initial (pre-intro) state. The timeout
          // covers windows where requestAnimationFrame doesn't fire.
          const done = () => resolve();
          requestAnimationFrame(done);
          window.setTimeout(done, 50);
        };
      }),
    [],
  );

  const finish = useCallback(() => {
    const html = document.documentElement;
    html.removeAttribute("data-vt");
    html.removeAttribute("data-direction");
    busy.current = false;
    refreshScrollTriggers();
    document.getElementById("main")?.focus({ preventScroll: true });
    window.dispatchEvent(new Event(PAGE_READY));
  }, []);

  /** Runs `update` (which changes the route) inside the right kind of transition. */
  const run = useCallback(
    async (update: () => void, direction: Direction) => {
      if (busy.current) return;
      busy.current = true;
      // Close menus first so they're never captured in the transition snapshot.
      window.dispatchEvent(new Event(PAGE_NAVIGATE));
      const html = document.documentElement;
      const reduced = prefersReduced();
      html.dataset.vt = reduced ? "fade" : "slide";
      html.dataset.direction = direction;
      html.style.setProperty("--vt", isMobile() ? "0.56" : "1");

      try {
        if (typeof document.startViewTransition === "function") {
          let started = false;
          const vt = document.startViewTransition(async () => {
            started = true;
            const rendered = waitForRender();
            update();
            await rendered;
            scrollTopNow();
          });
          // Watchdog: if the browser never gets a frame to snapshot the old page (e.g. a hidden
          // window), skip the animation. skipTransition() still runs the update, so navigation completes.
          const watchdog = window.setTimeout(() => {
            if (!started) vt.skipTransition();
          }, 1000);
          // A skipped transition rejects `ready`; that's expected, not an error.
          vt.ready.catch(() => {});
          await vt.finished.catch(() => {});
          window.clearTimeout(watchdog);
        } else {
          await gsapFallback(update, direction, reduced, waitForRender);
        }
      } finally {
        finish();
      }
    },
    [finish, waitForRender],
  );

  const navigate = useCallback(
    (href: string) => {
      if (busy.current) return;
      run(() => router.push(href, { scroll: false }), "forward");
    },
    [router, run],
  );

  // Browser back/forward: capture popstate before Next.js, start the transition (which snapshots
  // the old page), then replay the event to Next.js inside the transition's update callback.
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      if (replaying.current) return;
      const target = window.location.pathname;
      const s = stack.current;
      if (target === s[s.length - 1]) return; // hash-only change
      if (busy.current) return;
      e.stopImmediatePropagation();
      const back = s[s.length - 2] === target;
      if (back) s.pop();
      run(() => {
        replaying.current = true;
        window.dispatchEvent(new PopStateEvent("popstate", { state: e.state }));
        replaying.current = false;
      }, back ? "back" : "forward");
    };
    window.addEventListener("popstate", onPop, { capture: true });
    return () => window.removeEventListener("popstate", onPop, { capture: true });
  }, [run]);

  return <TransitionContext.Provider value={{ navigate }}>{children}</TransitionContext.Provider>;
}

/** Fallback for browsers without View Transitions: animate the live page wrapper with GSAP. */
async function gsapFallback(
  update: () => void,
  direction: Direction,
  reduced: boolean,
  waitForRender: () => Promise<void>,
) {
  const el = document.getElementById(PAGE_ROOT_ID);
  if (!el) {
    const r = waitForRender();
    update();
    await r;
    scrollTopNow();
    return;
  }
  // GSAP only loads for this fallback (browsers without View Transitions).
  const { gsap } = await loadGsap();
  const k = isMobile() ? 0.56 : 1;
  const sign = direction === "back" ? -1 : 1;
  gsap.set(el, { transformOrigin: "50% 50vh", overflow: "hidden", willChange: "transform, opacity" });

  if (reduced) {
    await gsap.to(el, { opacity: 0, duration: 0.2 });
  } else {
    await gsap.to(el, { scale: 0.9, borderRadius: 32, opacity: 0.3, xPercent: -40 * sign, duration: 0.45 * k, ease: "power3.inOut" });
  }

  const r = waitForRender();
  update();
  await r;
  scrollTopNow();

  if (reduced) {
    await gsap.to(el, { opacity: 1, duration: 0.2 });
  } else {
    gsap.set(el, { xPercent: 100 * sign, scale: 0.92, borderRadius: 32, opacity: 1 });
    await gsap.to(el, { xPercent: 0, duration: 0.65 * k, ease: "expo.out" });
    await gsap.to(el, { scale: 1, borderRadius: 0, duration: 0.5 * k, ease: "power3.out" });
  }
  gsap.set(el, { clearProps: "all" });
}
