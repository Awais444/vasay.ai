// One-time setup for the Insights blog in Sanity:
//   - the 9 categories (8 services + Marketing tips), published
//   - a TODO author, as a DRAFT for you to fill in and publish
//   - one example article, as a DRAFT (never published) showing every block type
// Run once after creating the Sanity project:  npm run sanity:seed
// Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_API_WRITE_TOKEN in .env.local.
// Safe to re-run: existing documents are left untouched.
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: "2025-01-01", useCdn: false });

// Category slugs match the service URLs, so each service page shows its articles.
const categories = [
  ["brand-identity", "Brand Identity", "Logos, brand systems and how to look like the business you are."],
  ["website-design", "Website Design & UI/UX", "Designing websites that turn visitors into enquiries."],
  ["web-development", "Custom Web Development", "Fast, reliable sites, bookings, payments and integrations."],
  ["seo", "SEO & Local Search", "Ranking on Google and in the Maps pack, explained plainly."],
  ["social-media", "Social Media & Content", "Content that's consistent, on-brand and actually gets engagement."],
  ["paid-ads", "Paid Ads", "Google, Meta and TikTok ads that are tied to real leads."],
  ["ai-automation", "Lead Gen & AI Automation", "Instant replies, follow-ups and bookings on autopilot."],
  ["cybersecurity", "Cybersecurity & Data Protection", "Keeping your website and customer data safe."],
  ["marketing-tips", "Marketing tips", "Practical, no-jargon marketing advice for growing businesses."],
];

let k = 0;
const key = () => `k${(k++).toString(36)}`;
const span = (text, marks = []) => ({ _type: "span", _key: key(), text, marks });
const block = (style, text) => ({ _type: "block", _key: key(), style, markDefs: [], children: [span(text)] });
const bullet = (text) => ({ ...block("normal", text), listItem: "bullet", level: 1 });

const tx = client.transaction();
for (const [slug, title, description] of categories) {
  tx.createIfNotExists({ _id: `category.${slug}`, _type: "category", title, slug: { _type: "slug", current: slug }, description });
}

// TODO author: a draft, so nothing fake is ever published. Fill it in and publish it in the Studio.
tx.createIfNotExists({
  _id: "drafts.author.todo",
  _type: "author",
  name: "TODO: author name",
  slug: { _type: "slug", current: "todo-author" },
  role: "TODO: role, e.g. Founder",
  bio: "TODO: a 2–3 sentence bio.",
});

// Example article: a draft template only. Replace the content, or delete it.
tx.createIfNotExists({
  _id: "drafts.post.example-template",
  _type: "post",
  title: "Example article (template): replace this before publishing",
  slug: { _type: "slug", current: "example-article-template" },
  excerpt: "A short summary that appears on cards, in search results and under the title. Keep it to one or two sentences.",
  keyTakeaways: ["Key takeaways appear in a box at the top of the article.", "Use 3 to 5 short points.", "Delete this list if you don't need it."],
  category: { _type: "reference", _ref: "category.marketing-tips" },
  author: { _type: "reference", _ref: "author.todo", _weak: true, _strengthenOnPublish: { type: "author" } },
  publishedAt: new Date().toISOString(),
  body: [
    block("normal", "This draft shows every block you can use. It has not been published. Replace the text, add a cover image (with alt text), choose the author, then publish."),
    block("h2", "A section heading (H2)"),
    block("normal", "H2 and H3 headings build the table of contents on the right automatically."),
    block("h3", "A sub-heading (H3)"),
    bullet("Bullet lists work like this."),
    bullet("Add bold, italic, inline code and links from the toolbar."),
    block("blockquote", "Quotes stand out like this."),
    { _type: "callout", _key: key(), tone: "tip", title: "Tip", text: "Callouts come in three tones: tip, info and warning." },
    {
      _type: "table",
      _key: key(),
      caption: "Tables are simple rows of cells.",
      headerRow: true,
      rows: [
        { _type: "row", _key: key(), cells: ["Column A", "Column B"] },
        { _type: "row", _key: key(), cells: ["Value", "Value"] },
      ],
    },
    { _type: "codeBlock", _key: key(), language: "html", code: '<a href="/contact">Book a call</a>' },
    {
      _type: "faqBlock",
      _key: key(),
      title: "Frequently asked questions",
      items: [{ _type: "qa", _key: key(), question: "Does an FAQ block help SEO?", answer: "Yes. FAQ blocks are added to the page's structured data (FAQPage) automatically." }],
    },
    { _type: "ctaBlock", _key: key(), title: "Want this done for you?", text: "Book a free 30-minute strategy call.", buttonLabel: "Book a free strategy call", buttonHref: "/contact" },
  ],
  seo: { _type: "seo", noindex: false },
});

const res = await tx.commit({ visibility: "async" });
console.log(`Done: ${res.results.length} documents checked. Categories are published; the author and example article are drafts.`);
