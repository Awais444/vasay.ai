/** True only under `next dev`. Next.js inlines the literal `process.env.NODE_ENV`, so it works in the browser too. */
export const isDev = process.env.NODE_ENV === "development";
