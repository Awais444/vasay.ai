import Link from "@/components/TransitionLink";
import Logo from "./Logo";
import { ServiceIcon } from "./ServiceIcon";
import { nav, services, site } from "@/lib/content";

const heading = "text-sm font-semibold uppercase tracking-[0.14em] text-white/75";
const link = "text-white/75 transition-colors hover:text-brand-orange";

export default function Footer() {
  return (
    <footer className="relative overflow-clip bg-brand-black pt-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 border-t border-white/10 px-4 pt-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1.2fr_0.8fr_0.8fr]">
        <div>
          <Logo variant="dark" sizes="150px" className="h-20 sm:h-24" />
          <p className="mt-5 max-w-xs text-white/75">{site.tagline}</p>
          {/* NAP: must match the JSON-LD (src/lib/schema.ts) and the Google Business Profile exactly. */}
          <address className="mt-6 space-y-1 text-sm not-italic text-white/75">
            <span className="block font-semibold text-white">{site.legalName}</span>
            <a href={site.phoneHref} className="block font-semibold text-white hover:text-brand-orange">
              {site.phone}
            </a>
            <a href={site.emailHref} className="block hover:text-white">
              {site.email}
            </a>
            <a href={site.address.mapsHref} target="_blank" rel="noopener noreferrer" className="block hover:text-white">
              {site.address.full}
            </a>
          </address>
        </div>
        <nav aria-label="Services">
          <p className={heading}>
            <Link href="/services" className="hover:text-white">
              Services
            </Link>
          </p>
          <ul className="mt-4 space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={s.href} className={`${link} inline-flex items-center gap-2.5`}>
                  <ServiceIcon name={s.icon} size={16} className="shrink-0 text-white/60" />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className={heading}>Company</p>
          <ul className="mt-4 space-y-2">
            {nav.footer.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className={heading}>Follow</p>
          <ul className="mt-4 space-y-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p
        aria-hidden="true"
        data-text="VASAY.AI"
        className="watermark pointer-events-none mt-16 select-none text-center font-display text-[22vw] font-bold leading-[0.8] tracking-[-0.06em] text-white/[0.05]"
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-white/75 sm:flex-row sm:justify-between sm:px-6">
        <p>{site.copyright}</p>
        <p className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
        </p>
      </div>
    </footer>
  );
}
