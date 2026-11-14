import Link from "@/components/TransitionLink";
import { PenLine } from "lucide-react";
import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import PostCard from "./PostCard";
import type { Category, PostCard as Post } from "@/sanity/data";

/** Category filter pills. `active` is the current category slug (none = "All"). */
export function CategoryPills({ categories, active }: { categories: Category[]; active?: string }) {
  if (categories.length === 0) return null;
  const pill = (on: boolean) =>
    `inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold ring-1 transition-colors ${
      on ? "bg-accent text-white ring-accent" : "bg-white text-brand-black ring-brand-silver hover:ring-accent hover:text-accent"
    }`;
  return (
    <nav aria-label="Article categories">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href="/insights" className={pill(!active)} aria-current={!active ? "page" : undefined}>
            All
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/insights/category/${c.slug}`}
              className={pill(active === c.slug)}
              aria-current={active === c.slug ? "page" : undefined}
            >
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <li key={p._id}>
          <PostCard post={p} priority={i < 3} />
        </li>
      ))}
    </ul>
  );
}

export function Pagination({ page, pages }: { page: number; pages: number }) {
  if (pages <= 1) return null;
  const href = (n: number) => (n === 1 ? "/insights" : `/insights/page/${n}`);
  const box = "flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-semibold";
  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} className={`${arrowLink} ${box} ring-1 ring-brand-silver hover:ring-accent`} aria-label="Previous page">
          <ButtonArrow dir="left" size={16} />
        </Link>
      )}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={href(n)}
          aria-current={n === page ? "page" : undefined}
          className={`${box} ${n === page ? "bg-accent text-white" : "ring-1 ring-brand-silver hover:ring-accent hover:text-accent"}`}
        >
          {n}
        </Link>
      ))}
      {page < pages && (
        <Link href={href(page + 1)} className={`${arrowLink} ${box} ring-1 ring-brand-silver hover:ring-accent`} aria-label="Next page">
          <ButtonArrow size={16} />
        </Link>
      )}
    </nav>
  );
}

const EMPTY_CHIPS = [
  { label: "SEO", href: "/services/seo" },
  { label: "Paid Ads", href: "/services/paid-ads" },
  { label: "AI Automation", href: "/services/ai-automation" },
];

export function EmptyState({ title = "First articles coming soon", text }: { title?: string; text?: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-brand-silver bg-white px-6 py-12 text-center sm:py-14">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F0FB] text-accent">
        <PenLine size={24} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-ink-2">
        {text ?? "We're writing practical guides on branding, websites, SEO, ads and automation. In the meantime, see how we can help."}
      </p>
      <Link
        href="/services"
        className={`${arrowLink} mt-8 rounded-full bg-accent px-6 py-3.5 font-semibold text-white transition-colors hover:bg-accent-deep`}
      >
        Explore our services
        <ButtonArrow />
      </Link>
      <ul aria-label="Popular services" className="mt-8 flex flex-wrap justify-center gap-2">
        {EMPTY_CHIPS.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="inline-flex min-h-11 items-center rounded-full bg-brand-bg px-4 text-sm font-semibold text-brand-black ring-1 ring-brand-silver transition-colors hover:text-accent hover:ring-accent"
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
