import type { CSSProperties } from "react";

/**
 * Scroll-reveal without a JS animation library: spread onto any element.
 * The element fades/rises in once it enters the viewport (RevealObserver + CSS in globals.css).
 * Works in Server Components; content stays visible without JavaScript and with reduced motion.
 */
export const revealProps = (delay = 0) => ({
  "data-reveal": "",
  style: { "--d": `${delay}s` } as CSSProperties,
});
