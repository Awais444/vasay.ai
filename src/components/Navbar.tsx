"use client";

import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import { useEffect, useRef, useState } from "react";
import Link from "@/components/TransitionLink";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Logo, { Star } from "./Logo";
import { ServiceIconBox } from "./ServiceIcon";
import { nav, services, site } from "@/lib/content";
import { getLenis } from "@/lib/lenis";
import { PAGE_NAVIGATE } from "@/lib/transition";

const ease = [0.22, 1, 0.36, 1] as const;

/** Pages whose hero is light, so the navbar starts in its solid (dark text) state. */
const LIGHT_HERO_ROUTES = ["/privacy-policy", "/terms"];

/** Homepage section ids that have a navbar link ("/#work" → "work"). */
const SECTION_IDS = [...nav.links, ...nav.mobileExtra].filter((l) => l.href.startsWith("/#")).map((l) => l.href.slice(2));

/** Which linked homepage section is in the middle band of the viewport (null when none). */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        setActive(SECTION_IDS.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      io.disconnect();
      setActive(null);
    };
  }, [enabled]);
  return enabled ? active : null;
}

export default function Navbar() {
  const pathname = usePathname();
  const lightHero = LIGHT_HERO_ROUTES.includes(pathname);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaOpenedAt = useRef(0);

  // Close menus whenever the route changes (adjusting state during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMega(false);
    setMobile(false);
  }

  // ...and as soon as a page transition starts, so they never appear in its snapshot.
  useEffect(() => {
    const close = () => {
      setMega(false);
      setMobile(false);
    };
    window.addEventListener(PAGE_NAVIGATE, close);
    return () => window.removeEventListener(PAGE_NAVIGATE, close);
  }, []);

  // Close the mega menu on scroll (native listener; small threshold for inertia).
  useEffect(() => {
    if (!mega) return;
    const onScroll = () => {
      if (Math.abs(window.scrollY - megaOpenedAt.current) > 24) setMega(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mega]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 20);
    setHidden(y > prev && y > 160 && !mega && !mobile);
  });

  useEffect(() => {
    const l = getLenis();
    if (mobile) l?.stop();
    else l?.start();
    document.body.style.overflow = mobile ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setMobile(false), setMega(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobile]);

  const solid = scrolled || mega || lightHero;
  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!mega) megaOpenedAt.current = window.scrollY;
    setMega(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMega(false), 120);
  };
  const section = useActiveSection(pathname === "/");
  const isActive = (href: string) =>
    href.startsWith("/#")
      ? pathname === "/" && section === href.slice(2)
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.5, ease }}
        className="vt-navbar fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6"
      >
        <div
          className={`relative mx-auto flex max-w-7xl items-center justify-between rounded-full py-2 pl-4 pr-2 lg:py-1 transition-[background-color,box-shadow,color] duration-300 sm:pl-5 ${
            solid
              ? "bg-white/[0.96] text-brand-black shadow-[0_6px_24px_rgb(20_19_23/0.10)] ring-1 ring-brand-black/[0.06] backdrop-blur-[16px]"
              : "bg-transparent text-white ring-1 ring-transparent"
          }`}
          onMouseLeave={closeMega}
        >
          <Logo variant={solid ? "light" : "dark"} crossfade priority className="h-11 lg:h-[52px]" />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.links.map((l) => (
                <li key={l.href} onMouseEnter={l.mega ? openMega : closeMega}>
                  <Link
                    href={l.href}
                    aria-expanded={l.mega ? mega : undefined}
                    aria-haspopup={l.mega ? "true" : undefined}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    onFocus={l.mega ? openMega : undefined}
                    onClick={() => setMega(false)}
                    className="group relative flex items-center gap-1 px-3.5 py-2 text-[14.5px] font-medium"
                  >
                    {l.label}
                    {l.mega && (
                      <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-300 ${mega ? "rotate-180" : ""}`} aria-hidden="true">
                        <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                      </svg>
                    )}
                    <span
                      className={`absolute inset-x-3.5 bottom-1 h-px origin-left bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100 ${
                        isActive(l.href) ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span
              className={`hidden items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium ring-1 transition-colors duration-300 xl:flex ${
                solid ? "bg-brand-bg text-brand-black ring-brand-silver" : "bg-white/10 text-white ring-white/25"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {nav.status}
            </span>
            <Link
              href={nav.cta.href}
              className={`hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 sm:inline-flex ${
                solid ? "bg-accent text-white hover:bg-accent-bright" : "bg-white text-accent hover:bg-brand-silver"
              }`}
            >
              {nav.cta.label}
            </Link>
            <button
              type="button"
              onClick={() => setMobile(true)}
              aria-label="Open menu"
              aria-expanded={mobile}
              className={`flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${
                solid ? "bg-brand-black text-white" : "bg-white text-accent"
              }`}
            >
              <span className="flex w-4 flex-col gap-1">
                <span className="h-0.5 w-full rounded bg-current" />
                <span className="h-0.5 w-full rounded bg-current" />
              </span>
            </button>
          </div>

          {/* Services mega menu */}
          <AnimatePresence>
            {mega && (
              <motion.div
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease }}
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
                className="absolute inset-x-0 top-full hidden pt-3 lg:block"
              >
                {/* Two service columns + promo card. The promo stretches to the list height (no empty space). */}
                <div className="grid grid-cols-[1fr_1fr_300px] gap-2 rounded-[26px] bg-white p-4 text-brand-black shadow-[0_30px_80px_rgb(20_19_23/0.16)] ring-1 ring-brand-black/5">
                  <div className="col-span-2 flex flex-col">
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                      {services.map((s, i) => {
                        const current = pathname === s.href;
                        return (
                          <motion.li
                            key={s.slug}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.03 * i, duration: 0.45, ease }}
                          >
                            <Link
                              href={s.href}
                              onClick={() => setMega(false)}
                              aria-current={current ? "page" : undefined}
                              className={`group flex items-center gap-3 rounded-2xl p-2.5 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-brand-bg focus-visible:bg-brand-bg ${
                                current ? "bg-brand-bg" : ""
                              }`}
                            >
                              <ServiceIconBox name={s.icon} active={current} />
                              <span className="min-w-0">
                                <span className="block text-[15px] font-semibold leading-tight text-brand-black">{s.title}</span>
                                <span className="mt-0.5 block text-[13.5px] leading-snug text-[#5D5F6B]">{s.tag}</span>
                              </span>
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                    <Link
                      href="/services"
                      onClick={() => setMega(false)}
                      className={`${arrowLink} mt-1 self-start px-2.5 py-2 text-sm font-semibold text-accent hover:text-accent-bright`}
                    >
                      All services
                      <ButtonArrow size={16} />
                    </Link>
                  </div>
                  <Link
                    href={nav.promo.href}
                    onClick={() => setMega(false)}
                    className="group relative flex flex-col justify-between self-stretch overflow-hidden rounded-[20px] bg-accent p-6 text-white"
                  >
                    {/* Vibrant Blue glow, top-right */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(1,30,253,0.6)_0%,transparent_70%)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125"
                    />
                    <span className="relative flex items-center justify-between">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-[13px] font-semibold ring-1 ring-white/25">{nav.promo.pill}</span>
                      <Star size={16} className="text-brand-orange drop-shadow-[0_0_8px_rgb(255_112_1/0.8)]" />
                    </span>
                    <span className="relative">
                      <span className="block font-display text-2xl font-semibold leading-tight tracking-tight">{nav.promo.title}</span>
                      <span className="mt-3 flex items-center gap-2 text-sm font-semibold text-brand-orange">
                        {nav.promo.cta}
                        <ButtonArrow size={16} />
                      </span>
                    </span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-brand-black px-6 pb-8 pt-6 text-white lg:hidden"
          >
            <div className="flex items-center justify-between">
              <Logo variant="dark" className="h-[38px]" />
              <button
                type="button"
                onClick={() => setMobile(false)}
                aria-label="Close menu"
                autoFocus
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-black"
              >
                <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-12 flex-1">
              <ul className="space-y-1">
                {nav.links.map((l, i) => (
                  <li key={l.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setMobile(false)}
                        aria-current={isActive(l.href) ? "page" : undefined}
                        className={`flex items-baseline gap-4 py-1 font-display text-5xl font-semibold tracking-tight ${
                          isActive(l.href) ? "text-brand-orange" : ""
                        }`}
                      >
                        <span className="text-sm font-medium text-brand-orange">{String(i + 1).padStart(2, "0")}</span>
                        {l.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <motion.ul
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + nav.links.length * 0.06, duration: 0.6, ease }}
                className="mt-6 space-y-1"
              >
                {nav.mobileExtra.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setMobile(false)}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className={`text-lg font-medium ${isActive(l.href) ? "text-brand-orange" : "text-white/75 hover:text-white"}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease }}
              className="mt-10 space-y-1 border-t border-white/10 pt-6 text-sm text-white/75"
            >
              <a href={site.phoneHref} className="block text-lg font-semibold text-white">
                {site.phone}
              </a>
              <a href={site.address.mapsHref} target="_blank" rel="noopener noreferrer" className="block">
                {site.address.full}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
