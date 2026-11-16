"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { loadGsap, refreshScrollTriggersNow } from "@/lib/gsap-lazy";
import { getLenis } from "@/lib/lenis";
import { preloadSanityImage } from "@/components/blog/SanityImg";
import { ARTICLE_COVER_SIZES } from "@/lib/covers";
import { anchorY, PAGE_NAVIGATE, PAGE_POSITIONED, PAGE_READY, settleLayout, tlog } from "@/lib/transition";

type Direction = "forward" | "back";
type Ctx = { navigate: (href: string) => void };

const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const MAX_WAIT = 3500;
/** Hero intros never wait longer than this after the new page should be visible. */
const INTRO_SAFETY = 500;

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

/** Scroll instantly (Lenis and native) so the new page is captured at its final position. */
function scrollNow(y: number) {
  const l = getLenis();
  if (l) {
    l.scrollTo(y, { immediate: true, force: true });
    l.start();
  }
  window.scrollTo(0, y);
}

/**
 * Puts the freshly mounted page at its final scroll position: the hash target (after the layout
 * has settled and ScrollTriggers have re-measured) or the top. Then writes the hash back to the URL.
 */
async function positionPage(hash: string) {
  const find = () => (hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null);
  let target = find();
  // A section that streams in a moment later: give the layout one settle window to produce it.
  if (hash && !target) {
    await settleLayout(300);
    target = find();
  }
  if (!target) {
    scrollNow(0);
    tlog("scroll set", { y: 0 });
  } else {
    await settleLayout(300);
    await refreshScrollTriggersNow();
    const y = anchorY(target);
    scrollNow(y);
    tlog("scroll set", { hash, y });
  }
  if (hash && window.location.hash !== hash) {
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search + hash);
  }
  window.dispatchEvent(new Event(PAGE_POSITIONED));
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

  // We place the page ourselves after every navigation; the browser must not restore or jump.
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  // Article covers: fetched before the click (hover/touch on a card, idle for the featured card), so the
  // article slides in with its sharp cover instead of the blur placeholder.
  useEffect(() => {
    const done = new Set<string>();
    const warm = (a: Element | null) => {
      const src = a?.getAttribute("data-cover-preload");
      if (!src || done.has(src)) return;
      done.add(src);
      preloadSanityImage(src, ARTICLE_COVER_SIZES);
    };
    const onPointer = (e: Event) => warm((e.target as Element | null)?.closest?.("a[data-cover-preload]") ?? null);
    document.addEventListener("pointerover", onPointer, { passive: true });
    document.addEventListener("touchstart", onPointer, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, []);
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const id = idle(() => {
      document.querySelectorAll("a[data-cover-preload-idle]").forEach((a) => {
        const src = a.getAttribute("data-cover-preload");
        if (src) preloadSanityImage(src, ARTICLE_COVER_SIZES);
      });
    });
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, [pathname]);

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
        const t = window.setTimeout(() => {
          tlog("route ready (timeout)");
          resolve();
        }, MAX_WAIT);
        resolveRendered.current = () => {
          window.clearTimeout(t);
          tlog("route ready");
          // Give the new page one frame to apply its initial (pre-intro) state. The timeout
          // covers windows where requestAnimationFrame doesn't fire.
          let fired = false;
          const done = () => {
            if (fired) return;
            fired = true;
            resolve();
          };
          requestAnimationFrame(done);
          window.setTimeout(done, 50);
        };
      }),
    [],
  );

  /** Starts the hero intros on the new page (once). */
  const introStarted = useRef(true);
  const startIntro = useCallback((why: string) => {
    if (introStarted.current) return;
    introStarted.current = true;
    document.documentElement.dataset.intro = "play";
    tlog("page:ready → hero intro start", why);
    window.dispatchEvent(new Event(PAGE_READY));
  }, []);

  const finish = useCallback(() => {
    const html = document.documentElement;
    html.removeAttribute("data-vt");
    html.removeAttribute("data-direction");
    busy.current = false;
    startIntro("transition finished");
    void refreshScrollTriggersNow();
    document.getElementById("main")?.focus({ preventScroll: true });
    tlog("transition done");
  }, [startIntro]);

  /** Runs `update` (which changes the route) inside the right kind of transition. */
  const run = useCallback(
    async (update: () => void, direction: Direction, hash: string) => {
      if (busy.current) return;
      busy.current = true;
      // Close menus first so they're never captured in the transition snapshot.
      window.dispatchEvent(new Event(PAGE_NAVIGATE));
      const html = document.documentElement;
      const reduced = prefersReduced();
      const k = isMobile() ? 0.56 : 1;
      html.dataset.vt = reduced ? "fade" : "slide";
      html.dataset.direction = direction;
      html.style.setProperty("--vt", String(k));
      // Hero intros on the incoming page wait (paused at their first frame) until it has slid in.
      html.dataset.intro = "wait";
      introStarted.current = false;
      // Time from the start of the animations until the new page has finished sliding in.
      const slideIn = reduced ? 200 : (300 + 800) * k;
      const showIntroAfterAnimations = () => {
        tlog("new page in (animating)");
        window.setTimeout(() => startIntro("slide-in finished"), slideIn);
        window.setTimeout(() => startIntro("safety fallback"), slideIn + INTRO_SAFETY);
      };

      const swap = async () => {
        const rendered = waitForRender();
        update();
        await rendered;
        await positionPage(hash);
      };

      try {
        if (typeof document.startViewTransition === "function") {
          let started = false;
          tlog("old page out (snapshot)");
          const vt = document.startViewTransition(async () => {
            started = true;
            await swap();
          });
          // Watchdog: if the browser never gets a frame to snapshot the old page (e.g. a hidden
          // window), skip the animation. skipTransition() still runs the update, so navigation completes.
          const watchdog = window.setTimeout(() => {
            if (!started) vt.skipTransition();
          }, 1000);
          vt.ready.then(showIntroAfterAnimations, () => tlog("transition skipped"));
          await vt.finished.catch(() => {});
          window.clearTimeout(watchdog);
        } else {
          tlog("old page out (GSAP fallback)");
          await gsapFallback(swap, direction, reduced, k, () => startIntro("slide-in finished"));
        }
      } finally {
        finish();
      }
    },
    [finish, startIntro, waitForRender],
  );

  const navigate = useCallback(
    (href: string) => {
      if (busy.current) return;
      // The hash is handled by positionPage(), never by the browser or the router.
      const url = new URL(href, window.location.href);
      const hash = url.hash;
      tlog("click", href, true);
      run(() => router.push(url.pathname + url.search, { scroll: false }), "forward", hash);
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
      tlog(back ? "back" : "forward", target + window.location.hash, true);
      run(
        () => {
          replaying.current = true;
          window.dispatchEvent(new PopStateEvent("popstate", { state: e.state }));
          replaying.current = false;
        },
        back ? "back" : "forward",
        window.location.hash,
      );
    };
    window.addEventListener("popstate", onPop, { capture: true });
    return () => window.removeEventListener("popstate", onPop, { capture: true });
  }, [run]);

  return <TransitionContext.Provider value={{ navigate }}>{children}</TransitionContext.Provider>;
}

/** Fallback for browsers without View Transitions: animate the live page wrapper with GSAP. */
async function gsapFallback(
  swap: () => Promise<void>,
  direction: Direction,
  reduced: boolean,
  k: number,
  onSlidIn: () => void,
) {
  const el = document.getElementById(PAGE_ROOT_ID);
  if (!el) {
    await swap();
    onSlidIn();
    return;
  }
  // GSAP only loads for this fallback (browsers without View Transitions).
  const { gsap } = await loadGsap();
  const sign = direction === "back" ? -1 : 1;
  gsap.set(el, { transformOrigin: "50% 50vh", overflow: "hidden", willChange: "transform, opacity" });

  if (reduced) {
    await gsap.to(el, { opacity: 0, duration: 0.2 });
  } else {
    await gsap.to(el, { scale: 0.9, borderRadius: 32, opacity: 0.3, xPercent: -40 * sign, duration: 0.45 * k, ease: "power3.inOut" });
  }

  await swap();

  if (reduced) {
    await gsap.to(el, { opacity: 1, duration: 0.2 });
    onSlidIn();
  } else {
    gsap.set(el, { xPercent: 100 * sign, scale: 0.92, borderRadius: 32, opacity: 1 });
    await gsap.to(el, { xPercent: 0, duration: 0.65 * k, ease: "expo.out" });
    onSlidIn();
    await gsap.to(el, { scale: 1, borderRadius: 0, duration: 0.5 * k, ease: "power3.out" });
  }
  gsap.set(el, { clearProps: "all" });
}
