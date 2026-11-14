import Image from "next/image";
import Link from "@/components/TransitionLink";
import ButtonArrow from "@/components/ButtonArrow";
import { imageUrl } from "@/sanity/client";
import { formatDate, readMinutes, type PostCard as Post } from "@/sanity/data";

function Cover({ post, sizes, priority }: { post: Post; sizes: string; priority?: boolean }) {
  const src = imageUrl(post.coverImage, 1200, 750);
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#F1F0FB]">
      {src ? (
        <Image
          src={src}
          alt={post.coverImage?.alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--accent-bright),var(--accent)_55%,var(--accent-deep))]" />
      )}
    </div>
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 text-[13px] text-ink-2">
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden="true">·</span>
      <span>{readMinutes(post.words)} min read</span>
    </p>
  );
}

export function CategoryChip({ title, dark = false }: { title: string; dark?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[13px] font-semibold ${
        dark ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-[#F1F0FB] text-accent"
      }`}
    >
      {title}
    </span>
  );
}

/** Article card for grids. */
export default function PostCard({ post, priority }: { post: Post; priority?: boolean }) {
  return (
    <Link href={`/insights/${post.slug}`} className="group flex h-full flex-col">
      <Cover post={post} priority={priority} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
      <div className="mt-5 flex flex-1 flex-col">
        {post.category && (
          <span>
            <CategoryChip title={post.category.title} />
          </span>
        )}
        <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-ink-2">{post.excerpt}</p>
        <div className="mt-4">
          <Meta post={post} />
        </div>
      </div>
    </Link>
  );
}

/** The latest article, shown large at the top of /insights. */
export function FeaturedPostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group grid items-center gap-8 rounded-[28px] border border-brand-silver bg-white p-4 sm:p-5 lg:grid-cols-[1.2fr_1fr] lg:gap-12"
    >
      <Cover post={post} priority sizes="(min-width: 1024px) 680px, 100vw" />
      <div className="px-2 pb-4 lg:px-0 lg:pb-0 lg:pr-6">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-orange">Latest article</p>
        {post.category && (
          <span className="mt-4 block">
            <CategoryChip title={post.category.title} />
          </span>
        )}
        <h2 className="mt-4 font-display text-[clamp(28px,3.2vw,44px)] font-semibold leading-[1.05] tracking-[-0.035em] transition-colors group-hover:text-accent">
          {post.title}
        </h2>
        <p className="mt-4 text-lg text-ink-2">{post.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Meta post={post} />
          <span className="inline-flex items-center gap-2 font-semibold text-accent">
            Read article
            <ButtonArrow />
          </span>
        </div>
      </div>
    </Link>
  );
}
