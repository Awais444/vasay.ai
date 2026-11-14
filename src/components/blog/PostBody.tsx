import Image from "next/image";
import { PortableText, toPlainText, type PortableTextBlock, type PortableTextBlockComponent, type PortableTextComponents } from "@portabletext/react";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import Link from "@/components/TransitionLink";
import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import { imageUrl } from "@/sanity/client";
import type { SanityImage } from "@/sanity/data";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

export type Heading = { id: string; text: string; level: 2 | 3 };

/** H2/H3 headings for the table of contents (same ids as the rendered headings). */
export function getHeadings(body: PortableTextBlock[] = []): Heading[] {
  return body
    .filter((b) => b._type === "block" && (b.style === "h2" || b.style === "h3"))
    .map((b) => {
      const text = toPlainText(b);
      return { id: slugify(text), text, level: b.style === "h2" ? 2 : 3 };
    });
}

type FaqItem = { question: string; answer: string };
/** All FAQ items in the body (for FAQPage JSON-LD). */
export function getFaqs(body: PortableTextBlock[] = []): FaqItem[] {
  return body.flatMap((b) => (b._type === "faqBlock" ? ((b as unknown as { items?: FaqItem[] }).items ?? []) : []));
}

const heading = (Tag: "h2" | "h3" | "h4", cls: string): PortableTextBlockComponent =>
  function H({ children, value }) {
    const id = Tag === "h4" ? undefined : slugify(toPlainText(value));
    return (
      <Tag id={id} className={`scroll-mt-[calc(var(--nav-h)+24px)] font-display font-semibold tracking-[-0.03em] ${cls}`}>
        {children}
      </Tag>
    );
  };

const TONES = {
  tip: { Icon: Lightbulb, cls: "border-brand-orange/40 bg-[#FFF6EE]", icon: "text-brand-orange" },
  info: { Icon: Info, cls: "border-accent/30 bg-[#F3F2FD]", icon: "text-accent" },
  warning: { Icon: TriangleAlert, cls: "border-brand-red/40 bg-[#FFF1EB]", icon: "text-brand-red" },
} as const;

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-6">{children}</p>,
    h2: heading("h2", "mt-14 text-[clamp(26px,3vw,34px)] leading-tight"),
    h3: heading("h3", "mt-10 text-[clamp(21px,2.2vw,25px)] leading-snug"),
    h4: heading("h4", "mt-8 text-xl"),
    blockquote: ({ children }) => (
      <blockquote className="mt-8 border-l-4 border-brand-orange pl-6 font-display text-[22px] font-medium leading-snug text-brand-black">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-6 list-disc space-y-2 pl-6 marker:text-brand-orange">{children}</ul>,
    number: ({ children }) => <ol className="mt-6 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-accent">{children}</ol>,
  },
  marks: {
    code: ({ children }) => <code className="rounded-md bg-[#F1F0FB] px-1.5 py-0.5 font-mono text-[0.9em] text-accent">{children}</code>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href) && !href.includes("vasay.ai");
      return (
        <a
          href={href}
          target={value?.blank || external ? "_blank" : undefined}
          rel={value?.blank || external ? "noopener noreferrer" : undefined}
          className="font-medium text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: SanityImage }) => {
      const src = imageUrl(value, 1440);
      if (!src) return null;
      return (
        <figure className="mt-10">
          <Image src={src} alt={value.alt ?? ""} width={1440} height={900} sizes="(min-width: 768px) 720px, 100vw" className="h-auto w-full rounded-[20px]" />
          {value.caption && <figcaption className="mt-3 text-center text-sm text-ink-2">{value.caption}</figcaption>}
        </figure>
      );
    },
    callout: ({ value }: { value: { tone?: keyof typeof TONES; title?: string; text: string } }) => {
      const t = TONES[value.tone ?? "tip"] ?? TONES.tip;
      return (
        <aside className={`mt-8 flex gap-4 rounded-[20px] border p-5 sm:p-6 ${t.cls}`}>
          <t.Icon size={22} strokeWidth={1.9} aria-hidden="true" className={`mt-0.5 shrink-0 ${t.icon}`} />
          <div className="text-[17px] leading-relaxed">
            {value.title && <p className="font-semibold text-brand-black">{value.title}</p>}
            <p className={value.title ? "mt-1" : ""}>{value.text}</p>
          </div>
        </aside>
      );
    },
    table: ({ value }: { value: { caption?: string; headerRow?: boolean; rows?: { _key: string; cells?: string[] }[] } }) => {
      const rows = value.rows ?? [];
      const [head, ...rest] = value.headerRow ? rows : [undefined, ...rows];
      return (
        <figure className="mt-10 overflow-x-auto rounded-[16px] border border-brand-silver">
          <table className="w-full border-collapse text-left text-base">
            {value.caption && <caption className="caption-bottom px-4 py-3 text-sm text-ink-2">{value.caption}</caption>}
            {head && (
              <thead className="bg-brand-bg">
                <tr>
                  {(head.cells ?? []).map((c, i) => (
                    <th key={i} scope="col" className="px-4 py-3 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rest.map((r) =>
                r ? (
                  <tr key={r._key} className="border-t border-brand-silver">
                    {(r.cells ?? []).map((c, i) => (
                      <td key={i} className="px-4 py-3 align-top">
                        {c}
                      </td>
                    ))}
                  </tr>
                ) : null,
              )}
            </tbody>
          </table>
        </figure>
      );
    },
    codeBlock: ({ value }: { value: { language?: string; code: string } }) => (
      <figure className="mt-8">
        <pre className="overflow-x-auto rounded-[16px] bg-brand-black p-5 text-[15px] leading-relaxed text-white/90">
          <code data-language={value.language}>{value.code}</code>
        </pre>
      </figure>
    ),
    faqBlock: ({ value }: { value: { title?: string; items?: (FaqItem & { _key: string })[] } }) => (
      <section className="mt-12 rounded-[24px] border border-brand-silver bg-white p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">{value.title || "Frequently asked questions"}</h2>
        <div className="mt-4 divide-y divide-brand-silver">
          {(value.items ?? []).map((it) => (
            <details key={it._key} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {it.question}
                <span aria-hidden="true" className="text-xl text-accent transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-ink-2">{it.answer}</p>
            </details>
          ))}
        </div>
      </section>
    ),
    ctaBlock: ({ value }: { value: { title: string; text?: string; buttonLabel: string; buttonHref: string } }) => (
      <aside className="mt-12 rounded-[24px] bg-accent p-7 text-white sm:p-9">
        <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{value.title}</p>
        {value.text && <p className="mt-2 text-white/80">{value.text}</p>}
        <Link
          href={value.buttonHref || "/contact"}
          className={`${arrowLink} mt-6 rounded-full bg-white px-6 py-3.5 font-semibold text-accent transition-colors hover:bg-brand-orange hover:text-white`}
        >
          {value.buttonLabel}
          <ButtonArrow />
        </Link>
      </aside>
    ),
  },
};

export default function PostBody({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return (
    <div className="post-body text-[18px] leading-[1.75] text-[#2b2c33] [&>*:first-child]:mt-0">
      <PortableText value={value} components={components} />
    </div>
  );
}
