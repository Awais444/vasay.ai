"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { refreshScrollTriggersNow } from "@/lib/gsap-lazy";
import { getLenis } from "@/lib/lenis";
import { preloadSanityImage } from "@/components/blog/SanityImg";
import { ARTICLE_COVER_SIZES } from "@/lib/covers";
import { anchorY, PAGE_NAVIGATE, PAGE_POSITIONED, PAGE_READY, settleLayout, tlog } from "@/lib/transition";

/*
 * Page transitions ("Curtain Wipe"):
 *   LEAVE    page fades/lifts, two panels slide up and cover the screen, the next page's name shows.
 *   COVERED  route change, layout settle, ScrollTrigger refresh, scroll to the top or the #hash target,
 *            navbar state, focus. Covered for at least 250ms, revealed after 1500ms at the latest.
 *   ENTER    panels exit upwards; "page:ready" fires when they're ~60% gone (hero intros start).
 * Back/forward: quick fade with the scroll position restored. Reduced motion: a short fade only.
 * The overlay code (src/lib/curtain.ts) is imported after first paint.
 */

type Ctx = { navigate: (href: string, label?: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

/** Wraps the page (everything except the fixed Navbar); it fades/lifts on leave. */
export const PAGE_ROOT_ID = "page-root";

const MIN_COVERED = 250;
const MAX_COVERED = 1500;
const MAX_RENDER_WAIT = 8000;
/** Hero intros never stay hidden longer than this after the page should be visible. */
const INTRO_SAFETY = 500;
const SCROLL_KEY = "vt-scroll";

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const speed = () => (window.matchMedia("(max-width: 767px)").matches ? 0.85 : 1);
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const loadCurtain = () => import("@/lib/curtain");
const pageEl = () => document.getElementById(PAGE_ROOT_ID);
const here = () => window.location.pathname + window.location.search;

/** Homepage anchors; fixed routes, services and articles come from `labels` / the link itself. */
const HASH_LABELS: Record<string, string> = { "#process": "Process", "#work": "Work", "#faq": "FAQ", "#services": "Services" };

function labelFor(url: URL, labels: Record<string, string>, explicit?: string) {
  if (explicit) return explicit;
  if (url.pathname === "/" && url.hash && HASH_LABELS[url.hash]) return HASH_LABELS[url.hash];
  if (labels[url.pathname]) return labels[url.pathname];
  const last = url.pathname.split("/").filter(Boolean).pop() ?? "";
  return last ? last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Home";
}

/** Scroll instantly (Lenis and native). */
function scrollNow(y: number) {
  const l = getLenis();
  if (l) {
    l.scrollTo(y, { immediate: true, force: true });
    l.start();
  }
  window.scrollTo(0, y);
}

/** Scroll positions per URL (this tab), restored on back/forward. */
function saveScroll(path: string) {
  try {
    const all = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || "{}");
    all[path] = Math.round(window.scrollY);
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(all));
  } catch {}
}
function savedScroll(path: string): number {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_KEY) || "{}")[path] ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Puts the freshly mounted page at its final position: the #hash target (after the layout has settled
 * and ScrollTriggers re-measured), `y`, or the top. Writes the hash back to the URL.
 */
async function positionPage(hash: string, y?: number) {
  await settleLayout(400);
  await refreshScrollTriggersNow();
  const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  const top = target ? anchorY(target) : (y ?? 0);
  scrollNow(top);
  tlog("scroll set", { hash, y: Math.round(top) });
  if (hash && window.location.hash !== hash) {
    window.history.replaceState(window.history.state, "", here() + hash);
  }
  // The navbar takes the new page's state (transparent/glass) once, here, while nothing is visible.
  window.dispatchEvent(new Event(PAGE_POSITIONED));
  document.getElementById("main")?.focus({ preventScroll: true });
}

export default function TransitionProvider({ children, labels = {} }: { children: ReactNode; labels?: Record<string, string> }) {
  const router = useRouter();
  const pathname = usePathname();
  const busy = useRef(false);
  const resolveRendered = useRef<(() => void) | null>(null);
  const replaying = useRef(false);
  const introStarted = useRef(true);
  const current = useRef("");
  const labelsRef = useRef(labels);
  useEffect(() => {
    labelsRef.current = labels;
  }, [labels]);

  // We place the page ourselves after every navigation; the browser must not restore or jump.
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    // Overlay code after first paint, off the critical path.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    idle(() => loadCurtain().then((c) => c.prepareCurtain()));
  }, []);

  // The route committed: resolve the pending "rendered" promise.
  useEffect(() => {
    current.current = here();
    resolveRendered.current?.();
    resolveRendered.current = null;
  }, [pathname]);

  const waitForRender = useCallback(
    () =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(() => {
          tlog("route ready (timeout)");
          resolve();
        }, MAX_RENDER_WAIT);
        resolveRendered.current = () => {
          window.clearTimeout(t);
          tlog("route ready");
          resolve();
        };
      }),
    [],
  );

  const startIntro = useCallback((why: string) => {
    if (introStarted.current) return;
    introStarted.current = true;
    document.documentElement.dataset.intro = "play";
    tlog("page:ready → hero intro start", why);
    window.dispatchEvent(new Event(PAGE_READY));
  }, []);

  const begin = useCallback((kind: string) => {
    busy.current = true;
    window.dispatchEvent(new Event(PAGE_NAVIGATE)); // closes the mega menu and mobile menu
    const html = document.documentElement;
    html.dataset.vt = kind;
    // Hero intros on the incoming page hold their first frame until page:ready.
    html.dataset.intro = "wait";
    introStarted.current = false;
  }, []);

  const end = useCallback(() => {
    document.documentElement.removeAttribute("data-vt");
    busy.current = false;
    startIntro("transition finished");
    tlog("transition done");
  }, [startIntro]);

  /** Route change + render + positioning, while the page is hidden. */
  const swap = useCallback(
    async (update: () => void, hash: string, y?: number) => {
      const rendered = waitForRender();
      update();
      await rendered;
      await positionPage(hash, y);
    },
    [waitForRender],
  );

  const navigate = useCallback(
    async (href: string, explicitLabel?: string) => {
      if (busy.current) return; // double clicks
      const url = new URL(href, window.location.href);
      const hash = url.hash;
      const path = url.pathname + url.search;
      const update = () => router.push(path, { scroll: false });
      tlog("click", href, true);
      saveScroll(here());

      if (prefersReduced()) {
        begin("fade");
        try {
          const c = await loadCurtain();
          await c.fade(pageEl(), 0, 120);
          await swap(update, hash);
          await c.fade(pageEl(), 1, 200);
        } finally {
          end();
        }
        return;
      }

      begin("curtain");
      const k = speed();
      const c = await loadCurtain();
      try {
        tlog("leave: covering");
        await c.cover(labelFor(url, labelsRef.current, explicitLabel), pageEl(), k);
        tlog("covered");
        const coveredAt = performance.now();
        c.resetPage(pageEl());
        // Never reveal the old page: wait for the new route to render (slow network: the curtain and the
        // label stay up; MAX_RENDER_WAIT is the hard stop). Settling and positioning get MAX_COVERED at most.
        const rendered = waitForRender();
        update();
        await rendered;
        const ready = positionPage(hash);
        const budget = Math.max(0, MAX_COVERED - (performance.now() - coveredAt));
        const timedOut = await Promise.race([ready.then(() => false), sleep(budget).then(() => true)]);
        if (timedOut) tlog("positioning too long: revealing anyway");
        const left = MIN_COVERED - (performance.now() - coveredAt);
        if (left > 0) await sleep(left);
        tlog("enter: revealing");
        window.setTimeout(() => startIntro("safety fallback"), (150 + 600) * k + INTRO_SAFETY);
        await c.reveal(() => startIntro("panels ~60% gone"), k);
        if (timedOut) await ready; // finish positioning if the route was still loading
      } catch (err) {
        console.error(err);
        c.hide();
      } finally {
        c.resetPage(pageEl());
        end();
      }
    },
    [begin, end, router, startIntro, swap, waitForRender],
  );

  // Internal links: TransitionLink calls navigate(); plain <a href="/..."> (hero buttons, rich text)
  // are picked up here. Hover/touch prefetches the route and, for article cards, the cover image.
  useEffect(() => {
    const internal = (e: Event): { a: HTMLAnchorElement; url: URL } | null => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return null;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname.startsWith("/studio") || url.pathname.startsWith("/api")) return null;
      return { a, url };
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const hit = internal(e);
      if (!hit || hit.url.pathname === window.location.pathname) return; // same page: SmoothScroll handles hashes
      e.preventDefault();
      navigate(hit.url.pathname + hit.url.search + hit.url.hash, hit.a.dataset.transitionLabel);
    };
    const warmed = new Set<string>();
    const onWarm = (e: Event) => {
      const hit = internal(e);
      if (!hit || warmed.has(hit.a.href)) return;
      warmed.add(hit.a.href);
      if (hit.url.pathname !== window.location.pathname) router.prefetch(hit.url.pathname + hit.url.search);
      const cover = hit.a.getAttribute("data-cover-preload");
      if (cover) preloadSanityImage(cover, ARTICLE_COVER_SIZES);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onWarm, { passive: true });
    document.addEventListener("touchstart", onWarm, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onWarm);
      document.removeEventListener("touchstart", onWarm);
    };
  }, [navigate, router]);

  // The featured article's cover, on idle.
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

  // Browser back/forward: no curtain. Capture popstate before Next.js, hide the page, replay the event
  // to Next.js, restore the saved scroll position, then fade the page in (0.25s).
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      if (replaying.current) return;
      const target = here();
      if (target === current.current) return; // hash-only change
      if (busy.current) return;
      e.stopImmediatePropagation();
      saveScroll(current.current); // the URL already changed: save the page we're leaving under its path
      const hash = window.location.hash;
      tlog("back/forward", target + hash, true);
      (async () => {
        busy.current = true;
        window.dispatchEvent(new Event(PAGE_NAVIGATE));
        const html = document.documentElement;
        html.dataset.vt = "pop";
        html.dataset.intro = "wait";
        introStarted.current = false;
        const page = pageEl();
        try {
          const c = await loadCurtain();
          if (page) page.style.opacity = "0";
          await swap(
            () => {
              replaying.current = true;
              window.dispatchEvent(new PopStateEvent("popstate", { state: e.state }));
              replaying.current = false;
            },
            hash,
            savedScroll(target),
          );
          startIntro("back/forward shown");
          if (page) page.style.opacity = "";
          await c.fade(page, 1, 250);
        } finally {
          if (page) page.style.opacity = "";
          end();
        }
      })();
    };
    window.addEventListener("popstate", onPop, { capture: true });
    return () => window.removeEventListener("popstate", onPop, { capture: true });
  }, [end, startIntro, swap]);

  return <TransitionContext.Provider value={{ navigate }}>{children}</TransitionContext.Provider>;
}
