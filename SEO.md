# SEO, AEO & GEO: how this site is set up

Smart Solutions Inc. (brand: **Smart Solutions, Powered by VASAY.AI**). Canonical origin: **https://vasay.ai** (https, no www, no trailing slash).

**Contact details** (single source: `site` in `src/lib/content.ts`, used by the footer, contact sections, mobile menu, legal pages, JSON-LD and llms.txt):
- Phone: (647) 559-3900 · `tel:+16475593900` · schema `+1-647-559-3900`
- Email: info@smartsolutionsinc.ca

**Contact form email:** sent from `Smart Solutions <noreply@smartsolutionsinc.ca>` with Reply-To set to the visitor. The **smartsolutionsinc.ca domain must be verified in Resend** (add the SPF and DKIM DNS records Resend gives you) before any email will send. For GoDaddy `contact.php`, the domain's SPF record must also allow GoDaddy's mail servers.

## 1. Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, used for canonicals, sitemap, Open Graph and JSON-LD. `https://vasay.ai` |
| `NEXT_PUBLIC_NOINDEX` | Off Vercel only: `1` blocks indexing (staging servers). Vercel previews are blocked automatically via `VERCEL_ENV` |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 measurement ID (`G-…`). Production only |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container (`GTM-…`). Production only |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console HTML-tag verification code |
| `NEXT_PUBLIC_BING_VERIFICATION` | Bing Webmaster Tools `msvalidate.01` code |

**Who can be indexed:** only the production deployment (`src/lib/seo.ts` → `isIndexable`). Previews get `noindex` meta + a disallow-all `robots.txt`. Any host other than the canonical one (e.g. `*.vercel.app`, `www`) also gets an `X-Robots-Tag: noindex, nofollow` header (`next.config.ts`).

**Domains (Vercel → Project → Settings → Domains):** make `vasay.ai` the primary domain and set `www.vasay.ai` to redirect to it. Vercel handles http → https. For GoDaddy static hosting the same rules are in `public/.htaccess`.

## 2. Keyword map

| Page | Primary keyword | Title |
|---|---|---|
| `/` | digital marketing agency Vaughan / GTA, AI marketing automation | Digital Marketing Agency in Vaughan & GTA \| Smart Solutions |
| `/services` | digital marketing services Vaughan / GTA | Digital Marketing Services, Vaughan & GTA \| Smart Solutions |
| `/services/brand-identity` | branding agency Toronto, brand identity design GTA | Branding Agency Toronto \| Brand Identity Design GTA |
| `/services/website-design` | web design company Vaughan / Toronto | Web Design Company in Vaughan & Toronto \| Smart Solutions |
| `/services/web-development` | custom web development Toronto | Custom Web Development Toronto \| Next.js, WordPress, Shopify |
| `/services/seo` | SEO services Vaughan, local SEO Toronto | SEO Services Vaughan & Local SEO Toronto \| Smart Solutions |
| `/services/social-media` | social media management agency Toronto | Social Media Management Agency Toronto \| Smart Solutions |
| `/services/paid-ads` | Google Ads agency Toronto, Meta ads management | Google Ads Agency Toronto & Meta Ads \| Smart Solutions |
| `/services/ai-automation` | AI lead generation & marketing automation Canada, GoHighLevel agency | AI Marketing Automation Canada \| GoHighLevel Agency |
| `/services/cybersecurity` | website security services small business Toronto | Website Security Services for Small Business in Toronto |
| `/about` | digital marketing agency in Concord, Ontario | About Smart Solutions \| Marketing Agency in Concord, ON |
| `/contact` | contact digital marketing agency Concord ON | Contact Us \| Digital Marketing Agency in Concord, ON |

Titles are 50–60 characters, descriptions 140–160. Service titles/descriptions live in `src/lib/services.ts` (`seoTitle`, `seoDescription`); other pages set them in their `page.tsx`.

**Service H1s** contain the keyword phrase (`h1Keyword` in `src/lib/serviceGuides.ts`, shown as the pill inside the H1). The **homepage H1** is the brand line "Smarter marketing. Real business growth."; the keyword is carried by the title, description and copy. Changing the H1 itself would change the design.

## 3. Structured data (JSON-LD), per page

Builders: `src/lib/schema.ts`. Everything links to two site-wide entities rendered in the layout:

- `Organization` + `ProfessionalService`, `@id` `https://vasay.ai/#organization` (name, alternateName, logo, telephone, email, contactPoint (customer service, CA, English), address, areaServed cities, knowsAbout)
- `WebSite`, `@id` `https://vasay.ai/#website` (publisher → organization)

| Page | Types |
|---|---|
| `/` | WebPage, BreadcrumbList, FAQPage |
| `/services` | CollectionPage, BreadcrumbList, OfferCatalog (all 8 services) |
| `/services/*` | WebPage (dateModified), BreadcrumbList, Service (provider → organization), FAQPage |
| `/about` | AboutPage, BreadcrumbList |
| `/contact` | ContactPage, BreadcrumbList, FAQPage |
| Legal pages | WebPage, BreadcrumbList |
| `/insights` | CollectionPage, BreadcrumbList |
| `/insights/[slug]` | BlogPosting (author Person, publisher → organization, dates), BreadcrumbList, FAQPage if the article has an FAQ block |
| `/insights/author/[slug]` | ProfilePage (Person) |

FAQ schema is built from the same data as the visible FAQs, and the answers are always in the HTML (accordions only collapse visually), so they match exactly. **No `Review`/`AggregateRating`** until there are real, verifiable reviews. **No team `Person` schema** until the real team is confirmed.

## 4. Content for answer engines (AEO/GEO)

Each service page has, in `src/lib/serviceGuides.ts`:
- a **"What is X?"** definition (1–2 plain sentences: the snippet AI tools quote)
- **who it's for**
- question-led sections (cost, timeline, how it works) that open with a **direct answer** first
- a **comparison table** where useful (e.g. "SEO vs Google Ads: which first?")
- **6 FAQs** (4 in `services.ts` + 2 in the guide)
- a visible **Last updated** date (also `dateModified`); change `updated` when you edit a page

Prices are deliberately not published. Only timelines and ad-spend ranges already stated by the business are used.

**AI files:** `/llms.txt` (summary + links) and `/llms-full.txt` (full service content) are generated from the content files, so they never go stale (`src/lib/llms.ts`).

**robots.txt** explicitly allows Googlebot, Bingbot, Google-Extended, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Applebot, Applebot-Extended and CCBot; `/api/` and `/studio` are disallowed.

## 5. Measurement

- GA4 / GTM load **only in production**, after the page is interactive (`src/components/Analytics.tsx`).
- **Consent Mode v2 defaults:** `analytics_storage: granted`; `ad_storage`, `ad_user_data`, `ad_personalization: denied`. If you start targeting Quebec (Law 25) or the EU, switch analytics to `denied` and add a consent banner.
- **GA4 events:** `generate_lead` (contact form success), `phone_click` (any `tel:` link), `email_click` (any `mailto:` link), `book_call_click` (any "strategy call" link). Mark `generate_lead` as a key event in GA4.

## 6. Adding an article

Articles are written in Sanity at `/studio` (see README → "Blog: Insights"). Fill in title, slug, excerpt, cover image + alt text, key takeaways, body, category (the service it supports), author and publish date; add an FAQ block where it helps. SEO tab: meta title (50–60), meta description (140–160), optional social image, canonical override and noindex. Publishing refreshes the site, sitemap and RSS automatically.

Internal links: link each article to its service page with descriptive anchor text, and to 1–2 related articles.

## 7. TODOs you need to fill in

- [ ] **Business hours** (`site.hours` in `src/lib/content.ts`, then add `openingHoursSpecification` in `src/lib/schema.ts`)
- [ ] **Founding year** and **founder** (`foundingDate`, `founder` in schema)
- [ ] **Social profile URLs** in `site.socials` (they're placeholders; `sameAs` is added automatically once they're real profile URLs)
- [ ] **Google Business Profile URL** (add to `sameAs`), and make sure the GBP name, address and phone match the footer exactly
- [ ] **Geo coordinates** of 3300 Hwy 7 (`geo` in schema)
- [ ] **Real team** (then add `Person` schema), **real reviews** (then `Review`/`AggregateRating`), **real portfolio results**
- [ ] **Pricing**, only if you want to publish "starting from" prices (then add `offers` to `Service`)
- [ ] Review the expanded service-page copy (`src/lib/serviceGuides.ts`) for accuracy
- [ ] Set the env vars above on Vercel, verify Search Console + Bing, and submit `https://vasay.ai/sitemap.xml`

## 8. Performance notes

Measured with Lighthouse 12 (mobile, simulated throttling) against a local production build; see the final report in the conversation for numbers. Known remaining items:
- The hero sub copy (the LCP element) is visible from the first server render; its intro animation is transform-only.
- GSAP, Lenis and Framer Motion load site-wide; deferring them further would reduce JavaScript on the first visit.
- Brand orange text on white (headline accents) is below WCAG AA contrast for small text. It's a deliberate brand choice; consider a darker orange for small orange text.
