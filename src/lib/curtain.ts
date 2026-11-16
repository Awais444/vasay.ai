/*
 * "Curtain Wipe" page transition overlay. Plain DOM + Web Animations API (transform/opacity only),
 * imported lazily by TransitionProvider after first paint, so it never touches the first load.
 *
 * Rounded corners without animating border-radius: each panel is 100vh + 80px tall with every
 * corner rounded (40px). Covering, it sits at translateY(-40px), so both rounded edges are off-screen
 * and the screen looks flat; while it moves, the leading (top) or trailing (bottom) curve shows.
 */

/** The logo's 4-point star (24×24 viewBox). */
const STAR_PATH = "M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z";

const VIBRANT = "#011efd";
const KLEIN = "#1b08b7";
const ORANGE = "#ff7001";
const R = 40;

const EXPO_IN_OUT = "cubic-bezier(0.87, 0, 0.13, 1)";
const POWER2_IN = "cubic-bezier(0.55, 0.085, 0.68, 0.53)";
const BACK_OUT = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

type Els = { root: HTMLDivElement; vibrant: HTMLDivElement; klein: HTMLDivElement; star: HTMLDivElement; labelInner: HTMLSpanElement; badge: HTMLDivElement };
let els: Els | null = null;

function build(): Els {
  if (els && document.body.contains(els.root)) return els;
  const root = document.createElement("div");
  root.setAttribute("aria-hidden", "true");
  root.dataset.curtain = "";
  Object.assign(root.style, { position: "fixed", inset: "0", zIndex: "2147483000", pointerEvents: "none", overflow: "hidden", visibility: "hidden" });

  const panel = (color: string) => {
    const p = document.createElement("div");
    Object.assign(p.style, {
      position: "absolute",
      left: "0",
      right: "0",
      top: "0",
      height: `calc(100vh + ${R * 2}px)`,
      background: color,
      borderRadius: `${R}px`,
      transform: "translateY(100vh)",
    });
    return p;
  };
  const vibrant = panel(VIBRANT);
  const klein = panel(KLEIN);

  // Star + label, centred on the visible part of the Klein panel (it is offset by -40px when covering).
  const badge = document.createElement("div");
  Object.assign(badge.style, {
    position: "absolute",
    left: "0",
    right: "0",
    top: `${R}px`,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "18px",
    color: "#fff",
    textAlign: "center",
    padding: "0 24px",
  });
  const star = document.createElement("div");
  star.innerHTML = `<svg viewBox="0 0 24 24" width="44" height="44"><path d="${STAR_PATH}" fill="${ORANGE}"/></svg>`;
  Object.assign(star.style, { width: "44px", height: "44px", opacity: "0" });
  const mask = document.createElement("div");
  Object.assign(mask.style, { overflow: "hidden", paddingBottom: "0.08em" });
  const labelInner = document.createElement("span");
  Object.assign(labelInner.style, {
    display: "block",
    fontFamily: "var(--font-heading), system-ui, sans-serif",
    fontWeight: "600",
    fontSize: "clamp(28px, 4vw, 52px)",
    lineHeight: "1.05",
    letterSpacing: "-0.03em",
    transform: "translateY(110%)",
  });
  mask.append(labelInner);
  badge.append(star, mask);
  klein.append(badge);
  root.append(vibrant, klein);
  document.body.append(root);
  els = { root, vibrant, klein, star, labelInner, badge };
  return els;
}

const run = (el: HTMLElement, frames: Keyframe[], o: KeyframeAnimationOptions) => el.animate(frames, { fill: "forwards", ...o }).finished;

/** Builds the overlay ahead of time (called on idle) so the first click starts instantly. */
export function prepareCurtain() {
  build();
}

/**
 * LEAVE: page fades/lifts, Vibrant then Klein slide up, star and label reveal.
 * Resolves when the screen is fully covered.
 */
export async function cover(label: string, page: HTMLElement | null, k = 1) {
  const e = build();
  e.labelInner.textContent = label;
  e.root.style.visibility = "visible";
  e.root.style.pointerEvents = "auto"; // swallows clicks while the transition runs
  for (const p of [e.vibrant, e.klein]) p.style.willChange = "transform";
  e.badge.style.opacity = "1";
  e.badge.style.transform = "none";

  if (page) {
    page.style.willChange = "transform, opacity";
    page.animate([{ opacity: 1, transform: "none" }, { opacity: 0.6, transform: "translateY(-24px)" }], { duration: 350 * k, easing: POWER2_IN, fill: "forwards" });
  }
  const slide = { duration: 600 * k, easing: EXPO_IN_OUT };
  const up = [{ transform: "translateY(100vh)" }, { transform: `translateY(-${R}px)` }];
  const panels = Promise.all([run(e.vibrant, up, slide), run(e.klein, up, { ...slide, delay: 70 * k })]);
  // Star and label arrive as the Klein panel settles.
  run(e.star, [{ opacity: 0, transform: "rotate(-120deg) scale(0.3)" }, { opacity: 1, transform: "none" }], { duration: 500 * k, easing: BACK_OUT, delay: 300 * k });
  run(e.labelInner, [{ transform: "translateY(110%)" }, { transform: "none" }], { duration: 500 * k, easing: EASE_OUT, delay: 380 * k });
  await panels;
}

/** Resets the old page wrapper while the screen is covered (the new page renders inside it). */
export function resetPage(page: HTMLElement | null) {
  if (!page) return;
  page.getAnimations().forEach((a) => a.cancel());
  page.style.willChange = "";
}

/**
 * ENTER: star and label lift out, Klein then Vibrant exit upwards.
 * `onMostlyGone` fires when the panels are ~60% off-screen (hero intros start then).
 */
export async function reveal(onMostlyGone: () => void, k = 1) {
  const e = build();
  // The star and label lift out while the Klein panel starts to leave (overlapped to keep it short).
  run(e.badge, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-20px)" }], { duration: 250 * k, easing: POWER2_IN });
  const slide = { duration: 600 * k, easing: EXPO_IN_OUT };
  const out = [{ transform: `translateY(-${R}px)` }, { transform: `translateY(calc(-100vh - ${R * 2}px))` }];
  const done = Promise.all([run(e.klein, out, { ...slide, delay: 80 * k }), run(e.vibrant, out, { ...slide, delay: 150 * k })]);
  // expo.inOut is ~60% of the way at ~55% of its time; the Vibrant panel (last out) starts at 150ms.
  const t = window.setTimeout(onMostlyGone, (150 + 600 * 0.55) * k);
  await done;
  window.clearTimeout(t);
  onMostlyGone();
  hide();
}

/** Takes the overlay out of the way (end of a transition, or after an error). */
export function hide() {
  if (!els) return;
  const e = els;
  for (const el of [e.vibrant, e.klein, e.star, e.labelInner, e.badge]) {
    el.getAnimations().forEach((a) => a.cancel());
    el.style.willChange = "";
  }
  e.root.style.visibility = "hidden";
  e.root.style.pointerEvents = "none";
}

/** Short opacity fade of the page wrapper (back/forward and reduced motion). */
export function fade(page: HTMLElement | null, to: 0 | 1, ms: number) {
  if (!page) return Promise.resolve();
  const from = to ? 0 : 1;
  return page
    .animate([{ opacity: from }, { opacity: to }], { duration: ms, easing: "ease", fill: "forwards" })
    .finished.then((a) => {
      if (to === 1) a.cancel();
    });
}
