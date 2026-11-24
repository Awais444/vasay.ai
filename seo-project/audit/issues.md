# Technical audit: issues (step 10)

Date: 2026-11-24. Crawl: 18 pages of vasay-ai.vercel.app with a Node crawler (the toolkit's Python scripts cannot run here). vasay.ai itself could not be crawled: it returns GoDaddy's bot challenge to scripts. Speed: PageSpeed API quota was used up today; figures are from the Lighthouse runs on 2026-11-17 (`/services/ai-automation`).

| # | Issue | Evidence | URLs | Severity | Fix | Effort |
|---|---|---|---|---|---|---|
| 1 | **Live domain shows a bot challenge, not the site** | vasay.ai returns a 7 KB "One moment, please..." page with a JS auto-submit to any non-browser request, including a Googlebot user-agent | all of vasay.ai | **High** | User is fixing on GoDaddy: allow search engine bots / turn off the challenge; confirm with Search Console → URL Inspection → Test live URL | owner |
| 2 | **GoDaddy build may be out of date** | code pushes deploy to Vercel only; GoDaddy needs its own redeploy | all | **High** | Redeploy GoDaddy from `main` after each release | owner |
| 3 | Service pages lighter than ranking competitors | ~1,440 words vs 2,200–3,800 (step 4) | 8 service pages | Medium | Add proof, process, local detail per briefs | content |
| 4 | Article not linked from its service page | 4 inlinks, none from `/services/ai-automation` | `/insights/what-is-ai-lead-follow-up` | Medium | "From the blog" block (internal-links.md) | small |
| 5 | Mobile LCP about 4 s | Lighthouse mobile 84, desktop 99 (2026-11-17) | service pages | Medium | Check hero image/fonts priority; re-test with PageSpeed when quota resets | small |
| 6 | Two titles slightly over 60 characters | 63 chars | `/`, `/services` | Low | Trim (may be cut in results) | small |
| 7 | Author page title long | 75 chars | `/insights/author/smart-solutions-team` | Low | Shorten template | small |
| 8 | Category description short | 71 chars | `/insights/category/ai-automation` | Low | Write 140–160 chars in Sanity | small |

## What is fine

- All 18 pages return 200; every page is in the sitemap; no orphans; max depth 2.
- One H1 per page; titles and descriptions present on every page.
- Canonicals point to `https://vasay.ai/...` on every page.
- All images have alt text.
- Non-production hosts are noindexed by design (X-Robots-Tag), so vercel.app does not compete with vasay.ai.
- Structured data: Organization/ProfessionalService, WebSite, Service, FAQPage, BreadcrumbList, BlogPosting, Person.
- Local checks: name, address and phone identical across footer, contact page and schema (phone updated to (647) 559-3900); click-to-call/WhatsApp on mobile; contact page crawlable.

## Not checked (say so in the report)

vasay.ai's real response to Googlebot (needs Search Console live test); field Core Web Vitals (no CrUX data for a new domain); server logs.
