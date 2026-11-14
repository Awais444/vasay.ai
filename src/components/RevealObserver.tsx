"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One IntersectionObserver for every [data-reveal] element on the page (replaces per-element
 * Framer Motion whileInView). Adds .revealed once; re-scans after each navigation.
 */
export default function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.revealed)").forEach((el) => io.observe(el));
    scan();
    // Sections that stream in or mount later (e.g. after a page transition)
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
