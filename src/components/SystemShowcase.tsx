/*
 * "System showcase": an app window where visitors click through the automations of a service.
 * Everything is server-rendered (all panels in the HTML, inactive ones `hidden`), so it reads fine
 * without JavaScript and for crawlers. SystemShowcaseIsland lazy-loads the interaction code when
 * the section nears the viewport.
 */
import { CalendarCheck, Check, KanbanSquare, PhoneMissed, Repeat, Search, Star, Zap, type LucideIcon } from "lucide-react";
import type { ShowcaseIcon, ShowcaseItem, SystemShowcase as Showcase } from "@/cms/types";
import Link from "./TransitionLink";
import { Star as BrandStar } from "./Logo";
import SystemShowcaseIsland from "./SystemShowcaseIsland";
import "./system-showcase.css";

const ICONS: Record<ShowcaseIcon, LucideIcon> = { Zap, Repeat, CalendarCheck, PhoneMissed, Star, KanbanSquare };

/** Splits "> label: text ✓" into the prompt, the text and (on a ✓ line) the green success part. */
function activitySegments(line: string) {
  const text = line.replace(/^>\s*/, "");
  const done = text.trim().endsWith("✓");
  const cut = done ? text.lastIndexOf(": ") : -1;
  return cut > 0 ? [{ t: text.slice(0, cut + 2), ok: false }, { t: text.slice(cut + 2), ok: true }] : [{ t: text, ok: false }];
}

function Visual({ item }: { item: ShowcaseItem }) {
  switch (item.visual) {
    case "reply":
      return (
        <div className="sc-v sc-v-reply">
          <div className="sc-card sc-a1">
            <span className="sc-chip-dot" /> New enquiry · website form
            <p className="mt-1.5 text-white/90">&ldquo;Hi, could I get a quote for next week?&rdquo;</p>
          </div>
          <div className="sc-bubble sc-a2">Thanks for reaching out! Here are two times we could talk. Which suits you?</div>
        </div>
      );
    case "timeline":
      return (
        <div className="sc-v sc-v-timeline">
          <div className="sc-track">
            <span className="sc-track-fill sc-a-fill" />
          </div>
          <ol className="sc-days">
            {["Day 1", "Day 3", "Day 7"].map((d, i) => (
              <li key={d} className={`sc-a${i + 1}`}>
                <span className="sc-day-dot" />
                {d}
              </li>
            ))}
          </ol>
          <div className="sc-badge sc-a4">
            <Check size={14} aria-hidden="true" /> Lead replied
          </div>
        </div>
      );
    case "calendar":
      return (
        <div className="sc-v sc-v-calendar">
          <div className="sc-cal">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
              <span key={d} className="sc-cal-head">
                {d}
              </span>
            ))}
            {Array.from({ length: 15 }, (_, i) => (
              <span key={i} className={`sc-slot ${i === 8 ? "sc-slot-pick sc-a2" : ""}`}>
                {i === 8 ? "2:00" : ""}
              </span>
            ))}
          </div>
          <div className="sc-badge sc-a3">
            <Check size={14} aria-hidden="true" /> Booked: Thu 2:00 PM
          </div>
        </div>
      );
    case "missed-call":
      return (
        <div className="sc-v sc-v-missed">
          <div className="sc-missed sc-a-out">
            <PhoneMissed size={26} aria-hidden="true" />
            <span>Missed call</span>
          </div>
          <div className="sc-bubble sc-a2">Sorry we missed you! How can we help? Reply here or pick a time to talk.</div>
        </div>
      );
    case "stars":
      return (
        <div className="sc-v sc-v-stars">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="sc-star">
                <Star size={30} aria-hidden="true" />
                <Star size={30} aria-hidden="true" className={`sc-star-fill sc-a${n}`} />
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-white/70">Google review request</p>
        </div>
      );
    case "kanban":
      return (
        <div className="sc-v sc-v-kanban">
          {["New", "Booked", "Won"].map((col, i) => (
            <div key={col} className="sc-col">
              <span className="sc-col-head">{col}</span>
              <span className="sc-kcard" />
              {i !== 1 && <span className="sc-kcard" />}
              {i === 0 && <span className="sc-kcard sc-kmove" aria-hidden="true" />}
            </div>
          ))}
        </div>
      );
  }
}

function Panel({ item, index, cta }: { item: ShowcaseItem; index: number; cta: string }) {
  const Icon = ICONS[item.icon] ?? Zap;
  return (
    <div
      role="tabpanel"
      id={`sc-panel-${index}`}
      aria-labelledby={`sc-tab-${index}`}
      hidden={index !== 0}
      data-sc-panel
      tabIndex={0}
      className="sc-panel p-5 outline-none sm:p-7"
    >
      <span className="inline-flex rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-accent">{item.tag}</span>
      <h3 className="mt-3 flex items-center gap-3 font-display text-2xl font-semibold sm:text-[28px]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
          <Icon size={20} aria-hidden="true" />
        </span>
        {item.name}
      </h3>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-xs text-ink-2">
        {item.miniTags.map((t) => (
          <li key={t} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-2xl text-base text-ink-2 sm:text-[17px]">{item.description}</p>

      <div className="mt-6 grid gap-5 min-[900px]:grid-cols-[1.35fr_1fr]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="sc-control" data-visual={item.visual}>
            <Visual item={item} />
            {item.steps.length > 0 && (
              <ol className="sc-steps" aria-label="Steps">
                {item.steps.map((s, i) => (
                  <li key={s} data-sc-step data-current={i === item.steps.length - 1 ? "" : undefined}>
                    {s}
                  </li>
                ))}
              </ol>
            )}
          </div>
          {item.activity.length > 0 && (
            <div className="sc-term" aria-label="Activity log (demo)">
              <p className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-white/50">
                Activity <span>demo</span>
              </p>
              {item.activity.map((line) => (
                <p key={line} data-sc-line className="sc-line">
                  <span className="sc-prompt">&gt;</span>{" "}
                  {activitySegments(line).map((seg, i) => (
                    <span key={i} data-sc-seg className={seg.ok ? "sc-ok" : undefined}>
                      {seg.t}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-2">What it does</h4>
          <ul className="mt-2 divide-y divide-brand-silver">
            {item.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 py-3 text-[15px]">
                <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                {b}
              </li>
            ))}
          </ul>
          {item.connects.length > 0 && (
            <>
              <h4 className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-ink-2">Connects with</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {item.connects.map((c) => (
                  <li key={c} className="rounded-full border border-brand-silver bg-brand-bg px-3 py-1 text-sm">
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}
          <a
            href="#included"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-klein px-6 py-3.5 font-semibold text-white transition-colors hover:bg-accent min-[900px]:mt-auto"
          >
            {cta}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SystemShowcase({ data }: { data: Showcase }) {
  if (!data.items.length) return null;
  return (
    <section aria-labelledby="system-title" className="section-y tone-light">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
            <BrandStar size={10} className="text-brand-orange" />
            {data.eyebrow}
          </p>
          <h2 id="system-title" className="mt-4 font-display text-[clamp(2.1rem,5vw,4rem)] font-semibold leading-[1.02]">
            {data.title} {data.accent && <span className="text-brand-orange">{data.accent}</span>}
          </h2>
          {data.sub && <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-2">{data.sub}</p>}
        </div>

        <div data-sc-root className="sc-window mx-auto mt-[var(--head-gap)] max-w-[1200px]">
          {/* Title bar */}
          <div className="sc-titlebar relative flex items-center justify-center border-b border-brand-silver px-4 py-3">
            <span className="sc-dots absolute left-4 flex gap-1.5" aria-hidden="true">
              <span className="bg-[#FF5F57]" />
              <span className="bg-[#FEBC2E]" />
              <span className="bg-[#28C840]" />
            </span>
            <span className="truncate font-mono text-xs text-ink-2">Smart Solutions · Lead Engine</span>
            <span className="absolute right-4 rounded-full bg-[#FFF1E6] px-2.5 py-0.5 text-[11px] font-semibold text-[#8F3600]">Demo</span>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-brand-silver px-4 py-3">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Find an automation</span>
              <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-2" />
              <input
                type="search"
                data-sc-search
                placeholder="Find an automation…"
                autoComplete="off"
                className="w-full max-w-sm rounded-full border border-brand-silver bg-brand-bg py-2 pl-10 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </label>
            <Link
              href="/contact"
              className="rounded-full bg-brand-klein px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
            >
              Book a strategy call
            </Link>
          </div>

          <div className="sc-body">
            {/* Sidebar */}
            <div className="sc-side">
              <p className="sc-side-title">Automations</p>
              <div role="tablist" aria-label="Automations" aria-orientation="vertical" className="sc-tabs">
                {data.items.map((it, i) => {
                  const Icon = ICONS[it.icon] ?? Zap;
                  return (
                    <button
                      key={it.name}
                      type="button"
                      role="tab"
                      id={`sc-tab-${i}`}
                      aria-controls={`sc-panel-${i}`}
                      aria-selected={i === 0}
                      tabIndex={i === 0 ? 0 : -1}
                      data-sc-tab
                      data-name={it.name.toLowerCase()}
                      className="sc-tab"
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{it.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="sc-empty" data-sc-empty hidden>
                No automation matches.
              </p>
              <div className="sc-side-foot">
                <Link href="/services" className="text-sm font-semibold text-accent hover:text-accent-bright">
                  All services →
                </Link>
              </div>
            </div>

            {/* Panels */}
            <div className="min-w-0">
              {data.items.map((it, i) => (
                <Panel key={it.name} item={it} index={i} cta={data.cta} />
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-brand-silver px-4 py-2.5 font-mono text-[11px] text-ink-2">
            <span className="flex items-center gap-1.5">
              <span className="sc-live h-2 w-2 rounded-full bg-[#16A34A]" aria-hidden="true" /> Demo running
            </span>
            <span>{data.items.length} automations</span>
            <span>1 CRM</span>
            <span className="ml-auto">Concord, ON → Canada-wide</span>
          </div>
        </div>
      </div>
      <SystemShowcaseIsland />
    </section>
  );
}
