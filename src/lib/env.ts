/** True only under `next dev`. Next.js inlines the literal `process.env.NODE_ENV`, so it works in the browser too. */
export const isDev = process.env.NODE_ENV === "development";

/** Canonical origin: https, apex (no www), no trailing slash. Set NEXT_PUBLIC_SITE_URL per environment. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://vasay.ai").replace(/\/+$/, "");

/**
 * True only for the real production site: a production build (VERCEL_ENV "production", or not on
 * Vercel) whose NEXT_PUBLIC_SITE_URL is explicitly https://vasay.ai. Previews, staging and
 * *.vercel.app builds without that variable count as non-live.
 * Evaluated at build time (pages are static), so set NEXT_PUBLIC_SITE_URL=https://vasay.ai
 * only in Vercel's Production environment once the domain is live.
 */
export const isLiveSite =
  !isDev &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production") &&
  !!process.env.NEXT_PUBLIC_SITE_URL &&
  new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname === "vasay.ai";
