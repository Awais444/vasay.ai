# 90-day roadmap (step 12)

Start: 1 December 2026. Ordered by impact against effort, with dependencies first (the toolkit rule: fix indexing before publishing at volume). Owner = who does it: **Owner** (Smart Solutions team), **Dev** (code work in this repo), **Content** (writing).

## Days 0–30 (December 2026): make the site findable

| # | Action | Owner | Depends on | Impact | Effort |
|---|---|---|---|---|---|
| 1 | Turn off / allow-list the GoDaddy bot challenge for search engines; confirm with Search Console "Test live URL" | Owner | none | **Critical** | S |
| 2 | Redeploy GoDaddy from `main`; set a habit: redeploy after every release | Owner | 1 | Critical | S |
| 3 | Submit `https://vasay.ai/sitemap.xml` in Search Console; request indexing for home and 8 services | Owner | 1, 2 | High | S |
| 4 | Set GA4 (and GTM if used) IDs in the GoDaddy environment; mark form, call and WhatsApp clicks as key events (code already tracks them) | Owner | 2 | High | S |
| 5 | Google Business Profile: check, claim or create; fill every field per `local.md` | Owner | none | High | M |
| 6 | Directory listings: Clutch, DesignRush, Semrush Agency Partners, GoodFirms, Apple, Bing | Owner | none | High | M |
| 7 | Start the review process with the last 5–10 clients (Google + Clutch) | Owner | 5, 6 | High | S |
| 8 | Build `/work` + case study pages, add "Related work" and "From the blog" blocks to service pages | Dev | none | High | M |
| 9 | Publish serik.ca SEO and Ads case studies; add results blocks to `/services/seo` and `/services/paid-ads` | Content + Dev | 8, owner OK to name serik.ca | High | M |
| 10 | Publish "How much does SEO cost in Toronto" | Content | price ranges from owner | Medium | M |
| 11 | Small fixes: 3 long titles, category description | Dev | none | Low | S |
| 12 | Record the baseline (`measurement/baseline.md`) the day indexing works | Claude | 1–3 | — | S |

## Days 31–60 (January 2027): win the open field

| # | Action | Owner | Impact | Effort |
|---|---|---|---|---|
| 13 | Improve `/services/ai-automation` (Canada section, workflow, GoHighLevel, cost range) | Content + Dev | High | M |
| 14 | Publish "GoHighLevel in Canada" and "Missed-call text-back" | Content | High | M |
| 15 | Keep asking for reviews; reply to every review | Owner | High | S |
| 16 | First monthly report from Search Console (step 13) | Claude | — | S |
| 17 | Re-test speed (PageSpeed) on home and one service page; fix mobile LCP if still about 4 s | Dev | Medium | S |
| 18 | Vaughan Chamber of Commerce membership/listing; client "Website by" credits | Owner | Medium | S |

## Days 61–90 (February 2027): depth and proof

| # | Action | Owner | Impact | Effort |
|---|---|---|---|---|
| 19 | Case studies: TMS, Nahj HRMS, property platform; link from `/services/web-development` | Content + Dev | Medium | M |
| 20 | Publish "Website cost in Toronto" and "Google Ads budget for Toronto" | Content | Medium | M |
| 21 | Replace placeholder testimonials with real ones as they arrive (only real ones get Review schema) | Owner + Dev | Medium | S |
| 22 | Review the plan with 2 months of data: which queries start to show, which pages to expand | Claude | — | S |
| 23 | Write briefs for months 4–6 | Claude | — | S |

## Expectations

- `[G]` No one can pay Google for organic or map rankings, and results are not guaranteed.
- `[T]` A new domain usually needs several months before steady organic leads; the first signs are impressions in Search Console, then clicks on long, specific queries (costs, GoHighLevel, missed-call).
- Directory listings and the Business Profile can bring leads sooner than organic pages.
