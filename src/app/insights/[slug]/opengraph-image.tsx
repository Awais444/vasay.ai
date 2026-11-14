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

/** Social share image: the article's own OG image if set in Sanity, otherwise a branded card with the title. */
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
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background: "radial-gradient(circle at 85% 15%, #011efd 0%, #1b08b7 45%, #12057f 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, fontWeight: 600 }}>
          <svg width="34" height="34" viewBox="0 0 24 24">
            <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" fill="#ff7001" />
          </svg>
          {post?.category?.title ?? "Insights"}
        </div>
        <div style={{ fontSize: title.length > 60 ? 64 : 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "rgba(255,255,255,0.8)" }}>
          <span>Smart Solutions · Powered by VASAY.AI</span>
          <span style={{ color: "#ff7001", fontWeight: 600 }}>vasay.ai/insights</span>
        </div>
      </div>
    ),
    size,
  );
}
