import { defineArrayMember, defineField, defineType } from "sanity";

/** Image with required alt text, used for covers, body images and author photos. */
export const imageWithAlt = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        description: "Describe the image for screen readers and Google. Required.",
        validation: (r) => r.required().max(160),
      }),
    ],
    validation: required ? (r) => r.required() : undefined,
  });

export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      type: "string",
      options: { list: ["tip", "info", "warning"], layout: "radio", direction: "horizontal" },
      initialValue: "tip",
    }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "text", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", subtitle: "text" }, prepare: ({ title, subtitle }) => ({ title: title || "Callout", subtitle }) },
});

export const table = defineType({
  name: "table",
  title: "Table",
  type: "object",
  fields: [
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "headerRow", title: "First row is a header", type: "boolean", initialValue: true }),
    defineField({
      name: "rows",
      type: "array",
      of: [
        defineArrayMember({
          name: "row",
          type: "object",
          fields: [defineField({ name: "cells", type: "array", of: [defineArrayMember({ type: "string" })] })],
          preview: { select: { cells: "cells" }, prepare: ({ cells }) => ({ title: (cells ?? []).join(" · ") }) },
        }),
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: { select: { title: "caption" }, prepare: ({ title }) => ({ title: title || "Table" }) },
});

export const codeBlock = defineType({
  name: "codeBlock",
  title: "Code",
  type: "object",
  fields: [
    defineField({
      name: "language",
      type: "string",
      options: { list: ["text", "html", "css", "javascript", "typescript", "json", "php", "bash"] },
      initialValue: "text",
    }),
    defineField({ name: "code", type: "text", rows: 8, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "language", subtitle: "code" }, prepare: ({ title, subtitle }) => ({ title: `Code (${title})`, subtitle }) },
});

export const faqBlock = defineType({
  name: "faqBlock",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Frequently asked questions" }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          name: "qa",
          type: "object",
          fields: [
            defineField({ name: "question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "answer", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: { select: { title: "title", items: "items" }, prepare: ({ title, items }) => ({ title: title || "FAQ", subtitle: `${items?.length ?? 0} questions` }) },
});

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Want this done for you?", validation: (r) => r.required() }),
    defineField({ name: "text", type: "text", rows: 2 }),
    defineField({ name: "buttonLabel", type: "string", initialValue: "Book a free strategy call", validation: (r) => r.required() }),
    defineField({ name: "buttonHref", title: "Button link", type: "string", initialValue: "/contact", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", subtitle: "buttonLabel" } },
});

/** Article body: Portable Text with headings, lists, links and the custom blocks above. */
export const blockContent = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({ name: "href", title: "URL", type: "string", validation: (r) => r.required() }),
              defineField({ name: "blank", title: "Open in a new tab", type: "boolean", initialValue: false }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required().max(160) }),
        defineField({ name: "caption", type: "string" }),
      ],
    }),
    defineArrayMember({ type: "callout" }),
    defineArrayMember({ type: "table" }),
    defineArrayMember({ type: "codeBlock" }),
    defineArrayMember({ type: "faqBlock" }),
    defineArrayMember({ type: "ctaBlock" }),
  ],
});
