"use client";

/** Sanity Studio, embedded at /studio (src/app/studio/[[...tool]]/page.tsx). */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { presentationTool } from "sanity/presentation";
import { resolve } from "./src/sanity/presentation";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas";
import { structure, SINGLETON_TYPES } from "./src/sanity/structure";

export default defineConfig({
  name: "default",
  title: "Smart Solutions CMS",
  // Next.js serves it at /studio. `sanity deploy` hosts it at the studio domain root.
  basePath: process.env.SANITY_STUDIO_HOSTED === "1" ? "/" : "/studio",
  // Placeholder only when unset: /studio shows setup steps instead of loading the Studio.
  // `sanity build` only inlines SANITY_STUDIO_* variables into the browser bundle.
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || projectId || "missing",
  dataset: process.env.SANITY_STUDIO_DATASET || dataset,
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
    // Live preview needs the Next.js server. The static GoDaddy studio edits content without it.
    ...(process.env.SANITY_STUDIO_STATIC === "1"
      ? []
      : [presentationTool({ resolve, previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } } })]),
    visionTool({ defaultApiVersion: apiVersion }),
    // Search and pick free Unsplash photos inside any image field (uploads still work).
    unsplashImageAsset(),
  ],
});
