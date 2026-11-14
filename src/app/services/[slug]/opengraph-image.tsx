import { brandOg, ogSize } from "@/lib/og";
import { getService, serviceList } from "@/lib/services";
import { getGuide } from "@/lib/serviceGuides";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Smart Solutions service";

export function generateStaticParams() {
  return serviceList.map((s) => ({ slug: s.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  return brandOg(getGuide(slug)?.h1Keyword ?? s?.title ?? "Services", s ? `Services · ${s.title}` : "Services");
}
