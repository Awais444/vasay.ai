/**
 * One-time import of ALL current site content (content.ts, services.ts, serviceGuides.ts, legal.ts)
 * into Sanity, so the site looks exactly the same after the switch.
 *
 *   npm run sanity:migrate            -> dry-run summary, asks for confirmation, creates missing docs
 *   npm run sanity:migrate -- --force -> same, but REPLACES existing docs (overwrites editor changes)
 *   npx tsx --tsconfig tsconfig.json scripts/sanity-migrate.ts --offline -> counts only, no connection
 *
 * Needs in .env.local (never commit, never add to Vercel):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN (Editor token)
 */
import { createInterface } from "node:readline/promises";
import { createClient } from "@sanity/client";
import { seedContent } from "../src/cms/seed";
import type { Rich } from "../src/cms/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const force = process.argv.includes("--force");

let n = 0;
const key = () => `m${(n++).toString(36)}`;
const keyed = <T extends object>(arr: T[] = []) => arr.map((x) => ({ _key: key(), ...x }));
/** Rich lines -> one Portable Text block per line, orange words marked "accent". */
const blocks = (lines: Rich[]) =>
  lines.map((line) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: line.map((s) => ({ _type: "span", _key: key(), text: s.text, marks: s.accent ? ["accent"] : [] })),
  }));
const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });
const head = (h: { eyebrow: string; title: Rich; intro?: string }) => ({ eyebrow: h.eyebrow, title: blocks([h.title]), ...(h.intro ? { intro: h.intro } : {}) });

function buildDocuments() {
  const c = seedContent();
  const docs: Record<string, unknown>[] = [];
  const add = (d: Record<string, unknown>) => docs.push(d);
  const s = c.settings;

  add({
    _id: "siteSettings", _type: "siteSettings",
    name: s.name, legalName: s.legalName, tagline: s.tagline, description: s.description, phone: s.phone, email: s.email,
    address: { street: s.address.street, city: s.address.city, region: s.address.region, postalCode: s.address.postalCode, country: s.address.country },
    mapsHref: s.mapsHref, hours: s.hours, copyright: s.copyright, socials: keyed(s.socials),
    defaultSeo: { description: s.defaultSeo.description }, status: s.status, announcement: s.announcement,
  });
  add({ _id: "navigation", _type: "navigation", links: keyed(c.nav.links), mobileExtra: keyed(c.nav.mobileExtra), footer: keyed(c.nav.footer), cta: c.nav.cta, promo: c.nav.promo });

  const h = c.home;
  add({
    _id: "homePage", _type: "homePage",
    hero: { ...h.hero, lines: blocks(h.hero.lines) },
    marquee: h.marquee,
    pillars: { show: h.pillars.show, ...head(h.pillars), linkLabel: h.pillars.linkLabel, items: keyed(h.pillars.items) },
    stats: { show: h.stats.show, items: keyed(h.stats.items), manifestoShow: h.stats.manifestoShow, manifesto: h.stats.manifesto },
    services: { show: true, ...head(h.services) },
    whyUs: { show: true, ...head(h.whyUs), cta: h.whyUs.cta, items: keyed(h.whyUs.items) },
    process: { show: true, ...head(h.process), steps: keyed(h.process.steps), cta: h.process.cta },
    work: { show: true, ...head(h.work) },
    testimonials: { show: true, ...head(h.testimonials) },
    team: { show: true, ...head(h.team) },
    faq: { show: true, ...head(h.faq), cta: h.faq.cta },
    contact: { show: true },
  });

  const a = c.about;
  add({
    _id: "aboutPage", _type: "aboutPage",
    eyebrow: a.eyebrow, lines: blocks(a.lines), sub: a.sub, primaryCta: a.primaryCta, secondaryCta: a.secondaryCta,
    story: { show: true, ...head(a.story), paragraphs: a.story.paragraphs },
    mission: { show: true, ...head(a.mission), statement: a.mission.statement, values: keyed(a.mission.values) },
    showStats: true, showTeam: true,
  });
  const ct = c.contact;
  add({ _id: "contactPage", _type: "contactPage", eyebrow: ct.eyebrow, lines: blocks(ct.lines), intro: ct.intro, serviceOptions: ct.serviceOptions, budgets: ct.budgets, success: ct.success });
  const sp = c.servicesPage;
  add({ _id: "servicesPage", _type: "servicesPage", eyebrow: sp.eyebrow, lines: blocks(sp.lines), sub: sp.sub, primaryCta: sp.primaryCta, secondaryCta: sp.secondaryCta, showProcess: true });
  const ip = c.insightsPage;
  add({ _id: "insightsPage", _type: "insightsPage", lines: blocks(ip.lines), sub: ip.sub, searchPlaceholder: ip.searchPlaceholder, empty: ip.empty });
  const nf = c.notFound;
  add({ _id: "notFoundPage", _type: "notFoundPage", eyebrow: nf.eyebrow, heading: blocks([nf.heading]), text: nf.text, primary: nf.primary, secondary: nf.secondary });
  for (const [id, d] of [["legal-privacy", c.legal.privacy], ["legal-terms", c.legal.terms]] as const) {
    add({ _id: id, _type: "legalPage", title: d.title, updated: d.updated, intro: d.intro, sections: d.sections.map((x) => ({ _key: key(), title: x.title, body: x.body })) });
  }

  c.services.forEach((sv, i) => {
    add({
      _id: `service-${sv.slug}`, _type: "service", order: i + 1,
      title: sv.title, slug: { _type: "slug", current: sv.slug }, icon: sv.icon, tag: sv.tag, description: sv.description,
      h1Keyword: sv.h1Keyword, heroTitle: sv.heroTitle, heroAccent: sv.heroAccent, sub: sv.sub,
      problems: keyed(sv.problems), included: keyed(sv.included), deliverables: sv.deliverables, process: keyed(sv.process),
      ...(sv.note ? { note: sv.note } : {}), ...(sv.extraList ? { extraList: sv.extraList } : {}),
      related: sv.related.map((r) => ref(`service-${r}`)),
      definition: sv.definition, forWho: sv.forWho, guide: keyed(sv.guide),
      ...(sv.comparison ? { comparison: { title: sv.comparison.title, intro: sv.comparison.intro, head: sv.comparison.head, rows: sv.comparison.rows.map((cells) => ({ _key: key(), cells })) } } : {}),
      updated: sv.updated, seoTitle: sv.seoTitle, seoDescription: sv.seoDescription,
    });
    sv.faqs.forEach((f, j) => add({ _id: `faq-${sv.slug}-${j + 1}`, _type: "faq", q: f.q, a: f.a, services: [ref(`service-${sv.slug}`)], order: j + 1 }));
  });
  c.faqs.home.forEach((f, j) => add({ _id: `faq-general-${j + 1}`, _type: "faq", q: f.q, a: f.a, showOn: ["home", "contact"], order: j + 1 }));
  c.team.forEach((t, i) => add({ _id: `team-${t.slug}`, _type: "teamMember", name: t.name, role: t.role, slug: { _type: "slug", current: t.slug }, tint: t.tint, order: i + 1, show: true }));
  c.testimonials.forEach((t, i) => add({ _id: `testimonial-${i + 1}`, _type: "testimonial", quote: t.quote, name: t.name, service: t.role, rating: 5, approved: t.approved, order: i + 1 }));
  c.work.forEach((w, i) => add({ _id: `work-${i + 1}`, _type: "workItem", title: w.title, category: w.category, description: w.description, gradient: w.gradient, href: w.href, order: i + 1, ...(w.result ? { result: w.result } : {}) }));
  c.redirects.forEach((r, i) => add({ _id: `redirect-${i + 1}`, _type: "redirect", ...r }));
  return docs;
}

async function main() {
  // --offline: build every document and print the counts, without connecting to Sanity.
  if (process.argv.includes("--offline")) {
    const counts: Record<string, number> = {};
    for (const d of buildDocuments()) counts[d._type as string] = (counts[d._type as string] ?? 0) + 1;
    console.log(counts);
    return;
  }
  if (!projectId || !token) {
    console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local");
    process.exit(1);
  }
  const docs = buildDocuments();
  const client = createClient({ projectId, dataset, token, apiVersion: "2025-01-01", useCdn: false });
  const existing = new Set<string>(await client.fetch("*[_id in $ids]._id", { ids: docs.map((d) => d._id) }));

  const byType: Record<string, { create: number; skip: number; replace: number }> = {};
  for (const d of docs) {
    const t = (byType[d._type as string] ??= { create: 0, skip: 0, replace: 0 });
    if (!existing.has(d._id as string)) t.create++;
    else if (force) t.replace++;
    else t.skip++;
  }
  console.log(`\nDRY RUN: project ${projectId}, dataset "${dataset}"${force ? ", --force (existing documents will be REPLACED)" : ""}\n`);
  console.log("type".padEnd(16), "create".padStart(7), force ? "replace".padStart(8) : "skip (exists)".padStart(14));
  for (const [t, v] of Object.entries(byType)) console.log(t.padEnd(16), String(v.create).padStart(7), String(force ? v.replace : v.skip).padStart(force ? 8 : 14));
  const total = Object.values(byType).reduce((s, v) => s + v.create + (force ? v.replace : 0), 0);
  console.log(`\n${total} document(s) will be written. Everything is published immediately.`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question('Type "yes" to continue: ')).trim().toLowerCase();
  rl.close();
  if (answer !== "yes") {
    console.log("Cancelled. Nothing was written.");
    return;
  }

  const tx = client.transaction();
  for (const d of docs) {
    if (force) tx.createOrReplace(d as { _id: string; _type: string });
    else tx.createIfNotExists(d as { _id: string; _type: string });
  }
  await tx.commit({ visibility: "async" });
  console.log(`\nDone. ${total} document(s) written.\n`);
  console.log(`Check in the Studio (/studio):
  [ ] Site settings: phone, email, address, socials look right
  [ ] Navigation: 6 navbar links, footer links, promo card
  [ ] Pages > Home: hero headline shows "growth." in orange (Orange mark), all sections switched on
  [ ] Pages > About, Contact, Services overview, Insights index, 404, Privacy, Terms: filled in
  [ ] Services: 8 services in order, each with problems, included, process, guide and related services
  [ ] FAQs: general FAQs (Homepage + Contact) and each service's FAQs
  [ ] Team (5), Testimonials (10, none approved), Work (6), Redirects (2)
  [ ] Open the site: it should look exactly the same as before
  [ ] Then delete SANITY_API_WRITE_TOKEN from .env.local (or revoke it in sanity.io/manage)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
