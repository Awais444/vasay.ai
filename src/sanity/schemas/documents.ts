import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./blocks";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      description: "For a service category, use the service's URL slug (e.g. seo, paid-ads) so its service page links here.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
  ],
});

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    imageWithAlt("photo", "Photo"),
    defineField({ name: "bio", type: "text", rows: 4 }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          name: "social",
          type: "object",
          fields: [
            defineField({ name: "platform", type: "string", options: { list: ["LinkedIn", "X", "Instagram", "Facebook", "Website"] } }),
            defineField({ name: "url", type: "url", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "metaTitle", type: "string", description: "Defaults to the title. Aim for 50–60 characters.", validation: (r) => r.max(70) }),
    defineField({ name: "metaDescription", type: "text", rows: 2, description: "Defaults to the excerpt. Aim for 140–160 characters.", validation: (r) => r.max(170) }),
    defineField({ name: "ogImage", title: "Social share image", type: "image", description: "Optional. Without it, a branded image with the title is generated." }),
    defineField({ name: "canonical", title: "Canonical URL override", type: "url", description: "Only if this article was first published elsewhere." }),
    defineField({ name: "noindex", title: "Hide from search engines (noindex)", type: "boolean", initialValue: false }),
  ],
});

export const post = defineType({
  name: "post",
  title: "Article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Details" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required().max(110) }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 90 },
      validation: (r) =>
        r.required().custom((v) =>
          v?.current && ["page", "category", "author", "rss.xml"].includes(v.current) ? "This URL is reserved. Choose another slug." : true,
        ),
    }),
    defineField({ name: "excerpt", type: "text", rows: 3, group: "content", validation: (r) => r.required().max(220) }),
    { ...imageWithAlt("coverImage", "Cover image", true), group: "content" },
    defineField({
      name: "keyTakeaways",
      title: "Key takeaways",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.max(6),
    }),
    defineField({ name: "body", type: "blockContent", group: "content" }),
    defineField({ name: "category", type: "reference", to: [{ type: "category" }], group: "meta", validation: (r) => r.required() }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }], group: "meta", validation: (r) => r.required() }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "meta",
      description: "A future date schedules the article: it appears on the site once that time has passed (within the hour).",
      validation: (r) => r.required(),
    }),
    defineField({ name: "updatedAt", title: "Last updated", type: "datetime", group: "meta" }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Published, newest", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category.title", media: "coverImage" } },
});
