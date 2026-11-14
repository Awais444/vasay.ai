import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → on-demand revalidation of the blog's cached data.
 * Webhook settings (sanity.io/manage → API → Webhooks):
 *   URL: https://vasay.ai/api/revalidate · Trigger: create, update, delete
 *   Filter: _type in ["post", "category", "author"] · Projection: {_type, "slug": slug.current}
 *   Secret: the same value as SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string }>(req, secret);
    if (!isValidSignature) return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    if (!body?._type) return NextResponse.json({ ok: false, error: "Missing _type" }, { status: 400 });

    // Author and category names appear on article cards, so every change refreshes the article lists too.
    const tags = ["posts"];
    if (body._type === "post" && body.slug) tags.push(`post:${body.slug}`);
    if (body._type === "category") tags.push("categories");
    if (body._type === "author") tags.push("authors");
    for (const tag of tags) revalidateTag(tag, "max");

    return NextResponse.json({ ok: true, revalidated: tags });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
