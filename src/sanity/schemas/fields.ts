import { defineArrayMember, defineField, type FieldDefinition, type Rule } from "sanity";

/** lucide icon names editors can pick (each must be mapped in the matching React component). */
export const SERVICE_ICONS = ["Palette", "LayoutTemplate", "Code2", "Search", "Share2", "Megaphone", "Bot", "ShieldCheck"];
export const PROBLEM_ICONS = [
  "History", "Copy", "Shuffle", "Smartphone", "MousePointerClick", "Signpost", "Timer", "Puzzle", "Wrench", "TrendingDown",
  "MapPinOff", "Filter", "CalendarX", "Clock", "HeartCrack", "Flame", "MousePointer2", "HelpCircle", "Snowflake", "BellOff",
  "CalendarX2", "Bug", "DatabaseBackup", "ShieldAlert",
];
export const PILLAR_ICONS = ["Target", "MonitorSmartphone", "Zap"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const max = (n: number) => (r: any) => r.max(n).warning(`Keep it under ${n} characters so it fits the design.`);

/** Plain string with a hard limit that protects the layout. */
export const str = (name: string, title: string, opts: { max?: number; required?: boolean; description?: string; rows?: number } = {}) =>
  defineField({
    name,
    title,
    type: opts.rows ? "text" : "string",
    rows: opts.rows,
    description: opts.description,
    validation: (r: Rule) => {
      let v = r;
      if (opts.required) v = v.required();
      if (opts.max) v = v.max(opts.max).error(`Max ${opts.max} characters (protects the layout).`);
      return v;
    },
  } as FieldDefinition) as FieldDefinition;

/**
 * Heading with orange words. Each line is one paragraph; select words and click "Orange" to mark them.
 * `lines` = how many lines are allowed (hero H1: 3).
 */
export const accentText = (name: string, title: string, opts: { lines?: number; maxPerLine?: number; required?: boolean; description?: string } = {}) =>
  defineField({
    name,
    title,
    type: "array",
    description:
      (opts.description ? opts.description + " " : "") +
      `Select words and click the "Orange" button to colour them.${opts.lines && opts.lines > 1 ? ` One line per paragraph (max ${opts.lines}).` : ""}`,
    of: [
      defineArrayMember({
        type: "block",
        styles: [{ title: "Normal", value: "normal" }],
        lists: [],
        marks: { decorators: [{ title: "Orange", value: "accent" }], annotations: [] },
      }),
    ],
    validation: (r) =>
      r.custom((blocks: { children?: { text?: string }[] }[] | undefined) => {
        if (!blocks?.length) return opts.required ? "Required" : true;
        if (blocks.length > (opts.lines ?? 1)) return `Max ${opts.lines ?? 1} line(s).`;
        if (opts.maxPerLine) {
          const long = blocks.find((b) => (b.children ?? []).map((c) => c.text ?? "").join("").length > opts.maxPerLine!);
          if (long) return `Each line max ${opts.maxPerLine} characters (protects the layout).`;
        }
        return true;
      }),
  }) as FieldDefinition;

export const link = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: "object",
    options: { columns: 2 },
    fields: [
      defineField({ name: "label", type: "string", validation: (r) => (required ? r.required().max(40) : r.max(40)) }),
      defineField({ name: "href", title: "Link", type: "string", description: "/page, /#section or https://…", validation: (r) => (required ? r.required() : r) }),
    ],
  }) as FieldDefinition;

export const show = (title = "Show this section") => defineField({ name: "show", title, type: "boolean", initialValue: true }) as FieldDefinition;

export const stringList = (name: string, title: string, maxItems?: number, maxLen?: number) =>
  defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "string", validation: maxLen ? max(maxLen) : undefined })],
    validation: maxItems ? (r) => r.max(maxItems) : undefined,
  }) as FieldDefinition;

export const imageField = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required().max(160) })],
  }) as FieldDefinition;

export const seoField = defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }) as FieldDefinition;

/** Standard section heading: eyebrow + accent title (+ optional intro). */
export const sectionHead = (opts: { intro?: boolean; titleMax?: number } = {}): FieldDefinition[] => [
  str("eyebrow", "Eyebrow", { max: 40 }),
  accentText("title", "Heading", { maxPerLine: opts.titleMax ?? 60 }),
  ...(opts.intro ? [str("intro", "Intro text", { rows: 3, max: 260 })] : []),
];
