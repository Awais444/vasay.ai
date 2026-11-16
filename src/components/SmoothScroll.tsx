"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { getLenis, setLenis } from "@/lib/lenis";
import { refreshScrollTriggers, refreshScrollTriggersNow, updateScrollTriggers } from "@/lib/gsap-lazy";
import { anchorY, isTransitioning, NAV_OFFSET, settleLayout, tlog } from "@/lib/transition";

/** Run after the first paint, when the main thread is free. */
const whenIdle = (cb: () => void) => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 2000 });
  else setTimeout(cb, 600);
};

function scrollToEl(el: HTMLElement) {
  const l = getLenis();
  if (l) {
    l.scrollTo(el, { offset: -NAV_OFFSET, duration: 1.3 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const y = anchorY(el);
  window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // No smooth scrolling inside the embedded Sanity Studio (it scrolls its own panes).
  const studio = pathname?.startsWith("/studio") ?? false;

  useEffect(() => {
    if (studio) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let disposed = false;
    // Smooth scrolling is an enhancement: load Lenis after first paint, off the critical path.
    if (!reduce) {
      whenIdle(() => {
        import("lenis").then(({ default: L }) => {
          if (disposed) return;
          lenis = new L({ duration: 1.15, easing: (t) => 1 - Math.pow(2, -10 * t), autoRaf: true });
          setLenis(lenis);
          lenis.on("scroll", updateScrollTriggers);
        });
      });
    }

    // Web fonts change text heights, so re-measure every ScrollTrigger once they're in.
    document.fonts?.ready.then(refreshScrollTriggers);
    // Images change heights too: refresh once everything has loaded.
    const onLoad = () => refreshScrollTriggers();
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    // In-page anchors ("#faq", or "/#faq" while on "/") scroll through Lenis with a navbar offset.
    // Hash links to other pages are left to Next.js navigation.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const a = (e.target as HTMLElement).closest("a[href]");
      if (!a) return;
      const url = new URL(a.getAttribute("href")!, window.location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const el = document.querySelector<HTMLElement>(url.hash);
      if (!el) return;
      e.preventDefault();
      scrollToEl(el);
      history.replaceState(history.state, "", url.hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      disposed = true;
      lenis?.destroy();
      setLenis(null);
    };
  }, [studio]);

  // Route changes without the page transition (first load, plain links): start at the top, or at the
  // hash target once the layout has settled. Transitions position the page themselves (TransitionProvider),
  // before the new page is shown, so nothing scrolls after they end.
  useEffect(() => {
    if (isTransitioning()) return;
    const hash = window.location.hash;
    let cancelled = false;
    if (!hash) {
      getLenis()?.scrollTo(0, { immediate: true, force: true });
      return;
    }
    settleLayout(300)
      .then(refreshScrollTriggersNow)
      .then(() => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (cancelled || !el) return;
        const y = anchorY(el);
        getLenis()?.scrollTo(y, { immediate: true, force: true });
        window.scrollTo(0, y);
        tlog("direct load: scroll set", { hash, y }, true);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return <>{children}</>;
}
