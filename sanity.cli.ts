/** Sanity CLI settings (`npx sanity deploy`, `npx sanity dataset ...`). */
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
  // Used by `npx sanity deploy` (Studio on <studioHost>.sanity.studio, e.g. for static hosting).
  studioHost: "smart-solutions-insights",
});
