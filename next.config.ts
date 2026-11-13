import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 301s from the old site's URLs. Keep in sync with public/.htaccess (static hosting).
  // Note: redirects() is ignored with output: "export"; .htaccess handles it there.
  async redirects() {
    return [
      { source: "/our-services", destination: "/services", permanent: true },
      { source: "/lead-generation-ai-automation", destination: "/services/ai-automation", permanent: true },
    ];
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
