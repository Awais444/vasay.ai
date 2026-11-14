import ButtonArrow from "@/components/ButtonArrow";
import { revealProps } from "@/lib/reveal";
import { MonitorSmartphone, Target, Zap, type LucideIcon } from "lucide-react";
import Link from "@/components/TransitionLink";
import { pillars } from "@/lib/content";

const ICONS: Record<(typeof pillars.items)[number]["icon"], LucideIcon> = { Target, MonitorSmartphone, Zap };
const smooth = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** "Three Pillars": Attract · Convert · Automate. White sheet that overlaps the hero's bottom edge. */
export default function Pillars() {
  return (
    <section
      id="intro"
      aria-labelledby="pillars-title"
      className="relative z-10 -mt-7 rounded-t-[28px] bg-white sm:-mt-10 sm:rounded-t-[40px] py-[clamp(90px,10vw,120px)] tone-white"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header: heading left, supporting text bottom-right */}
        <div className="grid gap-6 min-[860px]:grid-cols-[1.4fr_1fr] min-[860px]:items-end min-[860px]:gap-12">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#5D5F6B]">{pillars.eyebrow}</p>
            <h2
              id="pillars-title"
              className="mt-4 font-display text-[clamp(36px,4.6vw,62px)] font-medium leading-none tracking-[-0.04em] [text-wrap:balance]"
            >
              {pillars.title} <span className="text-brand-orange">{pillars.accent}</span>
            </h2>
          </div>
          <p className="max-w-[440px] text-lg leading-[1.6] text-[#5D5F6B] min-[860px]:justify-self-end">{pillars.intro}</p>
        </div>

        {/* Pillars: dividers only, no cards */}
        <ul
          className="mt-[70px] grid border-t border-brand-silver min-[860px]:grid-cols-3"
        >
          {pillars.items.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <li
                key={p.title}
                {...revealProps(i * 0.12)}
                className={`relative ${
                  i > 0 ? "border-t border-brand-silver min-[860px]:border-l min-[860px]:border-t-0" : ""
                }`}
              >
                <Link
                  href={p.href}
                  className={`group relative block h-full py-[30px] min-[860px]:py-12 ${
                    i === 0 ? "min-[860px]:pr-10" : i === pillars.items.length - 1 ? "min-[860px]:pl-10" : "min-[860px]:px-10"
                  }`}
                >
                  {/* 2px Klein Blue line drawing across the top border on hover */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -top-px h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-700 ${smooth} group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none`}
                  />
                  <span className="block font-display text-sm font-medium text-accent">{p.num}</span>
                  <span
                    className={`mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3F2FD] text-accent transition-[background-color,color,transform] duration-300 ${smooth} group-hover:-translate-y-1 group-hover:bg-accent group-hover:text-white group-focus-visible:-translate-y-1 group-focus-visible:bg-accent group-focus-visible:text-white`}
                  >
                    <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <h3 className="mt-7 font-display text-4xl font-medium tracking-[-0.03em]">{p.title}</h3>
                  <p className="mt-3 max-w-[320px] text-[16.5px] leading-relaxed text-[#5D5F6B]">{p.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-3 text-[15px] text-brand-black">
                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <span
                    className={`mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent opacity-0 transition-[opacity,transform] duration-300 ${smooth} -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100`}
                  >
                    {pillars.linkLabel}
                    <ButtonArrow size={16} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
