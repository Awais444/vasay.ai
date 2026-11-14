"use client";

import ButtonArrow from "@/components/ButtonArrow";
import { m } from "framer-motion";
import { Star } from "./Logo";

const ease = [0.22, 1, 0.36, 1] as const;
const pop = (i: number) => ({
  initial: { opacity: 0, y: 14, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { delay: 0.6 + i * 0.12, duration: 0.7, ease },
});
const grow = (i: number) => ({
  initial: { scaleY: 0 },
  animate: { scaleY: 1 },
  transition: { delay: 0.7 + i * 0.07, duration: 0.9, ease },
});

function Panel({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative rounded-[28px] bg-brand-black/85 p-6 shadow-[0_40px_120px_rgb(10_10_40/0.5)] ring-1 ring-white/10">
      <div className="mb-5 flex items-center justify-between text-[13px] text-white/75">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </span>
        {label}
      </div>
      <div className="min-h-[300px]">{children}</div>
    </div>
  );
}

function Brand() {
  const sw = ["var(--accent)", "var(--brand-orange)", "var(--accent-deep)", "var(--brand-silver)", "var(--brand-red)", "var(--brand-black)"];
  return (
    <Panel label="Brand system">
      <m.p {...pop(0)} className="font-display text-6xl font-semibold tracking-[-0.05em] text-white">
        Aa<span className="text-brand-orange">.</span>
      </m.p>
      <div className="mt-8 grid grid-cols-3 gap-3">
        {sw.map((c, i) => (
          <m.span
            key={c}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.08, type: "spring", stiffness: 260, damping: 18 }}
            style={{ background: c }}
            className="h-16 rounded-2xl ring-1 ring-white/15"
          />
        ))}
      </div>
    </Panel>
  );
}

function WebDesign() {
  return (
    <Panel label="yourbrand.ca">
      <m.div {...pop(0)} className="h-6 w-2/3 rounded-lg bg-white/80" />
      <m.div {...pop(1)} className="mt-3 h-3 w-1/2 rounded bg-white/25" />
      <m.div {...pop(2)} className="mt-6 inline-block rounded-full bg-[var(--orange-strong)] px-4 py-2 text-[13px] font-semibold text-white">
        Book now
      </m.div>
      <div className="mt-8 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <m.div key={i} {...pop(3 + i)} className="h-24 rounded-2xl bg-white/[0.07] ring-1 ring-white/10" />
        ))}
      </div>
    </Panel>
  );
}

function WebDev() {
  const lines = ["w-3/4", "w-1/2", "w-2/3", "w-5/12", "w-3/5"];
  return (
    <Panel label="build · deploy">
      <div className="space-y-3 font-mono text-[13px]">
        {lines.map((w, i) => (
          <m.div key={i} {...pop(i)} className="flex items-center gap-3">
            <span className="text-white/75">{i + 1}</span>
            <span className={`h-2.5 rounded ${w} ${i === 2 ? "bg-brand-orange/80" : "bg-white/25"}`} />
          </m.div>
        ))}
      </div>
      <m.div {...pop(6)} className="mt-8 flex items-center gap-5 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
        <span className="flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl font-semibold text-emerald-400 ring-4 ring-emerald-400/70">
          98
        </span>
        <span className="text-sm text-white/75">
          <span className="block font-semibold text-white">Performance</span>
          Illustrative score
        </span>
      </m.div>
    </Panel>
  );
}

function Seo() {
  const rows = ["Competitor A", "Competitor B", "Competitor C"];
  return (
    <Panel label="Google · local results">
      <m.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1, ease }}
        className="flex items-center gap-3 rounded-2xl bg-white p-4 text-brand-black"
      >
        <span className="font-display text-2xl font-semibold text-accent">#1</span>
        <span className="flex-1">
          <span className="block font-semibold">Your business</span>
          <span className="text-[13px] text-brand-orange">★★★★★ · Open now</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-emerald-600">
          <ButtonArrow dir="up" size={14} nudge={false} />7
        </span>
      </m.div>
      {rows.map((r, i) => (
        <m.div key={r} {...pop(i)} className="mt-3 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4 text-white/75 ring-1 ring-white/10">
          <span className="font-display text-xl font-semibold">#{i + 2}</span>
          {r}
        </m.div>
      ))}
    </Panel>
  );
}

function Social() {
  return (
    <Panel label="This month's grid">
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <m.div
            key={i}
            {...pop(i * 0.5)}
            className={`aspect-square rounded-xl ${
              [0, 4, 8].includes(i) ? "bg-brand-orange" : i % 2 ? "bg-accent-bright" : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <m.p {...pop(6)} className="mt-5 flex items-center gap-2 text-sm text-white/75">
        <span className="text-brand-orange">♥</span> 2,418 · <span>💬 136</span> · <span className="text-white/75">Illustrative</span>
      </m.p>
    </Panel>
  );
}

function PaidAds() {
  const bars = [100, 82, 70, 58, 50, 41];
  return (
    <Panel label="Cost per lead">
      <m.p {...pop(0)} className="flex items-center gap-2 font-display text-5xl font-semibold tracking-tight text-white">
        <ButtonArrow dir="down" size={40} nudge={false} />
        41%
      </m.p>
      <p className="mt-1 text-sm text-white/75">Illustrative · 6 months</p>
      <div className="mt-8 flex h-40 items-end gap-3">
        {bars.map((h, i) => (
          <m.span
            key={i}
            {...grow(i)}
            style={{ height: `${h}%`, transformOrigin: "bottom" }}
            className={`flex-1 rounded-t-lg ${i === bars.length - 1 ? "bg-brand-orange" : "bg-white/20"}`}
          />
        ))}
      </div>
    </Panel>
  );
}

function Automation() {
  const chat = [
    { ai: false, t: "Hi, can I get a quote this week?" },
    { ai: true, t: "Absolutely! I have Wed 10am or Fri 2pm. Which works?" },
    { ai: false, t: "Friday please" },
    { ai: true, t: "Booked ✓ Reminder sent" },
  ];
  return (
    <Panel label="AI assistant · replied in 8s">
      <div className="flex flex-col gap-3">
        {chat.map((msg, i) => (
          <m.p
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.8, duration: 0.5, ease }}
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.ai ? "self-end rounded-br-md bg-accent text-white" : "self-start rounded-bl-md bg-white/10 text-white/90"
            }`}
          >
            {msg.t}
          </m.p>
        ))}
      </div>
    </Panel>
  );
}

function Security() {
  const checks = ["SSL & security headers", "Firewall active", "Malware scan: clean", "Daily backup complete"];
  return (
    <Panel label="Security status">
      <div className="flex items-center gap-5">
        <m.svg {...pop(0)} viewBox="0 0 48 56" className="h-20 w-20 shrink-0" aria-hidden="true">
          <path d="M24 2 44 10v16c0 13-8.6 23.5-20 28C12.6 49.5 4 39 4 26V10L24 2Z" fill="var(--accent)" stroke="white" strokeOpacity=".3" />
          <m.path
            d="M15 28l6.5 6.5L34 22"
            fill="none"
            stroke="var(--brand-orange)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 0.7, ease }}
          />
        </m.svg>
        <p className="text-white">
          <span className="block font-display text-2xl font-semibold">Protected</span>
          <span className="text-sm text-white/75">Monitored 24/7</span>
        </p>
      </div>
      <ul className="mt-7 space-y-2.5">
        {checks.map((c, i) => (
          <m.li key={c} {...pop(i + 1)} className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-4 py-3 text-sm text-white/85 ring-1 ring-white/10">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[13px] font-bold text-brand-black">✓</span>
            {c}
          </m.li>
        ))}
      </ul>
    </Panel>
  );
}

const map: Record<string, () => React.ReactElement> = {
  "brand-identity": Brand,
  "website-design": WebDesign,
  "web-development": WebDev,
  seo: Seo,
  "social-media": Social,
  "paid-ads": PaidAds,
  "ai-automation": Automation,
  cybersecurity: Security,
};

export default function ServiceVisual({ slug }: { slug: string }) {
  const V = map[slug];
  if (!V) return null;
  return (
    <div aria-hidden="true" className="relative">
      <Star size={18} className="absolute -left-3 -top-3 z-10 text-brand-orange drop-shadow-[0_0_10px_rgb(255_112_1/0.9)]" />
      <V />
    </div>
  );
}
