import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { serviceList } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["", 1],
    ["/services", 0.9],
    ...serviceList.map((s): [string, number] => [`/services/${s.slug}`, 0.8]),
    ["/about", 0.7],
    ["/contact", 0.7],
    ["/privacy-policy", 0.2],
    ["/terms", 0.2],
  ];
  return pages.map(([path, priority]) => ({ url: `${site.url}${path}`, priority }));
}
