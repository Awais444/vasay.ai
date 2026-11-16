import Link from "@/components/TransitionLink";
import ButtonArrow from "@/components/ButtonArrow";
import { formatDate, readMinutes, type PostCard as Post } from "@/sanity/data";
import { AuthorAvatar } from "./AuthorBox";
import CoverImage from "./CoverImage";
import { imageBase } from "@/sanity/client";

/** Lets TransitionProvider preload the article cover on hover/touch (and on idle for the featured card). */
const preloadAttrs = (post: Post, idle = false) => {
  const src = imageBase(post.coverImage, 16 / 9);
  return src ? { "data-cover-preload": src, ...(idle ? { "data-cover-preload-idle": "" } : {}) } : {};
};

/** Author avatar + name, then date and read time. */
function Meta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-ink-2">
      {post.author && (
        <span className="flex items-center gap-2 font-semibold text-brand-black">
          <AuthorAvatar author={{ ...post.author, photo: post.author.photo && { ...post.author.photo, alt: "" } }} size={28} />
          {post.author.name}
        </span>
      )}
      <span className="flex items-center gap-x-2">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span aria-hidden="true">·</span>
        <span>{readMinutes(post.words)} min read</span>
      </span>
    </div>
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

/** Keeps hyphenated words (e.g. "Follow-Up") on one line. */
function NoBreakHyphens({ text }: { text: string }) {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Animated underline in the current colour, drawn on hover of the parent `.group`. */
const underline =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-[0.04em] transition-[background-size,color] duration-500 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_2px] group-hover:text-accent group-focus-visible:bg-[length:100%_2px]";

/** Article card for grids: equal heights, 2-line title and excerpt, lifts 4px on hover. */
export default function PostCard({ post, priority }: { post: Post; priority?: boolean }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      {...preloadAttrs(post)}
      label={post.category?.title ?? "Insights"}
      className="group flex h-full flex-col transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 motion-reduce:hover:translate-y-0"
    >
      <CoverImage
        image={post.coverImage}
        category={post.category}
        priority={priority}
        zoom
        sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="mt-5 flex flex-1 flex-col">
        {post.category && (
          <span>
            <CategoryChip title={post.category.title} />
          </span>
        )}
        <h3 className="mt-3 line-clamp-2 text-xl font-semibold leading-snug tracking-tight [text-wrap:balance] sm:text-2xl">
          <span className={underline}>
            <NoBreakHyphens text={post.title} />
          </span>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-ink-2">{post.excerpt}</p>
        <div className="mt-4">
          <Meta post={post} />
        </div>
      </div>
    </Link>
  );
}

/** The latest article, shown large at the top of /insights. The whole card is the link. */
export function FeaturedPostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      {...preloadAttrs(post, true)}
      label={post.category?.title ?? "Insights"}
      className="group grid items-center gap-8 rounded-[28px] border border-brand-silver bg-white p-4 sm:p-5 lg:grid-cols-[1.2fr_1fr] lg:gap-12"
    >
      <CoverImage image={post.coverImage} category={post.category} priority={priority} zoom sizes="(min-width: 1280px) 680px, (min-width: 1024px) 54vw, 100vw" />
      <div className="px-2 pb-4 lg:px-0 lg:pb-0 lg:pr-6">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--orange-text)]">Latest article</p>
        {post.category && (
          <span className="mt-4 block">
            <CategoryChip title={post.category.title} />
          </span>
        )}
        <h2 className="mt-4 font-display text-[clamp(28px,2.6vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em] text-brand-black [hyphens:none] [text-wrap:balance] [word-break:keep-all]">
          <span className={underline}>
            <NoBreakHyphens text={post.title} />
          </span>
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
