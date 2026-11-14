"use client";

import { useEffect, useRef } from "react";
import { m, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star } from "./Logo";

const spring = { stiffness: 60, damping: 20, mass: 0.6 };

/**
 * The blue hero's depth layers: gradient mesh, dot grid, rings with orbiting star,
 * parallax glows, cursor spotlight and grain. Place inside a `relative isolate overflow-clip`
 * section; it listens to mouse moves on its parent.
 */
export default function HeroBackground({ ringsClassName = "top-[330px] sm:top-[360px]" }: { ringsClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useMotionValue(-999);
  const py = useMotionValue(-999);
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);
  const lx = useTransform(sx, (v) => v * -40);
  const ly = useTransform(sy, (v) => v * -30);
  const rx = useTransform(sx, (v) => v * 50);
  const ry = useTransform(sy, (v) => v * 40);
  const spot = useMotionTemplate`radial-gradient(500px circle at ${px}px ${py}px, rgb(255 255 255 / 0.10), transparent 60%)`;

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
      px.set(e.clientX - r.left);
      py.set(e.clientY - r.top);
    };
    parent.addEventListener("mousemove", onMove);
    return () => parent.removeEventListener("mousemove", onMove);
  }, [mx, my, px, py]);

  // Pause looping animations (mesh, rings, chips, marquee) while the hero is off-screen.
  useEffect(() => {
    const section = ref.current?.parentElement;
    if (!section) return;
    const io = new IntersectionObserver(([e]) => section.toggleAttribute("data-offscreen", !e.isIntersecting));
    io.observe(section);
    return () => io.disconnect();
  }, [mx, my, px, py]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="hero-mesh absolute -inset-[20%] opacity-90" />
      <div className="dot-grid absolute inset-0" />
      <m.div style={{ x: lx, y: ly }} className="absolute -left-[280px] -top-[40px] h-[760px] w-[760px] bg-[radial-gradient(closest-side,var(--accent-deep)_35%,transparent)]" />
      <m.div style={{ x: rx, y: ry }} className="absolute -right-[248px] top-[40px] h-[660px] w-[660px] bg-[radial-gradient(closest-side,rgb(255_112_1/0.4)_35%,transparent)]" />
      <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 ${ringsClassName}`}>
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 sm:h-[560px] sm:w-[560px]" />
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15 sm:h-[820px] sm:w-[820px]" />
        <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07] sm:h-[1080px] sm:w-[1080px]" />
        {/* Orbiting star and dot: ≥768px only (on phones the dot crossed the CTA buttons). */}
        <div className="orbit absolute left-1/2 top-1/2 hidden h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 sm:h-[1080px] sm:w-[1080px] md:block">
          <Star size={22} className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 text-brand-orange drop-shadow-[0_0_12px_rgb(255_112_1/0.9)]" />
        </div>
        <div className="orbit-rev absolute left-1/2 top-1/2 hidden h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 sm:h-[560px] sm:w-[560px] md:block">
          <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_white]" />
        </div>
      </div>
      <m.div style={{ background: spot }} className="absolute inset-0 hidden md:block" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
