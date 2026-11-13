"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const NAV_OFFSET = -96;

function scrollToEl(el: HTMLElement) {
  const l = getLenis();
  if (l) {
    l.scrollTo(el, { offset: NAV_OFFSET, duration: 1.3 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const y = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
  window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(2, -10 * t) });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Web fonts change text heights, so re-measure every ScrollTrigger once they're in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    // Images change heights too: refresh once everything has loaded.
    const onLoad = () => ScrollTrigger.refresh();
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
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  // After a route change: start at the top (or the hash target) and re-measure triggers.
  useEffect(() => {
    const hash = window.location.hash;
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    // Wait for the new page's ScrollTriggers (pin spacers change page height) before measuring.
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      const el = hash ? document.querySelector<HTMLElement>(hash) : null;
      if (el) {
        const l = getLenis();
        if (l) l.scrollTo(el, { offset: NAV_OFFSET, immediate: true, force: true });
        else scrollToEl(el);
      }
    }, 250);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return <>{children}</>;
}
