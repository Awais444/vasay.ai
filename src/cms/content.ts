import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";
import { createClient, type FilterDefault } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";
import { seedContent, finishSettings } from "./seed";
import type { CmsContent, Faq, Link, Rich, Seo, SystemShowcase } from "./types";
import { SHOWCASE_ICONS, SHOWCASE_VISUALS } from "./showcase-options";

/*
 * ALL editable site content, from Sanity. Cached (tag "cms"); /api/revalidate refreshes it on publish.
 *
 * Fallback to the seed files (src/cms/seed.ts) happens ONLY when:
 *   - Sanity isn't configured (no project ID), or
 *   - the fetch fails, or
 *   - a singleton document doesn't exist yet (e.g. before the migration).
 * An empty field or an empty collection is never replaced: the matching section simply hides.
 * Every fallback is logged on the server and listed in `fallbacks` (shown as a notice in preview).
 */

/** Read token: server-only (no NEXT_PUBLIC_ prefix). Needed only for draft/preview reads. */
const readToken = process.env.SANITY_API_READ_TOKEN;

const QUERY = `{
  "settings": *[_id == "siteSettings"][0],
  "nav": *[_id == "navigation"][0],
  "home": *[_id == "homePage"][0],
  "about": *[_id == "aboutPage"][0],
  "contact": *[_id == "contactPage"][0],
  "servicesPage": *[_id == "servicesPage"][0],
  "insightsPage": *[_id == "insightsPage"][0],
  "notFound": *[_id == "notFoundPage"][0],
  "privacy": *[_id == "legal-privacy"][0],
  "terms": *[_id == "legal-terms"][0],
  "services": *[_type == "service" && defined(slug.current)] | order(order asc, title asc) {
    ..., "slug": slug.current, "related": related[]->slug.current
  },
  "faqs": *[_type == "faq"] | order(order asc) { q, a, showOn, "services": services[]->slug.current },
  "team": *[_type == "teamMember" && show != false] | order(order asc) { name, role, "slug": slug.current, tint, photo, bio },
  "testimonials": *[_type == "testimonial"] | order(order asc) { quote, name, business, service, rating, approved },
  "work": *[_type == "workItem"] | order(order asc) { title, category, description, gradient, href, image, result },
  "redirects": *[_type == "redirect" && defined(from) && defined(to)] { from, to, permanent }
}`;

/* eslint-disable @typescript-eslint/no-explicit-any */
type Raw = Record<string, any>;

/** Portable Text lines (one block per line, "accent" mark = orange) -> Rich[] */
export const toLines = (blocks?: PortableTextBlock[] | null): Rich[] =>
  (blocks ?? []).map((b) =>
    ((b as Raw).children ?? []).map((c: Raw) => ({ text: c.text ?? "", ...(c.marks?.includes("accent") ? { accent: true } : {}) })),
  );
const toRich = (blocks?: PortableTextBlock[] | null): Rich => toLines(blocks)[0] ?? [];
const L = (l?: Raw | null): Link => ({ label: l?.label ?? "", href: l?.href ?? "" });
const arr = <T = any,>(a?: T[] | null): T[] => (Array.isArray(a) ? a : []);

/** Service "System showcase" block: hidden (undefined) when it has no automations. */
function showcase(sc: Raw | undefined): SystemShowcase | undefined {
  const items = arr(sc?.items).filter((i: Raw) => i?.name);
  if (!sc || !items.length) return undefined;
  return {
    eyebrow: sc.eyebrow ?? "",
    title: sc.title ?? "",
    accent: sc.accent ?? "",
    sub: sc.sub ?? "",
    cta: sc.cta || "See what's included",
    items: items.map((i: Raw) => ({
      name: i.name,
      icon: (SHOWCASE_ICONS as readonly string[]).includes(i.icon) ? i.icon : "Zap",
      visual: (SHOWCASE_VISUALS as readonly string[]).includes(i.visual) ? i.visual : "reply",
      tag: i.tag ?? "",
      description: i.description ?? "",
      miniTags: arr(i.miniTags),
      bullets: arr(i.bullets),
      connects: arr(i.connects),
      activity: arr(i.activity),
      steps: arr(i.steps),
    })),
  };
}
const head = (h?: Raw | null) => ({ eyebrow: h?.eyebrow ?? "", title: toRich(h?.title), intro: h?.intro ?? undefined });
const seo = (s?: Raw | null): Seo => s ?? {};

function build(raw: Raw, seed: CmsContent): CmsContent {
  const fallbacks: string[] = [];
  /** Use the Sanity singleton, or the seed when the document doesn't exist yet. */
  const single = <T,>(name: string, doc: Raw | null, map: (d: Raw) => T, fallback: T): T => {
    if (doc) return map(doc);
    fallbacks.push(`${name} (document missing)`);
    return fallback;
  };

  const settings = single(
    "Site settings",
    raw.settings,
    (d) =>
      finishSettings({
        name: d.name ?? "",
        legalName: d.legalName ?? "",
        tagline: d.tagline ?? "",
        description: d.description ?? "",
        phone: d.phone ?? "",
        email: d.email ?? "",
        address: { street: d.address?.street ?? "", city: d.address?.city ?? "", region: d.address?.region ?? "", postalCode: d.address?.postalCode ?? "", country: d.address?.country ?? "CA" },
        mapsHref: d.mapsHref ?? "",
        hours: d.hours ?? "",
        copyright: d.copyright ?? "",
        socials: arr(d.socials).map(L),
        defaultSeo: d.defaultSeo ?? {},
        ga4Id: d.ga4Id || undefined,
        gtmId: d.gtmId || undefined,
        status: { show: d.status?.show ?? false, text: d.status?.text ?? "" },
        announcement: { show: d.announcement?.show ?? false, text: d.announcement?.text ?? "", href: d.announcement?.href },
      }),
    seed.settings,
  );

  const nav = single(
    "Navigation",
    raw.nav,
    (d) => ({
      links: arr(d.links).map((l: Raw) => ({ ...L(l), mega: !!l.mega })),
      mobileExtra: arr(d.mobileExtra).map(L),
      footer: arr(d.footer).map(L),
      cta: L(d.cta),
      promo: { pill: d.promo?.pill ?? "", title: d.promo?.title ?? "", cta: d.promo?.cta ?? "", href: d.promo?.href ?? "" },
    }),
    seed.nav,
  );

  const home = single(
    "Home page",
    raw.home,
    (d) => {
      const sec = (o?: Raw | null) => ({ show: !!o && o.show !== false });
      return {
        hero: {
          ...sec(d.hero),
          badge: d.hero?.badge ?? "",
          trust: d.hero?.trust ?? "",
          trustShort: d.hero?.trustShort ?? d.hero?.trust ?? "",
          lines: toLines(d.hero?.lines),
          sub: d.hero?.sub ?? "",
          subShort: d.hero?.subShort ?? d.hero?.sub ?? "",
          primaryCta: L(d.hero?.primaryCta),
          secondaryCta: L(d.hero?.secondaryCta),
          checks: arr(d.hero?.checks),
          chips: {
            lead: { title: d.hero?.chips?.lead?.title ?? "", meta: d.hero?.chips?.lead?.meta ?? "" },
            ads: { title: d.hero?.chips?.ads?.title ?? "", meta: d.hero?.chips?.ads?.meta ?? "" },
            brand: { title: d.hero?.chips?.brand?.title ?? "" },
            chart: { title: d.hero?.chips?.chart?.title ?? "" },
          },
        },
        marquee: { ...sec(d.marquee), items: arr(d.marquee?.items) },
        pillars: { ...sec(d.pillars), ...head(d.pillars), linkLabel: d.pillars?.linkLabel ?? "", items: arr(d.pillars?.items).map((p: Raw) => ({ num: p.num ?? "", icon: p.icon ?? "Target", title: p.title ?? "", body: p.body ?? "", points: arr(p.points), href: p.href ?? "" })) },
        stats: { ...sec(d.stats), items: arr(d.stats?.items).map((s: Raw) => ({ value: Number(s.value) || 0, suffix: s.suffix ?? "", label: s.label ?? "" })), manifestoShow: d.stats?.manifestoShow !== false && !!d.stats?.manifesto, manifesto: d.stats?.manifesto ?? "" },
        services: { ...sec(d.services), ...head(d.services) },
        whyUs: { ...sec(d.whyUs), ...head(d.whyUs), cta: L(d.whyUs?.cta), items: arr(d.whyUs?.items).map((i: Raw) => ({ title: i.title ?? "", body: i.body ?? "" })) },
        process: { ...sec(d.process), ...head(d.process), steps: arr(d.process?.steps).map((s: Raw, i: number) => ({ num: s.num ?? String(i + 1).padStart(2, "0"), title: s.title ?? "", time: s.time ?? "", body: s.body ?? "", chips: arr(s.chips) })), cta: L(d.process?.cta) },
        work: { ...sec(d.work), ...head(d.work) },
        testimonials: { ...sec(d.testimonials), ...head(d.testimonials) },
        team: { ...sec(d.team), ...head(d.team) },
        faq: { ...sec(d.faq), ...head(d.faq), cta: L(d.faq?.cta) },
        contact: sec(d.contact),
        seo: seo(d.seo),
      };
    },
    seed.home,
  );

  const pageHero = (d: Raw) => ({ eyebrow: d.eyebrow ?? "", lines: toLines(d.lines), sub: d.sub ?? "" });
  const about = single(
    "About page",
    raw.about,
    (d) => ({
      ...pageHero(d),
      primaryCta: L(d.primaryCta),
      secondaryCta: L(d.secondaryCta),
      story: { show: !!d.story && d.story.show !== false, ...head(d.story), paragraphs: arr(d.story?.paragraphs) },
      mission: { show: !!d.mission && d.mission.show !== false, ...head(d.mission), statement: d.mission?.statement ?? "", values: arr(d.mission?.values).map((v: Raw) => ({ title: v.title ?? "", body: v.body ?? "" })) },
      showStats: d.showStats !== false,
      showTeam: d.showTeam !== false,
      seo: seo(d.seo),
    }),
    seed.about,
  );
  const contact = single(
    "Contact page",
    raw.contact,
    (d) => ({ eyebrow: d.eyebrow ?? "", lines: toLines(d.lines), intro: d.intro ?? "", serviceOptions: arr(d.serviceOptions), budgets: arr(d.budgets), success: { title: d.success?.title ?? "", body: d.success?.body ?? "" }, seo: seo(d.seo) }),
    seed.contact,
  );
  const servicesPage = single(
    "Services overview page",
    raw.servicesPage,
    (d) => ({ ...pageHero(d), primaryCta: L(d.primaryCta), secondaryCta: L(d.secondaryCta), showProcess: d.showProcess !== false, seo: seo(d.seo) }),
    seed.servicesPage,
  );
  const insightsPage = single(
    "Insights index page",
    raw.insightsPage,
    (d) => ({ lines: toLines(d.lines), sub: d.sub ?? "", searchPlaceholder: d.searchPlaceholder ?? "", empty: { title: d.empty?.title ?? "", text: d.empty?.text ?? "" }, seo: seo(d.seo) }),
    seed.insightsPage,
  );
  const notFound = single(
    "404 page",
    raw.notFound,
    (d) => ({ eyebrow: d.eyebrow ?? "404", heading: toRich(d.heading), text: d.text ?? "", primary: L(d.primary), secondary: L(d.secondary) }),
    seed.notFound,
  );
  const legalDoc = (d: Raw) => ({
    title: d.title ?? "",
    updated: d.updated ?? "",
    intro: d.intro ?? "",
    sections: arr(d.sections).map((s: Raw, i: number) => ({
      id: (s.title ?? `section-${i + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: s.title ?? "",
      body: arr(s.body),
    })),
    seo: seo(d.seo),
  });
  const legal = {
    privacy: single("Privacy Policy", raw.privacy, legalDoc, seed.legal.privacy),
    terms: single("Terms of Service", raw.terms, legalDoc, seed.legal.terms),
  };

  // Collections: always what's in Sanity (an empty collection stays empty).
  const faqDocs = arr(raw.faqs) as Raw[];
  const faqFor = (pred: (f: Raw) => boolean): Faq[] => faqDocs.filter(pred).map((f) => ({ q: f.q ?? "", a: f.a ?? "" }));
  const services = arr(raw.services).map((s: Raw) => ({
    slug: s.slug,
    showcase: showcase(s.showcase),
    icon: s.icon ?? "Search",
    title: s.title ?? "",
    tag: s.tag ?? "",
    description: s.description ?? "",
    heroTitle: s.heroTitle ?? s.title ?? "",
    heroAccent: s.heroAccent ?? "",
    sub: s.sub ?? "",
    h1Keyword: s.h1Keyword ?? s.title ?? "",
    definition: { q: s.definition?.q ?? "", a: s.definition?.a ?? "" },
    forWho: arr(s.forWho),
    guide: arr(s.guide).map((g: Raw) => ({ q: g.q ?? "", a: arr(g.a) })),
    comparison: s.comparison?.title && arr(s.comparison.rows).length
      ? { title: s.comparison.title, intro: s.comparison.intro ?? "", head: [0, 1, 2].map((i) => s.comparison.head?.[i] ?? "") as [string, string, string], rows: arr(s.comparison.rows).map((r: Raw) => [0, 1, 2].map((i) => r.cells?.[i] ?? "") as [string, string, string]) }
      : undefined,
    problems: arr(s.problems).map((p: Raw) => ({ icon: p.icon ?? "HelpCircle", title: p.title ?? "", body: p.body ?? "" })),
    included: arr(s.included).map((p: Raw) => ({ title: p.title ?? "", body: p.body ?? "" })),
    deliverables: arr(s.deliverables),
    process: arr(s.process).map((p: Raw) => ({ title: p.title ?? "", body: p.body ?? "" })),
    faqs: faqFor((f) => arr(f.services).includes(s.slug)),
    related: arr(s.related).filter(Boolean),
    note: s.note || undefined,
    extraList: s.extraList?.items?.length ? { title: s.extraList.title ?? "", items: s.extraList.items } : undefined,
    seoTitle: s.seoTitle ?? s.title ?? "",
    seoDescription: s.seoDescription ?? s.description ?? "",
    seo: seo(s.seo),
    updated: s.updated ?? (s._updatedAt ? String(s._updatedAt).slice(0, 10) : ""),
  }));

  if (fallbacks.length) console.warn(`[cms] Using fallback content for: ${fallbacks.join(", ")}`);

  return {
    settings,
    nav,
    home,
    services,
    team: arr(raw.team).map((t: Raw) => ({ name: t.name ?? "", role: t.role ?? "", slug: t.slug ?? "", tint: t.tint ?? "#E7EAEC", photo: t.photo ?? undefined, photoSrc: t.photo ? undefined : t.slug ? `/team/${t.slug}.svg` : undefined, bio: t.bio ?? undefined })),
    testimonials: arr(raw.testimonials).map((t: Raw) => ({ quote: t.quote ?? "", name: t.name ?? "", role: t.service ?? t.business ?? "", business: t.business ?? undefined, rating: t.rating ?? 5, approved: !!t.approved })),
    work: arr(raw.work).map((w: Raw) => ({ category: w.category ?? "", title: w.title ?? "", description: w.description ?? "", gradient: w.gradient ?? "from-accent via-accent-bright to-accent-deep", href: w.href ?? "/services", image: w.image ?? undefined, result: w.result || undefined })),
    faqs: { home: faqFor((f) => arr(f.showOn).includes("home")), contact: faqFor((f) => arr(f.showOn).includes("contact")) },
    about,
    contact,
    servicesPage,
    insightsPage,
    notFound,
    legal,
    redirects: arr(raw.redirects).map((r: Raw) => ({ from: r.from, to: r.to, permanent: r.permanent !== false })),
    fallbacks,
  };
}

/** Fields that are used as values (links, icon names, slugs, colours): never add source markers. */
const NO_STEGA = new Set(["href", "icon", "slug", "gradient", "tint", "num", "_type", "email", "phone", "mapsHref", "ga4Id", "gtmId", "serviceOptions", "budgets", "from", "to", "related", "services", "showOn"]);
const stegaFilter = (props: Parameters<FilterDefault>[0]) => {
  if (props.sourcePath.some((p) => typeof p === "string" && NO_STEGA.has(p))) return false;
  return props.filterDefault(props);
};

async function fetchRaw(preview: boolean): Promise<Raw> {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: preview ? "drafts" : "published",
    token: preview ? readToken : undefined,
    // Visual Editing: invisible source markers in strings, only in preview.
    stega: preview ? { enabled: true, studioUrl: "/studio", filter: stegaFilter } : false,
  });
  return client.fetch<Raw>(QUERY);
}

/** All site content. Static and cached; drafts (uncached) while Draft Mode is on. */
export async function getContent(): Promise<CmsContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("cms");
  const seed = seedContent();
  if (!isSanityConfigured) {
    console.warn("[cms] Sanity is not configured (no NEXT_PUBLIC_SANITY_PROJECT_ID): using the content files.");
    return { ...seed, fallbacks: ["all content (Sanity not configured)"] };
  }
  const { isEnabled: preview } = await draftMode();
  try {
    return build(await fetchRaw(preview && !!readToken), seed);
  } catch (err) {
    console.warn(`[cms] Sanity fetch failed, using the content files: ${(err as Error).message}`);
    return { ...seed, fallbacks: [`all content (fetch failed: ${(err as Error).message})`] };
  }
}
