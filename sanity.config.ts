"use client";

/** Sanity Studio, embedded at /studio (src/app/studio/[[...tool]]/page.tsx). */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "default",
  title: "Smart Solutions · Insights",
  basePath: "/studio",
  // Placeholder only when unset: /studio shows setup steps instead of loading the Studio.
  projectId: projectId || "missing",
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Insights")
          .items([
            S.documentTypeListItem("post").title("Articles"),
            S.documentTypeListItem("category").title("Categories"),
            S.documentTypeListItem("author").title("Authors"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
