// Server Component: About page "Leadership" (founders and leaders picked in Sanity). No client JavaScript.
import Image from "next/image";
import type { AboutPage } from "@/cms/types";
import { revealProps } from "@/lib/reveal";
import { initials, memberPhoto } from "@/lib/team";
import { Heading } from "./Heading";

export default function Leadership({ data }: { data: AboutPage["leadership"] }) {
  if (!data.show || !data.members.length) return null;
  return (
    <section id="leadership" aria-labelledby="leadership-title" className="mx-auto max-w-7xl px-5 sm:px-6 section-y tone-light">
      <div id="leadership-title">
        <Heading eyebrow={data.eyebrow} title={data.title} />
      </div>
      <ul className={`mt-[var(--head-gap)] grid gap-6 ${data.members.length > 1 ? "lg:grid-cols-2" : "max-w-3xl"}`}>
        {data.members.map((m, i) => {
          const src = memberPhoto(m, 800);
          return (
            <li
              key={m.slug || m.name}
              {...revealProps(i * 0.08)}
              className="group grid overflow-hidden rounded-[var(--radius-card)] border border-brand-silver bg-white sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-accent sm:m-3 sm:mr-0">
                {src ? (
                  <>
                    <Image
                      src={src}
                      alt={m.photo?.alt || `${m.name}, ${m.role} at Smart Solutions`}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
                      className="team-photo object-cover"
                    />
                    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-accent/55 to-transparent" />
                  </>
                ) : (
                  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent to-accent-deep font-display text-7xl font-semibold tracking-tight text-white">
                    {initials(m.name)}
                    <span className="absolute bottom-6 left-6 h-2 w-12 rounded-full bg-brand-orange" />
                  </span>
                )}
              </div>
              <div className="flex flex-col p-7 sm:p-8">
                <h3 className="font-display text-[28px] font-semibold leading-tight tracking-tight lg:text-[32px]">{m.name}</h3>
                {m.role && <p className="mt-2 text-base font-semibold text-accent">{m.role}</p>}
                {m.bio && <p className="mt-5 line-clamp-4 text-base leading-relaxed text-ink-2 sm:text-[17px]">{m.bio}</p>}
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    className="mt-auto inline-flex h-11 w-11 items-center justify-center self-start rounded-full bg-accent text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-accent-bright"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                    </svg>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
