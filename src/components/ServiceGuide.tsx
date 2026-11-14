import { Check } from "lucide-react";
import RichText from "./RichText";
import type { ServiceGuide as Guide } from "@/lib/serviceGuides";

const fmt = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

/**
 * Answer-first explainer on each service page: "What is X?", who it's for, question-led sections
 * (cost, timeline, how it works) with a direct answer first, an optional comparison table, and the
 * last-updated date. All plain server-rendered HTML, so search engines and AI tools can read and quote it.
 */
export default function ServiceGuide({ guide, title }: { guide: Guide; title: string }) {
  return (
    <section aria-labelledby="service-basics" className="bg-white section-y tone-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-2">The basics</p>
            <h2 id="service-basics" className="mt-4 font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.02] tracking-[-0.04em]">
              {guide.definition.q}
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-brand-black">{guide.definition.a}</p>
            <p className="mt-6 text-sm text-ink-2">
              Last updated <time dateTime={guide.updated}>{fmt(guide.updated)}</time>
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-brand-silver bg-brand-bg p-7 sm:p-8">
            <h3 className="font-display text-xl font-semibold tracking-tight">Who {title} is for</h3>
            <ul className="mt-5 space-y-3">
              {guide.forWho.map((w) => (
                <li key={w} className="flex gap-3 text-[17px] leading-snug">
                  <Check size={20} strokeWidth={2.2} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 grid gap-x-16 gap-y-14 lg:grid-cols-2">
          {guide.guide.map((g) => (
            <article key={g.q}>
              <h2 className="font-display text-[clamp(24px,2.4vw,32px)] font-semibold leading-tight tracking-[-0.03em]">{g.q}</h2>
              {g.a.map((p, i) => (
                <p key={i} className={`mt-4 leading-relaxed ${i === 0 ? "text-lg text-brand-black" : "text-ink-2 sm:text-[17px]"}`}>
                  <RichText text={p} />
                </p>
              ))}
            </article>
          ))}
        </div>

        {guide.comparison && (
          <div className="mt-20">
            <h2 className="font-display text-[clamp(26px,2.8vw,38px)] font-semibold tracking-[-0.03em]">{guide.comparison.title}</h2>
            <p className="mt-3 max-w-2xl text-lg text-ink-2">{guide.comparison.intro}</p>
            <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-brand-silver">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead className="bg-brand-bg">
                  <tr>
                    {guide.comparison.head.map((h, i) => (
                      <th key={i} scope="col" className="px-5 py-4 font-display text-base font-semibold">
                        {h || <span className="sr-only">Compared on</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.comparison.rows.map(([label, a, b]) => (
                    <tr key={label} className="border-t border-brand-silver">
                      <th scope="row" className="px-5 py-4 font-semibold">
                        {label}
                      </th>
                      <td className="px-5 py-4 text-ink-2">{a}</td>
                      <td className="px-5 py-4 text-ink-2">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
