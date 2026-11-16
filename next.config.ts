import type { NextConfig } from "next";

// Hostname only: Next matches the host header without the port.
const canonicalHost = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vasay.ai").hostname;

/** Built-in redirects (old site URLs); used when Sanity isn't configured or can't be reached. */
const DEFAULT_REDIRECTS = [
  { from: "/our-services", to: "/services", permanent: true },
  { from: "/lead-generation-ai-automation", to: "/services/ai-automation", permanent: true },
];

/** Redirects edited in Sanity (Redirects collection), read at build time. Publishing one triggers a redeploy. */
async function loadRedirects(): Promise<{ from: string; to: string; permanent: boolean }[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) return DEFAULT_REDIRECTS;
  try {
    const query = encodeURIComponent('*[_type == "redirect" && defined(from) && defined(to)]{ from, to, permanent }');
    const res = await fetch(`https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${query}&perspective=published`);
    if (!res.ok) throw new Error(String(res.status));
    const { result } = (await res.json()) as { result: { from: string; to: string; permanent?: boolean }[] };
    return result.filter((r) => r.from.startsWith("/")).map((r) => ({ from: r.from, to: r.to, permanent: r.permanent !== false }));
  } catch (e) {
    console.warn(`[cms] Could not load redirects from Sanity, using defaults: ${(e as Error).message}`);
    return DEFAULT_REDIRECTS;
  }
}

const nextConfig: NextConfig = {
  // GoDaddy Airo preview serves the dev server from this host.
  allowedDevOrigins: ["*.airoapp.ai", "**.airoapp.ai"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Preview/staging hosts (*.vercel.app, localhost, www) must never be indexed.
        source: "/:path*",
        missing: [{ type: "host", value: `^${canonicalHost.replace(/\./g, "\\.")}$` }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  // 301s from the old site's URLs. Keep in sync with public/.htaccess (static hosting).
  // www → apex and http → https are set in Vercel → Domains (and in .htaccess for GoDaddy).
  // Trailing slashes are removed by Next.js automatically (trailingSlash: false).
  async redirects() {
    return (await loadRedirects()).map((r) => ({ source: r.from, destination: r.to, permanent: r.permanent }));
  },
  // The Sanity Studio is a client-side app at /studio; its deeper URLs all load the same page.
  async rewrites() {
    return [{ source: "/studio/:path+", destination: "/studio" }];
  },
  images: {
    // AVIF first (smallest), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Blog images from Sanity's CDN
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  experimental: {
    // Inline the (small, Tailwind) CSS into the HTML: no render-blocking stylesheet request.
    inlineCss: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
