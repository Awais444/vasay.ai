import { ImageResponse } from "next/og";
import { getPost, getPosts } from "@/sanity/data";
import { imageUrl } from "@/sanity/client";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Smart Solutions Insights article";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "coming-soon" }];
}

const STAR = "M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z";

/**
 * Social share image. Priority: the SEO "social share image" from Sanity as is,
 * then the cover photo (1200×630 crop around the hotspot) with the title on a dark gradient,
 * then a branded card with the title.
 */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const custom = imageUrl(post?.seo?.ogImage, 1200, 630);

  if (custom) {
    return new ImageResponse(
      // eslint-disable-next-line @next/next/no-img-element
      <img src={custom} alt="" width={1200} height={630} style={{ width: "100%", height: "100%", objectFit: "cover" }} />,
      size,
    );
  }

  const title = post?.title ?? "Insights";
  const photo = post?.coverImage?.asset ? imageUrl(post.coverImage, 1200, 630)?.replace("auto=format", "fm=jpg") : null;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", color: "white", background: "#12057f" }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", background: "radial-gradient(circle at 85% 15%, #011efd 0%, #1b08b7 45%, #12057f 100%)" }} />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: photo
              ? "linear-gradient(to top, rgba(10,8,30,0.92) 0%, rgba(10,8,30,0.7) 45%, rgba(10,8,30,0.1) 100%)"
              : "transparent",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", width: "100%", padding: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24">
              <path d={STAR} fill="#ff7001" />
            </svg>
            {post?.category?.title ?? "Insights"}
          </div>
          <div style={{ marginTop: 20, fontSize: title.length > 60 ? 54 : 64, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.03em", maxWidth: 1040 }}>
            {title}
          </div>
          <div style={{ marginTop: 28, display: "flex", fontSize: 22, color: "rgba(255,255,255,0.75)" }}>Smart Solutions · Powered by VASAY.AI · vasay.ai/insights</div>
        </div>
      </div>
    ),
    size,
  );
}
