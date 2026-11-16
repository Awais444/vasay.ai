import { defineArrayMember, defineField, defineType, type FieldDefinition } from "sanity";
import { accentText, imageField, link, PILLAR_ICONS, PROBLEM_ICONS, sectionHead, seoField, SERVICE_ICONS, show, str, stringList } from "./fields";
import { SHOWCASE_ICONS, SHOWCASE_VISUALS } from "../../cms/showcase-options";

const groups = [
  { name: "content", title: "Content", default: true },
  { name: "seo", title: "SEO" },
];

/* ============================== Singletons ============================== */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "business", title: "Business", default: true },
    { name: "seo", title: "Default SEO" },
    { name: "ui", title: "Pill & announcement" },
    { name: "analytics", title: "Analytics" },
  ],
  fields: [
    str("name", "Brand name", { required: true, max: 40 }),
    str("legalName", "Legal name", { required: true, max: 60 }),
    str("tagline", "Tagline", { max: 80 }),
    str("description", "Short description", { rows: 3, max: 220, description: "Used in structured data, llms.txt and as the default meta description." }),
    str("phone", "Phone (as displayed)", { required: true, max: 20, description: "e.g. (437) 564-0199. Links and structured data are generated from it." }),
    defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.required().email() }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      options: { columns: 2 },
      fields: [
        str("street", "Street", { required: true }),
        str("city", "City", { required: true }),
        str("region", "Province", { required: true }),
        str("postalCode", "Postal code", { required: true }),
        defineField({ name: "country", title: "Country code", type: "string", initialValue: "CA" }),
      ],
    }),
    defineField({ name: "mapsHref", title: "Google Maps link", type: "url" }),
    str("hours", "Business hours", { max: 60 }),
    str("copyright", "Footer copyright line", { max: 80 }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      description: "Use the full profile URL. Placeholder homepages (e.g. https://instagram.com/) are left out of structured data.",
      of: [defineArrayMember({ type: "object", fields: [str("label", "Platform", { required: true, max: 20 }), defineField({ name: "href", title: "URL", type: "url", validation: (r) => r.required() })] })],
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "object",
      group: "seo",
      fields: [
        str("titleTemplate", "Title template", { max: 60, description: 'e.g. "%s | Smart Solutions". Pages with their own meta title use it as-is.' }),
        str("description", "Default meta description", { rows: 2, max: 160 }),
        imageField("ogImage", "Default social share image", "1200×630. Pages without their own image use the generated branded card."),
      ],
    }),
    defineField({
      name: "status",
      title: '"Taking new clients" pill',
      type: "object",
      group: "ui",
      fields: [defineField({ name: "show", type: "boolean", initialValue: true }), str("text", "Text", { max: 28 })],
    }),
    defineField({
      name: "announcement",
      title: "Announcement bar (optional)",
      type: "object",
      group: "ui",
      fields: [defineField({ name: "show", type: "boolean", initialValue: false }), str("text", "Text", { max: 90 }), defineField({ name: "href", title: "Link (optional)", type: "string" })],
    }),
    str("ga4Id", "GA4 measurement ID", { max: 20, description: "G-XXXXXXX. Overrides the env var. Loaded on production only." }),
    defineField({ ...str("gtmId", "Google Tag Manager ID", { max: 20, description: "GTM-XXXXXXX" }), group: "analytics" }),
  ].map((f) => {
    const field = f as FieldDefinition & { group?: string };
    if (field.name === "ga4Id") return { ...field, group: "analytics" };
    return field.group ? field : { ...field, group: "business" };
  }) as FieldDefinition[],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "links",
      title: "Navbar links (in order)",
      type: "array",
      of: [defineArrayMember({ type: "object", fields: [str("label", "Label", { required: true, max: 18 }), defineField({ name: "href", title: "Link", type: "string", validation: (r) => r.required() }), defineField({ name: "mega", title: "Opens the services mega menu", type: "boolean" })], preview: { select: { title: "label", subtitle: "href" } } })],
      validation: (r) => r.max(7),
    }),
    defineField({ name: "mobileExtra", title: "Extra links in the mobile menu", type: "array", of: [defineArrayMember({ type: "object", fields: [str("label", "Label", { max: 18 }), defineField({ name: "href", type: "string" })] })] }),
    link("cta", "Navbar button", true),
    defineField({
      name: "promo",
      title: "Mega menu promo card",
      type: "object",
      fields: [str("pill", "Pill", { max: 20 }), str("title", "Title", { max: 40 }), str("cta", "Link text", { max: 40 }), defineField({ name: "href", title: "Link", type: "string" })],
    }),
    defineField({ name: "footer", title: "Footer: Company column links", type: "array", of: [defineArrayMember({ type: "object", fields: [str("label", "Label", { max: 30 }), defineField({ name: "href", type: "string" })], preview: { select: { title: "label", subtitle: "href" } } })] }),
  ],
  preview: { prepare: () => ({ title: "Navigation" }) },
});

const sectionObject = (name: string, title: string, fields: FieldDefinition[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: true }, fields: [show(), ...fields] }) as FieldDefinition;

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups,
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "content",
      options: { collapsible: true },
      fields: [
        show(),
        str("badge", "Pill badge", { max: 10 }),
        str("trust", "Pill text", { max: 70 }),
        str("trustShort", "Pill text on phones", { max: 34 }),
        accentText("lines", "Headline (H1)", { lines: 3, maxPerLine: 22, required: true }),
        str("sub", "Sub copy", { rows: 3, max: 200 }),
        str("subShort", "Sub copy on phones", { rows: 2, max: 110 }),
        link("primaryCta", "Primary button"),
        link("secondaryCta", "Secondary button"),
        stringList("checks", "Trust points", 3, 28),
        defineField({
          name: "chips",
          title: "Floating chips (desktop)",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({ name: "lead", type: "object", fields: [str("title", "Title", { max: 20 }), str("meta", "Meta", { max: 20 })] }),
            defineField({ name: "ads", type: "object", fields: [str("title", "Title", { max: 20 }), str("meta", "Meta", { max: 20 })] }),
            defineField({ name: "brand", type: "object", fields: [str("title", "Title", { max: 22 })] }),
            defineField({ name: "chart", type: "object", fields: [str("title", "Title", { max: 22 })] }),
          ],
        }),
      ],
    }),
    sectionObject("marquee", "Services marquee", [stringList("items", "Words", 14, 24)]),
    sectionObject("pillars", "Three pillars", [
      ...sectionHead({ intro: true }),
      str("linkLabel", "Link text", { max: 20 }),
      defineField({
        name: "items",
        title: "Pillars",
        type: "array",
        validation: (r) => r.max(3),
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              str("num", "Number", { max: 3 }),
              defineField({ name: "icon", type: "string", options: { list: PILLAR_ICONS } }),
              str("title", "Title", { required: true, max: 20 }),
              str("body", "Text", { rows: 2, max: 90 }),
              stringList("points", "Bullets", 4, 30),
              defineField({ name: "href", title: "Link", type: "string" }),
            ],
            preview: { select: { title: "title", subtitle: "body" } },
          }),
        ],
      }),
    ]),
    sectionObject("stats", "Stats + manifesto", [
      defineField({
        name: "items",
        title: "Stats",
        type: "array",
        validation: (r) => r.max(3),
        of: [defineArrayMember({ type: "object", fields: [defineField({ name: "value", type: "number", validation: (r) => r.required() }), str("suffix", "Suffix", { max: 3 }), str("label", "Label", { max: 30 })], preview: { select: { title: "label", subtitle: "value" } } })],
      }),
      defineField({ name: "manifestoShow", title: "Show manifesto", type: "boolean", initialValue: true }),
      str("manifesto", "Manifesto text", { rows: 4, max: 420 }),
    ]),
    sectionObject("services", "Services list (heading)", sectionHead({ intro: true })),
    sectionObject("whyUs", "Why us", [
      ...sectionHead({ intro: true }),
      link("cta", "Button"),
      defineField({ name: "items", title: "Cards", type: "array", validation: (r) => r.max(4), of: [defineArrayMember({ type: "object", fields: [str("title", "Title", { required: true, max: 40 }), str("body", "Text", { rows: 2, max: 140 })], preview: { select: { title: "title" } } })] }),
    ]),
    sectionObject("process", "Process", [
      ...sectionHead(),
      defineField({
        name: "steps",
        title: "Steps",
        type: "array",
        validation: (r) => r.max(4),
        description: "Up to 4 (each panel has its own colour).",
        of: [
          defineArrayMember({
            type: "object",
            fields: [str("num", "Number", { max: 3 }), str("title", "Title", { required: true, max: 18 }), str("time", "Time label", { max: 16 }), str("body", "Description", { rows: 3, max: 180 }), stringList("chips", "Chips", 3, 18)],
            preview: { select: { title: "title", subtitle: "time" } },
          }),
        ],
      }),
      link("cta", "Button"),
    ]),
    sectionObject("work", "Work (heading)", sectionHead()),
    sectionObject("testimonials", "Testimonials (heading)", sectionHead()),
    sectionObject("team", "Team (heading)", sectionHead()),
    sectionObject("faq", "FAQ (heading)", [...sectionHead({ intro: true }), link("cta", "Button")]),
    sectionObject("contact", "Contact section", []),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  groups,
  fields: [
    defineField({ ...str("eyebrow", "Hero pill", { max: 40 }), group: "content" }),
    defineField({ ...accentText("lines", "Hero headline (H1)", { lines: 2, maxPerLine: 28, required: true }), group: "content" }),
    defineField({ ...str("sub", "Hero text", { rows: 3, max: 200 }), group: "content" }),
    defineField({ ...link("primaryCta", "Hero primary button"), group: "content" }),
    defineField({ ...link("secondaryCta", "Hero secondary button"), group: "content" }),
    defineField({ ...sectionObject("story", "Our story", [...sectionHead(), stringList("paragraphs", "Paragraphs")]), group: "content" }),
    defineField({
      ...sectionObject("mission", "Mission & values", [
        ...sectionHead(),
        str("statement", "Mission statement", { rows: 3, max: 220 }),
        defineField({ name: "values", type: "array", validation: (r) => r.max(4), of: [defineArrayMember({ type: "object", fields: [str("title", "Title", { max: 40 }), str("body", "Text", { rows: 2, max: 140 })], preview: { select: { title: "title" } } })] }),
      ]),
      group: "content",
    }),
    defineField({ name: "showStats", title: "Show stats", type: "boolean", initialValue: true, group: "content" }),
    defineField({ name: "showTeam", title: "Show team", type: "boolean", initialValue: true, group: "content" }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page & form",
  type: "document",
  groups,
  fields: [
    defineField({ ...str("eyebrow", "Eyebrow", { max: 30 }), group: "content" }),
    defineField({ ...accentText("lines", "Heading", { lines: 3, maxPerLine: 16, required: true }), group: "content" }),
    defineField({ ...str("intro", "Intro", { rows: 3, max: 200 }), group: "content" }),
    defineField({ ...stringList("serviceOptions", "Form: service options", 14, 40), group: "content" }),
    defineField({ ...stringList("budgets", "Form: budget options", 8, 20), group: "content" }),
    defineField({ name: "success", title: "Success message", type: "object", group: "content", fields: [str("title", "Title", { max: 30 }), str("body", "Text", { rows: 2, max: 140 })] }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Contact page & form" }) },
});

const simplePageHero = [
  defineField({ ...str("eyebrow", "Hero pill", { max: 30 }), group: "content" }),
  defineField({ ...accentText("lines", "Hero headline (H1)", { lines: 2, maxPerLine: 34, required: true }), group: "content" }),
  defineField({ ...str("sub", "Hero text", { rows: 3, max: 220 }), group: "content" }),
];

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services overview page",
  type: "document",
  groups,
  fields: [
    ...simplePageHero,
    defineField({ ...link("primaryCta", "Primary button"), group: "content" }),
    defineField({ ...link("secondaryCta", "Secondary button"), group: "content" }),
    defineField({ name: "showProcess", title: "Show the process section", type: "boolean", initialValue: true, group: "content" }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Services overview page" }) },
});

export const insightsPage = defineType({
  name: "insightsPage",
  title: "Insights index page",
  type: "document",
  groups,
  fields: [
    defineField({ ...accentText("lines", "Hero headline (H1)", { lines: 2, maxPerLine: 34, required: true }), group: "content" }),
    defineField({ ...str("sub", "Hero text", { rows: 2, max: 160 }), group: "content" }),
    defineField({ ...str("searchPlaceholder", "Search placeholder", { max: 40 }), group: "content" }),
    defineField({ name: "empty", title: "Empty state (no articles yet)", type: "object", group: "content", fields: [str("title", "Title", { max: 40 }), str("text", "Text", { rows: 2, max: 180 })] }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Insights index page" }) },
});

export const notFoundPage = defineType({
  name: "notFoundPage",
  title: "404 page",
  type: "document",
  fields: [
    str("eyebrow", "Big number text", { max: 6, description: "Usually 404" }),
    accentText("heading", "Heading", { maxPerLine: 40, required: true }),
    str("text", "Text", { rows: 2, max: 140 }),
    link("primary", "Primary button"),
    link("secondary", "Secondary button"),
  ],
  preview: { prepare: () => ({ title: "404 page" }) },
});

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  groups,
  fields: [
    defineField({ ...str("title", "Title", { required: true, max: 40 }), group: "content" }),
    defineField({ ...str("updated", "Last updated (as shown)", { max: 30, description: "e.g. November 13, 2026" }), group: "content" }),
    defineField({ ...str("intro", "Intro", { rows: 3 }), group: "content" }),
    defineField({
      name: "sections",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            str("title", "Section title", { required: true, max: 60 }),
            defineField({ name: "body", type: "array", of: [defineArrayMember({ type: "block", styles: [{ title: "Normal", value: "normal" }], lists: [{ title: "Bullet", value: "bullet" }] })] }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    seoField,
  ],
  preview: { select: { title: "title" } },
});

/* ============================== Collections ============================== */

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  groups: [
    { name: "content", title: "Page", default: true },
    { name: "guide", title: "Guide & FAQ" },
    { name: "seo", title: "SEO" },
  ],
  orderings: [{ title: "Menu order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    defineField({ name: "order", title: "Order in menus", type: "number", group: "content" }),
    defineField({ ...str("title", "Title", { required: true, max: 40 }), group: "content" }),
    defineField({ name: "slug", type: "slug", group: "content", options: { source: "title" }, validation: (r) => r.required(), description: "The page URL: /services/<slug>. Changing it changes the URL (add a redirect)." }),
    defineField({ name: "icon", type: "string", group: "content", options: { list: SERVICE_ICONS }, validation: (r) => r.required() }),
    defineField({ ...str("tag", "Tagline", { max: 30 }), group: "content" }),
    defineField({ ...str("description", "Card description", { rows: 2, max: 160 }), group: "content" }),
    defineField({ ...str("h1Keyword", "H1 keyword line (pill above the headline)", { max: 70 }), group: "content" }),
    defineField({ ...str("heroTitle", "Hero headline", { max: 40 }), group: "content" }),
    defineField({ ...str("heroAccent", "Hero headline: orange part", { max: 24 }), group: "content" }),
    defineField({ ...str("sub", "Hero text", { rows: 3, max: 240 }), group: "content" }),
    defineField({
      name: "showcase",
      title: "System showcase (optional)",
      description: "Interactive app window shown right after the hero. Leave the list empty to hide it.",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      fields: [
        str("eyebrow", "Eyebrow", { max: 30 }),
        str("title", "Headline", { max: 40 }),
        str("accent", "Headline: orange part", { max: 40 }),
        str("sub", "Text under the headline", { rows: 2, max: 160 }),
        str("cta", "Panel button (scrolls to What's included)", { max: 32 }),
        defineField({
          name: "items",
          title: "Automations",
          type: "array",
          validation: (r) => r.max(8),
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                str("name", "Name", { required: true, max: 32 }),
                defineField({ name: "icon", type: "string", options: { list: [...SHOWCASE_ICONS] }, validation: (r) => r.required() }),
                defineField({ name: "visual", title: "Visual", type: "string", options: { list: [...SHOWCASE_VISUALS] }, validation: (r) => r.required() }),
                str("tag", "Pill tag", { max: 28 }),
                str("description", "One-sentence description", { rows: 2, max: 140 }),
                stringList("miniTags", "Mini tags", 3, 20),
                stringList("bullets", "What it does", 4, 50),
                stringList("connects", "Connects with", 5, 26),
                defineField({ ...stringList("activity", "Activity lines (3)", 3, 48), description: 'e.g. "> form: new enquiry received". The last line ends with ✓.' }),
                stringList("steps", "Steps (e.g. CAPTURE, REPLY, BOOK, REMIND)", 5, 12),
              ],
              preview: { select: { title: "name", subtitle: "tag" } },
            }),
          ],
        }),
      ],
    }),
    defineField({ name: "problems", type: "array", group: "content", validation: (r) => r.max(3), of: [defineArrayMember({ type: "object", fields: [defineField({ name: "icon", type: "string", options: { list: PROBLEM_ICONS } }), str("title", "Title", { required: true, max: 40 }), str("body", "Text", { rows: 2, max: 140 })], preview: { select: { title: "title" } } })] }),
    defineField({ name: "included", title: "What's included", type: "array", group: "content", of: [defineArrayMember({ type: "object", fields: [str("title", "Title", { required: true, max: 40 }), str("body", "Text", { rows: 2, max: 140 })], preview: { select: { title: "title" } } })] }),
    defineField({ ...stringList("deliverables", "Deliverables"), group: "content" }),
    defineField({ name: "process", type: "array", group: "content", validation: (r) => r.max(6), of: [defineArrayMember({ type: "object", fields: [str("title", "Title", { required: true, max: 30 }), str("body", "Text", { rows: 2, max: 160 })], preview: { select: { title: "title" } } })] }),
    defineField({ ...str("note", "Note under deliverables (optional)", { rows: 2 }), group: "content" }),
    defineField({ name: "extraList", title: "Extra list (optional)", type: "object", group: "content", fields: [str("title", "Title", { max: 40 }), stringList("items", "Items")] }),
    defineField({ name: "related", title: "Related services", type: "array", group: "content", validation: (r) => r.max(3), of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })] }),
    defineField({ name: "definition", title: '"What is X?" answer', type: "object", group: "guide", fields: [str("q", "Question", { max: 60 }), str("a", "Answer (1–2 plain sentences)", { rows: 3, max: 360 })] }),
    defineField({ ...stringList("forWho", "Who it's for", 5, 120), group: "guide" }),
    defineField({ name: "guide", title: "Question-led sections", type: "array", group: "guide", description: "Start each answer with a direct 40–60 word answer. Links: [text](/path).", of: [defineArrayMember({ type: "object", fields: [str("q", "Question (H2)", { required: true, max: 80 }), stringList("a", "Paragraphs")], preview: { select: { title: "q" } } })] }),
    defineField({
      name: "comparison",
      title: "Comparison table (optional)",
      type: "object",
      group: "guide",
      fields: [
        str("title", "Title", { max: 70 }),
        str("intro", "Intro", { rows: 2 }),
        stringList("head", "Column headings (3: first can be empty)", 3),
        defineField({ name: "rows", type: "array", of: [defineArrayMember({ type: "object", fields: [stringList("cells", "Cells (3)", 3)], preview: { select: { cells: "cells" }, prepare: ({ cells }) => ({ title: (cells ?? []).join(" · ") }) } })] }),
      ],
    }),
    defineField({ name: "updated", title: "Last updated", type: "date", group: "guide", description: "Shown on the page and used as dateModified." }),
    defineField({ ...str("seoTitle", "Meta title", { max: 60 }), group: "seo" }),
    defineField({ ...str("seoDescription", "Meta description", { rows: 2, max: 160 }), group: "seo" }),
    seoField,
  ],
  preview: { select: { title: "title", subtitle: "tag" } },
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    str("name", "Name", { required: true, max: 40 }),
    str("role", "Role", { max: 40 }),
    imageField("photo", "Photo", "Portrait, at least 800px tall. Without a photo, the illustrated avatar is used."),
    str("bio", "Bio", { rows: 3, max: 300 }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "show", title: "Show on the site", type: "boolean", initialValue: true }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, hidden: true }),
    defineField({ name: "tint", title: "Card colour", type: "string", initialValue: "#E7EAEC", description: "Background behind the photo, e.g. #DCE2FF" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    str("quote", "Quote", { required: true, rows: 3, max: 220 }),
    str("name", "Client name", { required: true, max: 40 }),
    str("business", "Business", { max: 40 }),
    str("service", "Service (shown after the name)", { max: 40 }),
    defineField({ name: "rating", type: "number", initialValue: 5, validation: (r) => r.min(1).max(5) }),
    defineField({ name: "approved", title: "Approved by the client", type: "boolean", initialValue: false, description: "Only approved testimonials appear on vasay.ai (and only once 3 are approved)." }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "name", subtitle: "quote", approved: "approved" }, prepare: ({ title, subtitle, approved }) => ({ title: `${approved ? "✓" : "○"} ${title}`, subtitle }) },
});

export const workItem = defineType({
  name: "workItem",
  title: "Work item",
  type: "document",
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    str("title", "Title", { required: true, max: 60 }),
    str("category", "Category", { required: true, max: 24 }),
    imageField("image", "Cover image", "4:3, at least 1200px wide. Without an image, a brand gradient is used."),
    str("description", "Short description", { rows: 2, max: 120 }),
    str("result", "Result (optional, only real verified numbers)", { max: 60 }),
    defineField({ name: "href", title: "Link", type: "string", initialValue: "/services" }),
    defineField({
      name: "gradient",
      title: "Fallback gradient",
      type: "string",
      options: {
        list: [
          { title: "Klein → Blue", value: "from-accent via-accent-bright to-accent-deep" },
          { title: "Orange → Red → Deep", value: "from-brand-orange via-brand-red to-accent-deep" },
          { title: "Deep → Klein → Orange", value: "from-accent-deep via-accent to-brand-orange" },
          { title: "Black → Deep → Klein", value: "from-brand-black via-accent-deep to-accent" },
          { title: "Blue → Klein → Black", value: "from-accent-bright via-accent to-brand-black" },
          { title: "Red → Orange → Peach", value: "from-brand-red via-brand-orange to-[#FFB37A]" },
        ],
      },
    }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "title", subtitle: "category", media: "image" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    str("q", "Question", { required: true, max: 120 }),
    str("a", "Answer", { required: true, rows: 4, max: 600, description: "Links: [text](/path)." }),
    defineField({
      name: "showOn",
      title: "Where to show",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: [{ title: "Homepage", value: "home" }, { title: "Contact page", value: "contact" }], layout: "grid" },
    }),
    defineField({ name: "services", title: "Show on these service pages", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })] }),
    defineField({ name: "order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "q", subtitle: "a" } },
});

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  description: "Applied on the next deploy (publishing triggers one automatically).",
  fields: [
    defineField({ name: "from", type: "string", validation: (r) => r.required().custom((v) => (typeof v === "string" && v.startsWith("/") ? true : "Must start with /")) }),
    defineField({ name: "to", type: "string", validation: (r) => r.required() }),
    defineField({ name: "permanent", title: "Permanent (301)", type: "boolean", initialValue: true }),
  ],
  preview: { select: { from: "from", to: "to" }, prepare: ({ from, to }) => ({ title: `${from} → ${to}` }) },
});

export const siteSchemaTypes = [
  siteSettings, navigation, homePage, aboutPage, contactPage, servicesPage, insightsPage, notFoundPage, legalPage,
  service, teamMember, testimonial, workItem, faq, redirect,
];

/** Singleton documents: type → fixed document ID (legal pages are two documents of one type). */
export const SINGLETONS = [
  { id: "siteSettings", type: "siteSettings", title: "Site settings" },
  { id: "navigation", type: "navigation", title: "Navigation" },
  { id: "homePage", type: "homePage", title: "Home" },
  { id: "aboutPage", type: "aboutPage", title: "About" },
  { id: "contactPage", type: "contactPage", title: "Contact" },
  { id: "servicesPage", type: "servicesPage", title: "Services overview" },
  { id: "insightsPage", type: "insightsPage", title: "Insights index" },
  { id: "notFoundPage", type: "notFoundPage", title: "404 page" },
  { id: "legal-privacy", type: "legalPage", title: "Privacy Policy" },
  { id: "legal-terms", type: "legalPage", title: "Terms of Service" },
] as const;
