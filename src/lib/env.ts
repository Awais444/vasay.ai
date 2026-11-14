/** True only under `next dev`. Next.js inlines the literal `process.env.NODE_ENV`, so it works in the browser too. */
export const isDev = process.env.NODE_ENV === "development";

/** Canonical origin: https, apex (no www), no trailing slash. Set NEXT_PUBLIC_SITE_URL per environment. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://vasay.ai").replace(/\/+$/, "");
