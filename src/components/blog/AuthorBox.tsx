import Image from "next/image";
import Link from "@/components/TransitionLink";
import { imageUrl } from "@/sanity/client";
import type { Author, AuthorRef } from "@/sanity/data";

export function AuthorAvatar({ author, size = 48 }: { author: AuthorRef; size?: number }) {
  const src = imageUrl(author.photo, size * 2, size * 2);
  return src ? (
    <Image src={src} alt={author.photo?.alt ?? author.name} width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-accent font-display font-semibold text-white"
    >
      {author.name.slice(0, 1)}
    </span>
  );
}

/** "Written by" box under the article. */
export default function AuthorBox({ author }: { author: Author }) {
  return (
    <section aria-label="About the author" className="flex flex-col gap-5 rounded-[24px] border border-brand-silver bg-white p-6 sm:flex-row sm:p-8">
      <AuthorAvatar author={author} size={72} />
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-2">Written by</p>
        <Link href={`/insights/author/${author.slug}`} className="mt-1 inline-block font-display text-2xl font-semibold tracking-tight hover:text-accent">
          {author.name}
        </Link>
        {author.role && <p className="text-ink-2">{author.role}</p>}
        {author.bio && <p className="mt-3 text-[17px] leading-relaxed text-[#2b2c33]">{author.bio}</p>}
        {!!author.socials?.length && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {author.socials.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold ring-1 ring-brand-silver hover:text-accent hover:ring-accent"
                >
                  {s.platform || "Website"}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
