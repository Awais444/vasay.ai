/** Shared page-transition state. `data-vt` on <html> is present while a transition runs. */

export const PAGE_READY = "page:ready";
/** Fired when a page transition starts (menus close on this). */
export const PAGE_NAVIGATE = "page:navigate";

export const isTransitioning = () =>
  typeof document !== "undefined" && document.documentElement.hasAttribute("data-vt");

/**
 * Runs `cb` once the current page transition has finished (or right away if none is running,
 * e.g. on first load). Returns a cleanup function.
 */
export function whenPageReady(cb: () => void): () => void {
  if (!isTransitioning()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(PAGE_READY, handler, { once: true });
  return () => window.removeEventListener(PAGE_READY, handler);
}
