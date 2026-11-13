import { site } from "@/lib/content";
import ButtonArrow from "@/components/ButtonArrow";
import { pageMetadata } from "@/lib/seo";
import Contact from "@/components/Contact";
import { Faq } from "@/components/Sections";

export const metadata = pageMetadata({
  title: "Contact Smart Solutions | Concord, ON Marketing Agency",
  description:
    "Call (647) 559-3900 or send us a message. Smart Solutions is at 3300 Hwy 7, Floor 6, Concord, ON. We reply within one business day.",
  path: "/contact",
});

function Details() {
  return (
    <div className="mt-10 space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/75">Hours</p>
        {/* TODO: confirm real business hours in content.ts (site.hours). */}
        <p className="mt-2 text-white/80">{site.hours}</p>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/75">Follow</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full px-4 py-2 text-sm ring-1 ring-white/20 transition-colors hover:bg-white hover:text-brand-black"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* TODO: replace this placeholder with a real static map image (e.g. /public/map.jpg). No iframe, for speed and privacy. */}
      <a
        href={site.address.mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-accent-deep ring-1 ring-white/10"
      >
        <span aria-hidden="true" className="dot-grid absolute inset-0 opacity-70" />
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(115deg,transparent_45%,rgb(255_255_255/0.12)_45%,rgb(255_255_255/0.12)_48%,transparent_48%),linear-gradient(20deg,transparent_60%,rgb(255_255_255/0.1)_60%,rgb(255_255_255/0.1)_62%,transparent_62%)]" />
        <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange shadow-[0_0_30px_rgb(255_112_1/0.8)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1">
            <span className="h-3 w-3 rounded-full bg-white" />
          </span>
        </span>
        <span className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm text-brand-black">
          <span className="font-semibold">{site.address.street}, {site.address.city}</span>
          <span className="inline-flex items-center gap-2 font-semibold text-accent">
            Open in Google Maps
            <ButtonArrow dir="up-right" size={16} />
          </span>
        </span>
      </a>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <Contact asPage aside={<Details />} />
      <Faq />
    </>
  );
}
