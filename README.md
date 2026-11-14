# Smart Solutions — Powered by VASAY.AI

Marketing site for vasay.ai. Next.js (App Router, TypeScript), Tailwind CSS v4, Framer Motion, GSAP + ScrollTrigger, Lenis, Zod and Resend.

## Develop

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

- **All copy and data:** `src/lib/content.ts`
- **Brand colours / theme:** `:root` in `src/app/globals.css`
- **Components:** `src/components/`
- Team avatars are generated into `public/team/` by `npm run avatars` (this runs automatically before every build).

## Environment variables

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key (Option A) |
| `CONTACT_TO_EMAIL` | Inbox that receives leads: `info@smartsolutionsinc.ca` |
| `CONTACT_FROM_EMAIL` | Sender, e.g. `Smart Solutions <noreply@smartsolutionsinc.ca>`. **Verify smartsolutionsinc.ca in Resend first** (add its SPF + DKIM DNS records), or emails won't send. Replies go to the visitor |
| `GHL_WEBHOOK_URL` | Optional GoHighLevel inbound webhook |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Form target. Empty = `/api/contact`. Use `/contact.php` for static hosting |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (blog). Without it the blog shows "coming soon" |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset, usually `production` |
| `SANITY_REVALIDATE_SECRET` | Shared secret for the Sanity webhook → `/api/revalidate` |
| `SANITY_API_WRITE_TOKEN` | Only for `npm run sanity:seed` (local). Never commit it |

## Deploy to GoDaddy

### Option A: cPanel with Node.js support
1. Upload the project (or `git pull`) and set the env vars in the Node.js app settings.
2. `npm install && npm run build`
3. `npm start` (set the app's startup command to this).

The form posts to `src/app/api/contact/route.ts`, which emails through Resend and forwards to GHL.

### Option B: shared hosting without Node (static export)
1. In `next.config.ts`, add `output: "export"` and `images: { unoptimized: true }`, and **remove `cacheComponents` and `partialPrefetching`** (static export can't be combined with Cache Components / PPR).
2. Delete or move `src/app/api/` (route handlers can't run in a static export).
3. Set `NEXT_PUBLIC_FORM_ENDPOINT=/contact.php` in `.env.local`.
4. `npm run build`. This creates `out/`.
5. Edit the settings at the top of `public/contact.php` (it's copied into `out/`), then upload **the contents of `out/`** to `public_html`.

`contact.php` validates input, checks the honeypot, sends with PHP `mail()` and forwards to the GHL webhook with cURL.

## Blog: Insights (Sanity CMS)

Articles live in Sanity (free plan) and are edited in the Studio at **/studio** (Sanity login; only project members can sign in).

### One-time setup
1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) (dataset: `production`, visibility: public). Copy the **Project ID**.
2. Add to `.env.local` (and to Vercel → Project → Settings → Environment Variables):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<project id>
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_REVALIDATE_SECRET=<long random string>
   ```
3. **CORS:** sanity.io/manage → API → CORS origins → add `http://localhost:3000` and `https://vasay.ai` (and your `*.vercel.app` URL), each with **Allow credentials** ticked. The Studio can't log in without this.
4. **Seed categories + example draft:** sanity.io/manage → API → Tokens → add an **Editor** token, put it in `.env.local` as `SANITY_API_WRITE_TOKEN`, then run `npm run sanity:seed`. This creates the 9 categories (published), a **TODO author draft** and one **example article draft**. Nothing is published except the categories. Delete the token afterwards if you like.
5. **Invite your team:** sanity.io/manage → Members.
6. **Webhook (on-demand refresh):** sanity.io/manage → API → Webhooks → Create:
   - URL: `https://vasay.ai/api/revalidate`
   - Dataset: `production` · Trigger on: Create, Update, Delete
   - Filter: `_type in ["post", "category", "author"]`
   - Projection: `{_type, "slug": slug.current}`
   - HTTP method: POST · Secret: the same value as `SANITY_REVALIDATE_SECRET`

### Writing
- Fill in the TODO author (name, role, photo, bio) and **publish** it first.
- Article: title, slug, excerpt, cover image (alt text required), key takeaways, body, category, author, **Published at**. Then **Publish**.
- **Scheduling:** set *Published at* to a future date and publish. The article appears once that time passes (pages refresh hourly).
- SEO tab: meta title/description, social image, canonical override, noindex.
- Category slugs match service URLs (`seo`, `paid-ads`, ...), so each service page shows its 3 latest articles automatically.

### How updates go live
Blog data is cached with Next.js Cache Components (`"use cache"` + `cacheTag`, see `src/sanity/data.ts`). Publishing triggers the webhook, `/api/revalidate` refreshes the matching tags, and the next visitor gets the new content. As a fallback, everything also refreshes every hour.

### Static hosting (GoDaddy Option B)
`/studio` and `/api/revalidate` need a server, so with a static export:
1. Host the Studio on Sanity instead: `npx sanity deploy` (uses `sanity.cli.ts`, at `smart-solutions-insights.sanity.studio`). Delete `src/app/studio/` before exporting.
2. Rebuild on publish: add a GitHub Action that runs `npm run build` and uploads `out/` by FTP, triggered by `repository_dispatch`. Point the Sanity webhook at `https://api.github.com/repos/Awais444/vasay.ai/dispatches` with a GitHub token header and body `{"event_type":"sanity-publish"}`.
3. The blog's dynamic routes need every slug at build time (they already come from Sanity via `generateStaticParams`).

## Before launch: TODOs
- Logo SVGs (and a horizontal version) in `/public/brand/`; update `SRC` in `src/components/Logo.tsx`
- Real portfolio projects: the Work cards are neutral category cards. Add real projects, images (`/public/work/`) and verified results in `content.ts`
- Real client testimonials: replace the drafts in `content.ts` and set `approved: true` on each one a client has approved (production shows the section once 3 are approved)
- Real team photos (replace `/public/team/*.svg`)
- Social profile URLs in `content.ts`
- Resend API key + verified sender domain, and the GHL webhook URL

## Pages

`/`, `/services`, `/services/{brand-identity,website-design,web-development,seo,social-media,paid-ads,ai-automation,cybersecurity}`, `/about`, `/contact`, `/privacy-policy`, `/terms`, `/insights` (+ `/insights/[slug]`, `/insights/page/[n]`, `/insights/category/[slug]`, `/insights/author/[slug]`, `/insights/rss.xml`), `/studio`, plus a custom 404, `/sitemap.xml` and `/robots.txt`.

- Service copy: `src/lib/services.ts` (all 8 pages render from `src/app/services/[slug]/page.tsx`)
- Legal copy: `src/lib/legal.ts` (**TODO: lawyer review before launch**)
- Old-URL 301s: `redirects()` in `next.config.ts` (Node hosting) and `public/.htaccess` (static hosting). Keep them in sync.
- Light-hero pages that start with a solid navbar: `LIGHT_HERO_ROUTES` in `src/components/Navbar.tsx`
