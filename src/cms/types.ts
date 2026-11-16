/**
 * The shape of ALL editable site content. Built from Sanity (src/cms/content.ts), or from the seed
 * files (src/cms/seed.ts) when Sanity is unavailable. Components only ever see this shape.
 */
import type { PortableTextBlock } from "@portabletext/react";
import { SHOWCASE_ICONS, SHOWCASE_VISUALS } from "./showcase-options";
import type { ProblemIconName, ServiceIconName } from "@/lib/services";
import type { SanityImage } from "@/sanity/data";

/** A heading/line with some words marked orange ("accent"). */
export type Segment = { text: string; accent?: boolean };
export type Rich = Segment[];

export type Link = { label: string; href: string };
export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  canonical?: string;
  noindex?: boolean;
};

export type Settings = {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  phone: string;
  /** E.164 (+14375640199) */
  phoneE164: string;
  phoneHref: string;
  /** +1-437-564-0199, for structured data */
  phoneSchema: string;
  email: string;
  emailHref: string;
  address: { street: string; city: string; region: string; postalCode: string; country: string; full: string };
  mapsHref: string;
  hours: string;
  copyright: string;
  socials: Link[];
  defaultSeo: { titleTemplate?: string; description?: string; ogImage?: SanityImage };
  ga4Id?: string;
  gtmId?: string;
  status: { show: boolean; text: string };
  announcement: { show: boolean; text: string; href?: string };
};

export type Navigation = {
  links: (Link & { mega?: boolean })[];
  mobileExtra: Link[];
  footer: Link[];
  cta: Link;
  promo: { pill: string; title: string; cta: string; href: string };
};

export type Pillar = { num: string; icon: "Target" | "MonitorSmartphone" | "Zap"; title: string; body: string; points: string[]; href: string };
export type ProcessStep = { num: string; title: string; time: string; body: string; chips: string[] };
export type SectionHead = { eyebrow: string; title: Rich; intro?: string };

export type Home = {
  hero: {
    show: boolean;
    badge: string;
    trust: string;
    trustShort: string;
    lines: Rich[];
    sub: string;
    subShort: string;
    primaryCta: Link;
    secondaryCta: Link;
    checks: string[];
    chips: { lead: { title: string; meta: string }; ads: { title: string; meta: string }; brand: { title: string }; chart: { title: string } };
  };
  marquee: { show: boolean; items: string[] };
  pillars: SectionHead & { show: boolean; linkLabel: string; items: Pillar[] };
  stats: { show: boolean; items: { value: number; suffix: string; label: string }[]; manifestoShow: boolean; manifesto: string };
  services: SectionHead & { show: boolean };
  whyUs: SectionHead & { show: boolean; cta: Link; items: { title: string; body: string }[] };
  process: SectionHead & { show: boolean; steps: ProcessStep[]; cta: Link };
  work: SectionHead & { show: boolean };
  testimonials: SectionHead & { show: boolean };
  team: SectionHead & { show: boolean };
  faq: SectionHead & { show: boolean; cta: Link };
  contact: { show: boolean };
  seo: Seo;
};

export type GuideSection = { q: string; a: string[] };
export type Comparison = { title: string; intro: string; head: [string, string, string]; rows: [string, string, string][] };
export type Faq = { q: string; a: string };

export { SHOWCASE_ICONS, SHOWCASE_VISUALS };
export type ShowcaseIcon = (typeof SHOWCASE_ICONS)[number];
export type ShowcaseVisual = (typeof SHOWCASE_VISUALS)[number];

/** One automation in the "System showcase" app window. */
export type ShowcaseItem = {
  name: string;
  icon: ShowcaseIcon;
  tag: string;
  description: string;
  miniTags: string[];
  bullets: string[];
  connects: string[];
  /** Terminal lines; the part after the last ": " is the success text */
  activity: string[];
  steps: string[];
  visual: ShowcaseVisual;
};

/** Optional interactive "app window" block on a service page (right after the hero). */
export type SystemShowcase = { eyebrow: string; title: string; accent: string; sub: string; /** Button in the panel, scrolls to "What's included" */ cta: string; items: ShowcaseItem[] };

export type Service = {
  slug: string;
  showcase?: SystemShowcase;
  icon: ServiceIconName;
  title: string;
  tag: string;
  description: string;
  heroTitle: string;
  heroAccent: string;
  sub: string;
  h1Keyword: string;
  definition: { q: string; a: string };
  forWho: string[];
  guide: GuideSection[];
  comparison?: Comparison;
  problems: { icon: ProblemIconName; title: string; body: string }[];
  included: { title: string; body: string }[];
  deliverables: string[];
  process: { title: string; body: string }[];
  /** FAQs from the FAQ collection that are assigned to this service */
  faqs: Faq[];
  related: string[];
  note?: string;
  extraList?: { title: string; items: string[] };
  seoTitle: string;
  seoDescription: string;
  seo: Seo;
  updated: string;
};

export type TeamMember = { name: string; role: string; slug: string; tint: string; photo?: SanityImage; photoSrc?: string; bio?: string };
export type Testimonial = { quote: string; name: string; role: string; business?: string; rating?: number; approved: boolean };
export type WorkItem = { category: string; title: string; description: string; gradient: string; href: string; image?: SanityImage; imageSrc?: string; result?: string };

export type LegalDoc = { title: string; updated: string; intro: string; sections: { id: string; title: string; body: PortableTextBlock[] }[]; seo: Seo };

export type ContactPage = {
  eyebrow: string;
  lines: Rich[];
  intro: string;
  serviceOptions: string[];
  budgets: string[];
  success: { title: string; body: string };
  seo: Seo;
};

export type AboutPage = {
  eyebrow: string;
  lines: Rich[];
  sub: string;
  primaryCta: Link;
  secondaryCta: Link;
  story: SectionHead & { show: boolean; paragraphs: string[] };
  mission: SectionHead & { show: boolean; statement: string; values: { title: string; body: string }[] };
  showStats: boolean;
  showTeam: boolean;
  seo: Seo;
};

export type ServicesPage = { eyebrow: string; lines: Rich[]; sub: string; primaryCta: Link; secondaryCta: Link; showProcess: boolean; seo: Seo };
export type InsightsPage = { lines: Rich[]; sub: string; searchPlaceholder: string; empty: { title: string; text: string }; seo: Seo };
export type NotFoundPage = { eyebrow: string; heading: Rich; text: string; primary: Link; secondary: Link };

export type CmsContent = {
  settings: Settings;
  nav: Navigation;
  home: Home;
  services: Service[];
  team: TeamMember[];
  /** All testimonials; visibility rules are applied by the Testimonials helpers */
  testimonials: Testimonial[];
  work: WorkItem[];
  faqs: { home: Faq[]; contact: Faq[] };
  about: AboutPage;
  contact: ContactPage;
  servicesPage: ServicesPage;
  insightsPage: InsightsPage;
  notFound: NotFoundPage;
  legal: { privacy: LegalDoc; terms: LegalDoc };
  redirects: { from: string; to: string; permanent: boolean }[];
  /** Which parts came from the seed files instead of Sanity (shown as a notice in preview). */
  fallbacks: string[];
};
