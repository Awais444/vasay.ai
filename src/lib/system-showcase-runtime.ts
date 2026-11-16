/*
 * Interactions for the System showcase (lazy-loaded by SystemShowcaseIsland):
 * tabs (click, arrow keys, Enter/Space), sidebar search, auto-advance every 6s while in view and
 * not hovered/focused (stops for good after the first manual pick, never on mobile or with reduced
 * motion), panel crossfade, replaying the visual, step highlight and the typed activity log.
 * Animations are CSS (transform/opacity) and pause while the window is off-screen.
 */

const AUTO_MS = 6000;
const CHAR_MS = 22;
const LINE_GAP_MS = 380;

export function initShowcase(root: HTMLElement): () => void {
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-sc-tab]"));
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-sc-panel]"));
  const search = root.querySelector<HTMLInputElement>("[data-sc-search]");
  const empty = root.querySelector<HTMLElement>("[data-sc-empty]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 899px)");

  let active = Math.max(0, tabs.findIndex((t) => t.getAttribute("aria-selected") === "true"));
  let inView = false;
  let hovered = false;
  let focused = false;
  let userPicked = false;
  let autoTimer = 0;
  let typeTimers: number[] = [];

  root.dataset.scReady = "";

  /* ---------- typed activity log + steps ---------- */

  const clearTyping = () => {
    typeTimers.forEach((t) => window.clearTimeout(t));
    typeTimers = [];
    root.querySelectorAll(".sc-cursor").forEach((c) => c.remove());
  };

  const later = (fn: () => void, ms: number) => typeTimers.push(window.setTimeout(fn, ms));

  function setStep(panel: HTMLElement, lineIndex: number, lines: number) {
    const steps = Array.from(panel.querySelectorAll<HTMLElement>("[data-sc-step]"));
    if (!steps.length) return;
    // Spread the steps over the log: first step at the start, last step when the last line is done.
    const i = lines <= 0 ? steps.length - 1 : Math.min(steps.length - 1, Math.round((lineIndex / lines) * (steps.length - 1)));
    steps.forEach((s, n) => (n === i ? s.setAttribute("data-current", "") : s.removeAttribute("data-current")));
  }

  function play(panel: HTMLElement) {
    clearTyping();
    const lines = Array.from(panel.querySelectorAll<HTMLElement>("[data-sc-line]"));
    // Restart the CSS visual.
    const control = panel.querySelector<HTMLElement>(".sc-control");
    if (control) {
      control.removeAttribute("data-play");
      void control.offsetWidth;
      control.setAttribute("data-play", "");
    }
    if (reduced.matches) {
      setStep(panel, lines.length, lines.length);
      return;
    }

    // Keep each segment's full text, then type it back in.
    const segs = lines.map((l) => Array.from(l.querySelectorAll<HTMLElement>("[data-sc-seg]")));
    segs.flat().forEach((s) => {
      s.dataset.full ??= s.textContent ?? "";
      s.textContent = "";
    });
    lines.forEach((l) => l.classList.add("sc-pending"));
    setStep(panel, 0, lines.length);

    const cursor = document.createElement("span");
    cursor.className = "sc-cursor";
    cursor.setAttribute("aria-hidden", "true");

    let t = 250;
    lines.forEach((line, li) => {
      later(() => {
        line.classList.remove("sc-pending");
        line.append(cursor);
      }, t);
      for (const seg of segs[li]) {
        const full = seg.dataset.full ?? "";
        for (let c = 1; c <= full.length; c++) {
          later(() => {
            seg.textContent = full.slice(0, c);
            line.append(cursor);
          }, t);
          t += CHAR_MS;
        }
      }
      later(() => setStep(panel, li + 1, lines.length), t);
      t += LINE_GAP_MS;
    });
  }

  /* ---------- selection ---------- */

  function select(i: number, opts: { focus?: boolean; animate?: boolean } = {}) {
    const prev = active;
    active = i;
    tabs.forEach((t, n) => {
      t.setAttribute("aria-selected", String(n === i));
      t.tabIndex = n === i ? 0 : -1;
    });
    panels.forEach((p, n) => {
      p.hidden = n !== i;
      p.classList.remove("sc-enter");
    });
    const panel = panels[i];
    if (opts.animate !== false && prev !== i && !reduced.matches) {
      void panel.offsetWidth;
      panel.classList.add("sc-enter");
    }
    if (opts.focus) tabs[i].focus();
    // Keep the active chip visible in the mobile scroll row.
    if (mobile.matches) tabs[i].scrollIntoView({ block: "nearest", inline: "nearest" });
    play(panel);
    schedule();
  }

  const visibleTabs = () => tabs.map((t, i) => ({ t, i })).filter(({ t }) => !t.hidden);

  /* ---------- auto-advance ---------- */

  function schedule() {
    window.clearTimeout(autoTimer);
    if (userPicked || !inView || hovered || focused || mobile.matches || reduced.matches) return;
    autoTimer = window.setTimeout(() => {
      const vis = visibleTabs();
      if (vis.length < 2) return;
      const pos = vis.findIndex((v) => v.i === active);
      select(vis[(pos + 1) % vis.length].i);
    }, AUTO_MS);
  }

  /* ---------- events ---------- */

  const onClick = (e: MouseEvent) => {
    const tab = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-sc-tab]");
    if (!tab) return;
    userPicked = true;
    select(tabs.indexOf(tab));
  };

  const onKey = (e: KeyboardEvent) => {
    const tab = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-sc-tab]");
    if (!tab) return;
    const vis = visibleTabs();
    const pos = vis.findIndex((v) => v.t === tab);
    const go = (p: number) => {
      e.preventDefault();
      const next = vis[(p + vis.length) % vis.length];
      next.t.tabIndex = 0;
      tabs.forEach((t) => t !== next.t && (t.tabIndex = -1));
      next.t.focus();
    };
    if (e.key === "ArrowDown" || e.key === "ArrowRight") go(pos + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(pos - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(vis.length - 1);
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      userPicked = true;
      select(tabs.indexOf(tab), { focus: true });
    }
  };

  const onSearch = () => {
    const q = (search?.value ?? "").trim().toLowerCase();
    let shown = 0;
    tabs.forEach((t) => {
      const match = !q || (t.dataset.name ?? "").includes(q);
      t.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown > 0;
    // Keep the tab sequence reachable: the first visible tab takes focus order if the active one is hidden.
    const vis = visibleTabs();
    if (vis.length && tabs[active].hidden) {
      tabs.forEach((t) => (t.tabIndex = -1));
      vis[0].t.tabIndex = 0;
    } else if (!tabs[active].hidden) {
      tabs.forEach((t, n) => (t.tabIndex = n === active ? 0 : -1));
    }
  };

  const onEnter = () => {
    hovered = true;
    schedule();
  };
  const onLeave = () => {
    hovered = false;
    schedule();
  };
  const onFocusIn = () => {
    focused = true;
    schedule();
  };
  const onFocusOut = (e: FocusEvent) => {
    if (root.contains(e.relatedTarget as Node)) return;
    focused = false;
    schedule();
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      const was = inView;
      inView = entry.isIntersecting;
      root.toggleAttribute("data-sc-inview", inView);
      // Replay when the window scrolls (back) into view.
      if (inView && !was) play(panels[active]);
      if (!inView) clearTyping();
      schedule();
    },
    { threshold: 0.25 },
  );

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKey);
  root.addEventListener("mouseenter", onEnter);
  root.addEventListener("mouseleave", onLeave);
  root.addEventListener("focusin", onFocusIn);
  root.addEventListener("focusout", onFocusOut);
  search?.addEventListener("input", onSearch);
  io.observe(root);

  return () => {
    clearTyping();
    window.clearTimeout(autoTimer);
    io.disconnect();
    root.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKey);
    root.removeEventListener("mouseenter", onEnter);
    root.removeEventListener("mouseleave", onLeave);
    root.removeEventListener("focusin", onFocusIn);
    root.removeEventListener("focusout", onFocusOut);
    search?.removeEventListener("input", onSearch);
  };
}
