/**
 * JSON-LD builders (schema.org). One organisation entity (@id #organization) and one website (#website);
 * every page links to them. Only real values: unknown facts are TODOs and simply left out.
 */
import type { Service, Settings } from "@/cms/types";
import { siteUrl } from "./env";

export const ORG_ID = `${siteUrl}/#organization`;
export const WEBSITE_ID = `${siteUrl}/#website`;
export const abs = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path === "/" ? "" : path}`);

/** Strip the [text](/url) link markup used in content strings. */
export const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

const CITIES = ["Vaughan", "Concord", "Toronto", "Mississauga", "Brampton", "Markham", "Richmond Hill"];
export const areaServed = [
  ...CITIES.map((name) => ({ "@type": "City", name, containedInPlace: { "@type": "AdministrativeArea", name: "Ontario" } })),
  { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
  { "@type": "Country", name: "Canada" },
];

/** Only real profile URLs (placeholders like https://instagram.com/ are skipped). */
const realProfiles = (links: { href: string }[]) =>
  links.map((s) => s.href).filter((h) => {
    try {
      return new URL(h).pathname.length > 1;
    } catch {
      return false;
    }
  });

/** Site-wide business entity (from Site settings in the CMS). */
export function organization(site: Settings) {
  const sameAs = realProfiles(site.socials);
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: site.legalName,
    alternateName: ["Smart Solutions", "Smart Solutions, Powered by VASAY.AI", "VASAY.AI"],
    url: siteUrl,
    logo: { "@type": "ImageObject", url: abs("/brand/logo.webp"), width: 900, height: 589 },
    image: abs("/opengraph-image"),
    description: site.description,
    telephone: site.phoneSchema,
    email: site.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: site.phoneSchema,
      email: site.email,
      areaServed: "CA",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed,
    knowsAbout: [
      "Digital marketing",
      "Search engine optimization",
      "Local SEO",
      "Google Ads",
      "Meta advertising",
      "Social media marketing",
      "Marketing automation",
      "AI lead generation",
      "GoHighLevel",
      "Web design",
      "Web development",
      "Brand identity",
      "Website security",
    ],
    // TODO: add when confirmed — geo (latitude/longitude), openingHoursSpecification, email,
    // foundingDate, founder, and sameAs (social profiles, Google Business Profile, directories).
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function website() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteUrl,
    name: "Smart Solutions, Powered by VASAY.AI",
    inLanguage: "en-CA",
    publisher: { "@id": ORG_ID },
  };
}

type PageType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
export function webPage({
  type = "WebPage",
  path,
  name,
  description,
  dateModified,
  about,
}: {
  type?: PageType;
  path: string;
  name: string;
  description: string;
  dateModified?: string;
  about?: object;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name,
    description,
    inLanguage: "en-CA",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    ...(dateModified ? { dateModified } : {}),
    ...(about ? { about } : {}),
    breadcrumb: { "@id": `${abs(path)}#breadcrumb` },
  };
}

export function breadcrumbs(path: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${abs(path)}#breadcrumb`,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function service(s: Service, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${abs(`/services/${s.slug}`)}#service`,
    name: s.title,
    serviceType: s.title,
    description,
    url: abs(`/services/${s.slug}`),
    provider: { "@id": ORG_ID },
    areaServed,
    // TODO: add `offers` only if real published pricing exists.
  };
}

export function offerCatalog(serviceList: Pick<Service, "slug" | "title">[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${abs("/services")}#catalog`,
    name: "Digital marketing services",
    itemListElement: serviceList.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@id": `${abs(`/services/${s.slug}`)}#service`, "@type": "Service", name: s.title, url: abs(`/services/${s.slug}`) },
    })),
  };
}

export function faqPage(path: string, faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${abs(path)}#faq`,
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: plain(f.q), acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
  };
}
