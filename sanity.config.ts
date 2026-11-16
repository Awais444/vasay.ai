"use client";

/** Sanity Studio, embedded at /studio (src/app/studio/[[...tool]]/page.tsx). */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas";
import { structure, SINGLETON_TYPES } from "./src/sanity/structure";

export default defineConfig({
  name: "default",
  title: "Smart Solutions CMS",
  basePath: "/studio",
  // Placeholder only when unset: /studio shows setup steps instead of loading the Studio.
  projectId: projectId || "missing",
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "+" menu (they exist once, with fixed IDs).
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    // No duplicate/delete on singletons.
    actions: (input, ctx) => (SINGLETON_TYPES.has(ctx.schemaType) ? input.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action)) : input),
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
