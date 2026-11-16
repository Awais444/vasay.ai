import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → on-demand revalidation of the blog's cached data.
 * Webhook settings (sanity.io/manage → API → Webhooks):
 *   URL: https://vasay.ai/api/revalidate · Trigger: create, update, delete
 *   Filter: all documents (leave empty) · Projection: {_type, "slug": slug.current}
 *   Blog types refresh their own tags; every other type refreshes "cms" (site content);
 *   "redirect" also calls VERCEL_DEPLOY_HOOK_URL, because redirects are applied at build time.
 *   Secret: the same value as SANITY_REVALIDATE_SECRET
 */
const BLOG_TYPES = new Set(["post", "category", "author"]);

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string }>(req, secret);
    if (!isValidSignature) return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    if (!body?._type) return NextResponse.json({ ok: false, error: "Missing _type" }, { status: 400 });

    const tags: string[] = [];
    if (BLOG_TYPES.has(body._type)) {
      // Author and category names appear on article cards, so every change refreshes the article lists too.
      tags.push("posts");
      if (body._type === "post" && body.slug) tags.push(`post:${body.slug}`);
      if (body._type === "category") tags.push("categories");
      if (body._type === "author") tags.push("authors");
    } else {
      // Every other site document (settings, navigation, pages, services, team, ...) is one cached query.
      tags.push("cms");
    }
    for (const tag of tags) revalidateTag(tag, "max");

    // Redirects live in next.config (build time): trigger a fresh deploy instead.
    let deploy: string | undefined;
    if (body._type === "redirect") {
      const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
      if (hook) {
        const r = await fetch(hook, { method: "POST" });
        deploy = r.ok ? "triggered" : `failed (${r.status})`;
      } else deploy = "skipped (VERCEL_DEPLOY_HOOK_URL not set)";
    }

    return NextResponse.json({ ok: true, revalidated: tags, ...(deploy ? { deploy } : {}) });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
