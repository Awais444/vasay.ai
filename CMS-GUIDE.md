# Editing the Smart Solutions website

Everything you see on the site (text, services, team, testimonials, FAQs, SEO) is edited in the **Studio**. No code needed.

## 1. Logging in
1. Go to **https://vasay.ai/studio** (or the preview link you were sent).
2. Sign in with the Google account or email you were invited with.
3. Can't sign in? Ask the administrator to invite you (see section 9).

## 2. How the Studio is organised
- **Site settings**: business name, phone, email, address, hours, social links, the "Taking new clients" pill, the announcement bar, default SEO, analytics IDs.
- **Navigation**: navbar links and order, the mega-menu promo card, the navbar button, footer links.
- **Pages**: Home, About, Contact, Services overview, Insights index, Privacy, Terms, 404.
- **Services**, **Work**, **Team**, **Testimonials**, **FAQs**: lists you can add to.
- **Insights**: blog articles, categories, authors.
- **Redirects**: send an old URL to a new one.

## 3. Editing a page
1. Open **Pages → Home** (or any page).
2. Each homepage section has a **Show this section** switch. Turn it off to hide the section.
3. Change the text. Fields have limits so the design doesn't break; a red message tells you if text is too long.
4. **Orange words in headings:** select the words and click the **Orange** button in the small toolbar.
5. Click **Publish** (bottom right). The live site updates within a few seconds.

**Preview before publishing:** click **Presentation** in the top bar. You'll see the real site with your unsaved changes. Click any text to jump to its field. Click **Preview mode · Exit** (bottom left of the page) to leave.

## 4. Adding a service
1. **Services → + Create**.
2. Fill in the title, **slug** (the URL, e.g. `email-marketing` becomes /services/email-marketing), icon, tagline, card description, hero text, problems, what's included, process, and the "What is X?" answer.
3. Set **Order in menus** to place it in the list.
4. **Publish.** The page, the mega-menu item, the footer link and the sitemap entry appear automatically.
5. Add FAQs for it under **FAQs** (choose the service in "Show on these service pages").

New services get a simple "what's included" mockup next to the hero; the 8 original services keep their custom ones.

## 5. Adding a testimonial
1. **Testimonials → + Create**: quote, client name, business, service, rating.
2. Tick **Approved by the client** only once the client has said yes.
3. On vasay.ai, testimonials appear **only when at least 3 are approved**, and only the approved ones. Previews show all of them with a "Placeholder" label.

## 6. Publishing a blog post
1. Fill in your **author** profile once (Insights → Authors) and publish it.
2. **Insights → Articles → + Create**: title, slug, excerpt, cover image (with alt text), key takeaways, body, category, author, **Published at**.
3. Publish. A future "Published at" date schedules it.

### Cover photos

- **Picking a photo:** in the cover image field, click **Select → Unsplash** to search free stock photos, or upload your own. The photographer credit is saved with the photo automatically.
- **Use Unsplash or Pexels photos only** (both are free for commercial use). Never use images from Google search or other websites.
- **No recognisable brand logos** in the photo (phones, laptops, shop signs, clothing).
- **Never present stock-photo people as our team or our clients.** Captions and text must not suggest they are.
- **Always write alt text** that describes what is in the photo, e.g. "Woman replying to a text message on her phone at a café table".
- **Prefer calm, bright photos with space** around the subject. The site shows every cover at 16:9 with a light blue tint, so busy or very dark photos look out of place.
- **Set the hotspot** (the crop icon on the image) on the subject, so it stays in frame on cards, the article page and social shares.
- No text in the image: the title is added automatically on social share images.
- No photo? The site shows a brand gradient with the category icon instead, so the article still looks finished.

## 7. SEO for any page
Every page and service has an **SEO** tab:
- **Meta title** (50–60 characters) and **meta description** (140–160).
- **Social share image** (1200×630); otherwise a branded image is generated.
- **Canonical URL**: leave empty unless told otherwise.
- **Hide from search engines**: only for pages that shouldn't appear in Google.

## 8. What NOT to do
- Don't change a service's **slug** or a page's URL without adding a **Redirect** from the old URL to the new one.
- Don't delete the 8 original services: their pages and Google rankings disappear.
- Don't publish testimonials or results that aren't real and approved.
- Don't paste formatted text from Word into headings; type or paste as plain text.
- Images: always fill in **Alt text** (what the image shows). Upload photos at least 1200px wide.
- Emptying a section's text hides that section. That's intended, so check the page after publishing.

## 9. Users and roles (for the administrator)
- Invite people at **sanity.io/manage → your project → Members → Invite**.
- **Free plan:** only **Administrator** and **Viewer** roles, up to 20 seats (Viewers are free). Viewers can't edit, so anyone who edits must be an Administrator.
- **Editor** role (can edit content but not project settings) needs the **Growth** plan ($15 per seat per month). Recommended once more than one or two people edit.

---

## For developers: setup

### Environment variables
| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Vercel + `.env.local` | Sanity project (public by design) |
| `NEXT_PUBLIC_SANITY_DATASET` | Vercel + `.env.local` | Usually `production` |
| `SANITY_API_READ_TOKEN` | Vercel (server only) | Viewer token: drafts for live preview. Never `NEXT_PUBLIC_` |
| `SANITY_REVALIDATE_SECRET` | Vercel (server only) | Shared secret for the webhook |
| `VERCEL_DEPLOY_HOOK_URL` | Vercel (server only) | Deploy hook, called when a Redirect is published |
| `SANITY_API_WRITE_TOKEN` | **`.env.local` only** | Editor token for `npm run sanity:migrate` / `sanity:seed`. Never commit, never add to Vercel; revoke after the migration |

### Sanity setup steps
1. Create the project at sanity.io/manage (dataset `production`). Copy the Project ID into the env vars above.
2. **CORS origins** (API → CORS origins): add `http://localhost:3000`, `https://vasay.ai` and your Vercel preview domain (`https://*.vercel.app`), each with **Allow credentials**.
3. **Tokens** (API → Tokens): a **Viewer** token → `SANITY_API_READ_TOKEN` (Vercel). An **Editor** token → `SANITY_API_WRITE_TOKEN` (your `.env.local`, temporary).
4. **Migrate the content:** `npm run sanity:migrate`. It shows a dry-run summary per document type and waits for "yes"; it never overwrites existing documents unless you pass `--force`. Then follow the checklist it prints.
5. **Webhook** (API → Webhooks): URL `https://vasay.ai/api/revalidate`, dataset `production`, trigger on create/update/delete, **no filter** (all documents), projection `{_type, "slug": slug.current}`, method POST, secret = `SANITY_REVALIDATE_SECRET`.
6. **Deploy hook** (Vercel → Project → Settings → Git → Deploy Hooks): create one for `main` and put its URL in `VERCEL_DEPLOY_HOOK_URL`. Publishing a Redirect then triggers a new deployment (redirects are applied at build time).

**Run the migration before** adding the project ID to the production environment. Until a singleton exists, the site uses the built-in content for it. Collections (services, team, FAQs…) come from Sanity as soon as it's connected, so an empty dataset means no services until you migrate.

### How content flows
- `src/cms/content.ts` fetches everything in one cached query (tag `cms`). Publishing calls the webhook, `/api/revalidate` refreshes the tag, and changes are live within seconds. Pages stay statically generated.
- **Fallback** to the content files (`src/cms/seed.ts`) only when Sanity isn't configured, the fetch fails, or a singleton document doesn't exist yet. Empty fields and empty collections are never replaced. Fallbacks are logged on the server and shown as a red notice in preview mode.
- **Live preview:** the Presentation tool turns on Draft Mode via `/api/draft-mode/enable`. Drafts are read with the server-only token; click-to-edit markers are only added in preview.

### GoDaddy static hosting (alternative)
Static export can't run `/studio`, live preview, the webhook or instant updates. Instead:
1. Deploy the Studio to Sanity: `npx sanity deploy` (it lives at `<studioHost>.sanity.studio`, see `sanity.cli.ts`). Remove `src/app/studio` before exporting.
2. Rebuild on publish: point the Sanity webhook at a GitHub Action (`repository_dispatch`) that runs `npm run build` and uploads `out/` by FTP.
3. Content changes go live after that rebuild (a few minutes), not in seconds.
