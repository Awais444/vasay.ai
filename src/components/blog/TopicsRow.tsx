import Link from "@/components/TransitionLink";
import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import { ServiceIcon } from "@/components/ServiceIcon";
import type { Service } from "@/cms/types";
import type { PostCard } from "@/sanity/data";

/** One line per topic. Keyed by service slug (blog categories use the same slugs). */
const ONE_LINERS: Record<string, string> = {
  "brand-identity": "Logos, colour and voice that make you recognisable.",
  "website-design": "Layouts and journeys that turn visitors into enquiries.",
  "web-development": "Fast, accessible sites built on modern frameworks.",
  seo: "Rank for the searches your customers already make.",
  "social-media": "A steady content engine across every platform.",
  "paid-ads": "Google, Meta and TikTok ads judged on cost per lead.",
  "ai-automation": "Instant replies, booking and follow-up that run themselves.",
  cybersecurity: "Keep your site and customer data protected.",
};

/** "Topics we cover": one card per service, with the article count or "Coming soon". */
export function TopicsRow({ services, posts }: { services: Service[]; posts: PostCard[] }) {
  return (
    <section aria-labelledby="topics-title" className="mt-20">
      <h2 id="topics-title" className="font-display text-[clamp(26px,2.6vw,36px)] font-semibold tracking-[-0.03em]">
        Topics we cover
      </h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => {
          const count = posts.filter((p) => p.category?.slug === s.slug).length;
          const href = count ? `/insights/category/${s.slug}` : `/services/${s.slug}`;
          return (
            <li key={s.slug}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-[20px] border border-brand-silver bg-white p-5 transition-[transform,border-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-accent motion-reduce:hover:translate-y-0"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F0FB] text-accent">
                  <ServiceIcon name={s.icon} size={22} />
                </span>
                <span className="mt-4 font-semibold leading-snug text-brand-black transition-colors group-hover:text-accent">{s.title}</span>
                <span className="mt-1 flex-1 text-sm text-ink-2">{ONE_LINERS[s.slug] ?? s.description}</span>
                <span className={`mt-4 text-[13px] font-semibold ${count ? "text-accent" : "text-ink-2"}`}>
                  {count ? `${count} article${count === 1 ? "" : "s"}` : "Coming soon"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Slim band inviting readers to suggest a question. */
export function AskBand() {
  return (
    <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-[24px] bg-accent px-6 py-7 text-white sm:flex-row sm:items-center sm:px-9">
      <p className="font-display text-[clamp(22px,2.2vw,28px)] font-semibold leading-tight tracking-[-0.02em]">
        Have a question you&apos;d like us to answer?
      </p>
      <Link
        href="/contact"
        className={`${arrowLink} shrink-0 rounded-full bg-white px-6 py-3.5 font-semibold text-accent transition-colors hover:bg-brand-orange hover:text-white`}
      >
        Ask us
        <ButtonArrow />
      </Link>
    </div>
  );
}
