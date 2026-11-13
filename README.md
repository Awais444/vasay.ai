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
| `CONTACT_TO_EMAIL` | Inbox that receives leads |
| `CONTACT_FROM_EMAIL` | Sender on a Resend-verified domain |
| `GHL_WEBHOOK_URL` | Optional GoHighLevel inbound webhook |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Form target. Empty = `/api/contact`. Use `/contact.php` for static hosting |

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

## Before launch: TODOs
- Logo SVGs (and a horizontal version) in `/public/brand/`; update `SRC` in `src/components/Logo.tsx`
- Real portfolio projects: the Work cards are neutral category cards. Add real projects, images (`/public/work/`) and verified results in `content.ts`
- Real client testimonials: add them to `testimonials` in `content.ts` and set `showTestimonials = true` (the section is hidden until then)
- Real team photos (replace `/public/team/*.svg`)
- Social profile URLs in `content.ts`
- Resend API key + verified sender domain, and the GHL webhook URL

## Pages

`/`, `/services`, `/services/{brand-identity,website-design,web-development,seo,social-media,paid-ads,ai-automation,cybersecurity}`, `/about`, `/contact`, `/privacy-policy`, `/terms`, plus a custom 404, `/sitemap.xml` and `/robots.txt`.

- Service copy: `src/lib/services.ts` (all 8 pages render from `src/app/services/[slug]/page.tsx`)
- Legal copy: `src/lib/legal.ts` (**TODO: lawyer review before launch**)
- Old-URL 301s: `redirects()` in `next.config.ts` (Node hosting) and `public/.htaccess` (static hosting). Keep them in sync.
- Light-hero pages that start with a solid navbar: `LIGHT_HERO_ROUTES` in `src/components/Navbar.tsx`
