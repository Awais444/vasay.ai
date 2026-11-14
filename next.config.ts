import type { NextConfig } from "next";

// Hostname only: Next matches the host header without the port.
const canonicalHost = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vasay.ai").hostname;

const nextConfig: NextConfig = {
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
    return [
      { source: "/our-services", destination: "/services", permanent: true },
      { source: "/lead-generation-ai-automation", destination: "/services/ai-automation", permanent: true },
    ];
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
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
