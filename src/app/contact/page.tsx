import { site } from "@/lib/content";
import { MapPin } from "lucide-react";
import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
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
      {/* TODO: add a static map image of the real location here (client will provide). No iframe, for speed and privacy. */}
      <div className="rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white/[0.06] text-brand-orange ring-1 ring-white/10">
            <MapPin size={22} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60">Concord, ON · Greater Toronto Area</p>
            <address className="mt-2 not-italic leading-relaxed text-white">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region} {site.address.postalCode}
            </address>
          </div>
        </div>
        <a
          href={site.address.mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${arrowLink} mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-orange hover:text-white`}
        >
          Open in Google Maps
          <ButtonArrow dir="up-right" size={16} />
        </a>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <Contact asPage aside={<Details />} />
      <Faq overlap />
    </>
  );
}
