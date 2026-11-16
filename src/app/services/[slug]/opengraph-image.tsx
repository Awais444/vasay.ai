import { brandOg, ogSize } from "@/lib/og";
import { getContent } from "@/cms/content";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Smart Solutions service";

export async function generateStaticParams() {
  const { services } = await getContent();
  return services.length ? services.map((s) => ({ slug: s.slug })) : [{ slug: "seo" }];
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = (await getContent()).services.find((x) => x.slug === slug);
  return brandOg(s?.h1Keyword || s?.title || "Services", s ? `Services · ${s.title}` : "Services");
}
