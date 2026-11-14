// Sanity connection settings (see README → "Blog (Sanity)").
// Without a project ID the site still builds: the blog shows its empty state and /studio shows setup steps.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2025-01-01";
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
