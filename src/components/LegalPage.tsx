import Link from "@/components/TransitionLink";
import type { LegalDoc } from "@/lib/legal";
import { Star } from "./Logo";

/** Readable legal layout (~720px measure) with a table of contents. */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="px-4 pt-36 sm:px-6 sm:pt-44 section-pb">
      <header className="mx-auto max-w-[720px]">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>{" "}
          / <span aria-current="page">{doc.title}</span>
        </nav>
        <p className="mt-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
          <Star size={10} className="text-brand-orange" />
          Legal
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,4.5rem)] font-semibold leading-none">{doc.title}</h1>
        <p className="mt-4 text-sm text-ink-2">Last updated: {doc.updated}</p>
        <p className="mt-8 text-lg leading-relaxed text-ink-2">{doc.intro}</p>
      </header>

      <nav aria-label="Table of contents" className="mx-auto mt-12 max-w-[720px] rounded-[var(--radius-card)] border border-brand-silver bg-white p-6 sm:p-8">
        <p className="font-display text-lg font-semibold">Contents</p>
        <ol className="mt-4 grid gap-x-8 gap-y-2 text-[15px] sm:grid-cols-2">
          {doc.sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="flex gap-3 text-ink-2 hover:text-accent">
                <span className="font-display text-brand-orange">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mx-auto mt-14 max-w-[720px] space-y-12">
        {doc.sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-28">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              <span className="mr-3 text-brand-orange">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <div className="mt-4 space-y-4 text-[17px] leading-[1.75] text-ink-2">
              {s.body.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
