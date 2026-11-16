"use client";

import { useEffect, useRef } from "react";

/**
 * Loads the System showcase interactions only when the section is about to scroll into view,
 * so the code stays out of the initial page load.
 */
export default function SystemShowcaseIsland() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    const root = section?.querySelector<HTMLElement>("[data-sc-root]");
    if (!root) return;
    let destroy: (() => void) | undefined;
    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        import("@/lib/system-showcase-runtime").then(({ initShowcase }) => {
          if (!cancelled) destroy = initShowcase(root);
        });
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(root);
    return () => {
      cancelled = true;
      io.disconnect();
      destroy?.();
    };
  }, []);

  return <span ref={ref} hidden />;
}
