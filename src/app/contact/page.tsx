import JsonLd from "@/components/JsonLd";
import { breadcrumbs, faqPage, ORG_ID, webPage } from "@/lib/schema";
import { MapPin } from "lucide-react";
import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import { pageMetadata, withSeo } from "@/lib/seo";
import Contact from "@/components/Contact";
import { Faq } from "@/components/Sections";
import { getContent } from "@/cms/content";
import type { Settings } from "@/cms/types";

const TITLE = "Contact Us | Digital Marketing Agency in Concord, ON";
const describe = (s: Settings) =>
  `Contact Smart Solutions, a digital marketing agency in ${s.address.city}, ${s.address.region}. Call ${s.phone} or visit ${s.address.street}. We reply within one business day.`;

export async function generateMetadata() {
  const { settings, contact } = await getContent();
  return withSeo(pageMetadata({ title: TITLE, description: describe(settings), path: "/contact" }), contact.seo);
}

function Details({ site }: { site: Settings }) {
  const realSocials = site.socials.filter((s) => s.href);
  return (
    <div className="mt-10 space-y-8">
      {site.hours && (
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/75">Hours</p>
          <p className="mt-2 text-white/80">{site.hours}</p>
        </div>
      )}
      {realSocials.length > 0 && (
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/75">Follow</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {realSocials.map((s) => (
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
      )}
      {/* TODO: add a static map image of the real location here (client will provide). No iframe, for speed and privacy. */}
      {site.address.street && (
        <div className="rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white/[0.06] text-brand-orange ring-1 ring-white/10">
              <MapPin size={22} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60">
                {site.address.city}, {site.address.region} · Greater Toronto Area
              </p>
              <address className="mt-2 not-italic leading-relaxed text-white">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
              </address>
            </div>
          </div>
          {site.mapsHref && (
            <a
              href={site.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${arrowLink} mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-orange hover:text-white`}
            >
              Open in Google Maps
              <ButtonArrow dir="up-right" size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default async function ContactPage() {
  const c = await getContent();
  const faqs = c.faqs.contact;
  return (
    <>
      <JsonLd
        data={[
          webPage({ type: "ContactPage", path: "/contact", name: c.contact.seo.metaTitle || TITLE, description: c.contact.seo.metaDescription || describe(c.settings), about: { "@id": ORG_ID } }),
          breadcrumbs("/contact", [
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          ...(faqs.length ? [faqPage("/contact", faqs)] : []),
        ]}
      />
      <Contact contact={c.contact} settings={c.settings} asPage aside={<Details site={c.settings} />} />
      {faqs.length > 0 && <Faq items={faqs} heading={c.home.faq} overlap />}
    </>
  );
}
