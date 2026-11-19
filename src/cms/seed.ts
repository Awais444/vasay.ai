/**
 * The current site content (content.ts, services.ts, serviceGuides.ts, legal.ts) in the CMS shape.
 * Used (1) by the migration script to fill Sanity, and (2) as the fallback when Sanity isn't
 * configured, a fetch fails, or a singleton document doesn't exist yet.
 */
import type { PortableTextBlock } from "@portabletext/react";
import * as c from "@/lib/content";
import { serviceList } from "@/lib/services";
import { showcases } from "@/lib/systemShowcase";
import { serviceGuides } from "@/lib/serviceGuides";
import { privacy, terms } from "@/lib/legal";
import type { CmsContent, LegalDoc, Rich, Settings } from "./types";

/** "Title " + orange "accent" */
export const rich = (title: string, accent?: string): Rich =>
  accent ? [{ text: `${title} ` }, { text: accent, accent: true }] : [{ text: title }];
const plainLine = (t: string): Rich => [{ text: t }];
const orangeLine = (t: string): Rich => [{ text: t, accent: true }];

/** Derived contact fields (links, structured-data formats) from the editable ones. */
export function finishSettings(s: Omit<Settings, "phoneE164" | "phoneHref" | "phoneSchema" | "emailHref" | "address"> & { address: Omit<Settings["address"], "full"> }): Settings {
  const digits = s.phone.replace(/\D/g, "");
  const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  const e164 = `+1${national}`;
  const a = s.address;
  return {
    ...s,
    phoneE164: e164,
    // Clicking the number opens a WhatsApp chat.
    phoneHref: `https://wa.me/1${national}`,
    phoneSchema: `+1-${national.slice(0, 3)}-${national.slice(3, 6)}-${national.slice(6)}`,
    emailHref: `mailto:${s.email}`,
    address: { ...a, full: `${a.street}, ${a.city}, ${a.region} ${a.postalCode}` },
  };
}

let k = 0;
const key = () => `s${(k++).toString(36)}`;
/** Plain paragraphs -> Portable Text blocks */
export const paragraphsToBlocks = (paras: string[]): PortableTextBlock[] =>
  paras.map((text) => ({ _type: "block", _key: key(), style: "normal", markDefs: [], children: [{ _type: "span", _key: key(), text, marks: [] }] }));

const legal = (d: typeof privacy): LegalDoc => ({
  title: d.title,
  updated: d.updated,
  intro: d.intro,
  sections: d.sections.map((s) => ({ id: s.id, title: s.title, body: paragraphsToBlocks(s.body) })),
  seo: {},
});

export function seedContent(): CmsContent {
  const s = c.site;
  return {
    settings: finishSettings({
      name: s.name,
      legalName: s.legalName,
      tagline: s.tagline,
      description: s.description,
      phone: s.phone,
      email: s.email,
      address: { street: s.address.street, city: s.address.city, region: s.address.region, postalCode: s.address.postalCode, country: s.address.country },
      mapsHref: s.address.mapsHref,
      hours: s.hours,
      copyright: s.copyright,
      socials: s.socials,
      defaultSeo: { description: s.description },
      status: { show: true, text: c.nav.status },
      announcement: { show: false, text: "" },
    }),
    nav: { links: c.nav.links, mobileExtra: c.nav.mobileExtra, footer: c.nav.footer, cta: c.nav.cta, promo: c.nav.promo },
    home: {
      hero: {
        show: true,
        badge: c.hero.badge,
        trust: c.hero.trust,
        trustShort: c.hero.trustShort,
        lines: c.hero.lines.map((l, i) => (i === c.hero.lines.length - 1 ? orangeLine(l) : plainLine(l))),
        sub: c.hero.sub,
        subShort: c.hero.subShort,
        primaryCta: c.hero.primaryCta,
        secondaryCta: c.hero.secondaryCta,
        checks: c.hero.checks,
        chips: c.hero.chips,
      },
      marquee: { show: true, items: c.marquee },
      pillars: { show: true, eyebrow: c.pillars.eyebrow, title: rich(c.pillars.title, c.pillars.accent), intro: c.pillars.intro, linkLabel: c.pillars.linkLabel, items: c.pillars.items.map((p) => ({ ...p, points: [...p.points] })) },
      stats: { show: true, items: c.stats, manifestoShow: true, manifesto: c.manifesto },
      services: { show: true, eyebrow: c.servicesSection.eyebrow, title: rich(c.servicesSection.title, c.servicesSection.accent), intro: c.servicesSection.intro },
      whyUs: { show: true, eyebrow: c.whyUs.eyebrow, title: rich(c.whyUs.title, c.whyUs.accent), intro: c.whyUs.intro, cta: c.whyUs.cta, items: c.whyUs.items },
      process: { show: true, eyebrow: c.process.eyebrow, title: rich(c.process.title, c.process.accent), steps: c.process.steps, cta: c.process.cta },
      work: { show: true, eyebrow: c.workSection.eyebrow, title: rich(c.workSection.title, c.workSection.accent) },
      testimonials: { show: true, eyebrow: c.testimonialsSection.eyebrow, title: rich(c.testimonialsSection.title, c.testimonialsSection.accent) },
      team: { show: true, eyebrow: c.teamSection.eyebrow, title: rich(c.teamSection.title, c.teamSection.accent) },
      faq: { show: true, eyebrow: c.faqSection.eyebrow, title: rich(c.faqSection.title, c.faqSection.accent), intro: c.faqSection.intro, cta: c.faqSection.cta },
      contact: { show: true },
      seo: {},
    },
    services: serviceList.map((sv) => {
      const g = serviceGuides[sv.slug];
      return {
        slug: sv.slug,
        showcase: showcases[sv.slug],
        icon: sv.icon,
        title: sv.title,
        tag: sv.tag,
        description: sv.description,
        heroTitle: sv.heroTitle,
        heroAccent: sv.heroAccent,
        sub: sv.sub,
        h1Keyword: g?.h1Keyword ?? sv.title,
        definition: g?.definition ?? { q: "", a: "" },
        forWho: g?.forWho ?? [],
        guide: g?.guide ?? [],
        comparison: g?.comparison,
        problems: sv.problems,
        included: sv.included,
        deliverables: sv.deliverables,
        process: sv.process,
        faqs: [...sv.faqs, ...(g?.moreFaqs ?? [])],
        related: sv.related,
        note: sv.note,
        extraList: sv.extraList,
        seoTitle: sv.seoTitle,
        seoDescription: sv.seoDescription,
        seo: {},
        updated: g?.updated ?? "2026-11-14",
      };
    }),
    team: c.team.map((t) => ({ ...t })),
    testimonials: c.testimonials,
    work: c.work.map(({ image, ...w }) => ({ ...w, imageSrc: image })),
    faqs: { home: c.faqs, contact: c.faqs },
    about: {
      eyebrow: c.about.eyebrow,
      lines: [plainLine(c.about.title), [{ text: `${c.about.accentLead} ` }, { text: c.about.accent, accent: true }]],
      sub: c.about.sub,
      primaryCta: { label: "Book a free strategy call", href: "#contact" },
      secondaryCta: { label: "Meet the team", href: "#team" },
      story: { show: true, eyebrow: c.about.story.eyebrow, title: rich(c.about.story.title, c.about.story.accent), paragraphs: c.about.story.paragraphs },
      // Leadership content lives in Sanity only (no fallback copy).
      leadership: { show: false, eyebrow: "", title: [], members: [] },
      mission: { show: true, eyebrow: c.about.mission.eyebrow, title: rich(c.about.mission.title, c.about.mission.accent), statement: c.about.mission.statement, values: c.about.mission.values },
      showStats: true,
      showTeam: true,
      seo: {},
    },
    contact: {
      eyebrow: c.contact.eyebrow,
      lines: c.contact.lines.map((l, i) => (i === 1 ? orangeLine(l) : plainLine(l))),
      intro: c.contact.intro,
      serviceOptions: c.contact.services,
      budgets: c.contact.budgets,
      success: c.contact.success,
      seo: {},
    },
    servicesPage: {
      eyebrow: "Services",
      lines: [plainLine(c.servicesSection.title), orangeLine(c.servicesSection.accent)],
      sub: c.servicesSection.intro,
      primaryCta: { label: "Book a free strategy call", href: "#contact" },
      secondaryCta: { label: "Browse services", href: "#all-services" },
      showProcess: true,
      seo: {},
    },
    insightsPage: {
      lines: [plainLine("Marketing that actually works,"), orangeLine("explained.")],
      sub: "Practical guides on branding, websites, SEO, ads and AI automation, from the team that does it every day.",
      searchPlaceholder: "Search articles, e.g. Google Maps",
      empty: {
        title: "First articles coming soon",
        text: "We're writing practical guides on branding, websites, SEO, ads and automation. In the meantime, see how we can help.",
      },
      seo: {},
    },
    notFound: {
      eyebrow: "404",
      heading: plainLine("This page took a wrong turn."),
      text: "The page you're looking for has moved or doesn't exist.",
      primary: { label: "Back to home", href: "/" },
      secondary: { label: "Explore services", href: "/services" },
    },
    legal: { privacy: legal(privacy), terms: legal(terms) },
    redirects: [
      { from: "/our-services", to: "/services", permanent: true },
      { from: "/lead-generation-ai-automation", to: "/services/ai-automation", permanent: true },
    ],
    fallbacks: [],
  };
}
