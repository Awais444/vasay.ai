/** Shared page-transition state. `data-vt` on <html> is present while a transition runs. */

/** Fired when the new page has finished sliding in: hero intros start on this. */
export const PAGE_READY = "page:ready";
/** Fired when a page transition starts (menus close on this). */
export const PAGE_NAVIGATE = "page:navigate";
/** Fired once the new page is mounted and scrolled to its final position, before it is shown. */
export const PAGE_POSITIONED = "page:positioned";

/** Space kept above an anchor target for the floating navbar. */
export const NAV_OFFSET = 96;

export const isTransitioning = () =>
  typeof document !== "undefined" && document.documentElement.hasAttribute("data-vt");

/**
 * Runs `cb` once the current page transition has shown the new page (or right away if none is running,
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

/* ---- Debug timeline: add ?debugTransitions=1 to any URL (remembered for the tab, =0 turns it off) ---- */

const DEBUG_KEY = "debugTransitions";
let t0 = 0;

function debugOn() {
  if (typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(window.location.search).get(DEBUG_KEY);
    if (q !== null) sessionStorage.setItem(DEBUG_KEY, q === "0" ? "" : "1");
    return sessionStorage.getItem(DEBUG_KEY) === "1";
  } catch {
    return false;
  }
}

/** Logs one step of the transition timeline (no-op unless debugging is on). `start` resets the clock. */
export function tlog(step: string, detail?: unknown, start = false) {
  if (!debugOn()) return;
  const now = performance.now();
  if (start || !t0) t0 = now;
  const ms = Math.round(now - t0).toString().padStart(5, " ");
  console.log(`%c[vt] +${ms}ms %c${step}`, "color:#ff7001", "color:inherit;font-weight:600", ...(detail === undefined ? [] : [detail]));
}

/**
 * Resolves once the layout has settled: web fonts loaded and one animation frame with no size change
 * of the page. Never waits more than `max` ms.
 */
export function settleLayout(max = 300): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      ro?.disconnect();
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, max);
    let ro: ResizeObserver | undefined;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    fonts.then(() => {
      if (done) return;
      let last = document.documentElement.scrollHeight;
      let stableFrames = 0;
      const check = () => {
        if (done) return;
        const h = document.documentElement.scrollHeight;
        stableFrames = h === last ? stableFrames + 1 : 0;
        last = h;
        if (stableFrames >= 1) finish();
        else requestAnimationFrame(check);
      };
      // Any resize restarts the count; a frame without one ends the wait.
      if (typeof ResizeObserver === "function") {
        ro = new ResizeObserver(() => {
          stableFrames = 0;
        });
        ro.observe(document.body);
      }
      requestAnimationFrame(check);
    });
  });
}

/** Document Y of an anchor target, minus the navbar offset. */
export function anchorY(el: HTMLElement) {
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET);
}
