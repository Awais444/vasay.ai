# Site brief: vasay.ai (Smart Solutions)

Built from the agency toolkit template (`projects/_template/brief.md`). Unknowns are marked `?`. Fields marked **must** block the workflow.

## Business

- Name: Smart Solutions Inc. (brand: Smart Solutions, Powered by VASAY.AI)
- What it sells or does **(must)**: full-service digital agency: websites, branding, SEO, social media, paid ads, AI automation and cybersecurity for small and medium businesses.
- Main services or products, in priority order **(must)**: all 8, equal priority (user, 2026-11-24): brand identity, website design, web development, SEO, social media, paid ads, AI automation, cybersecurity.
- What makes it different: one connected team for website, brand, marketing and automation; month to month, no lock-in; plain-language reporting; AI automation (GoHighLevel).
- Proof of experience and trust: site states 15+ years; team of 6 plus 2 founders on the About page; portfolio: TMS, property investment platform, Nahj HRMS, serik.ca SEO (679 clicks / 25K impressions in 3 months) and Google Ads (269 clicks, 10.83% CTR). Licences, certifications, awards: ?
- Regulated or high-stakes topic: no

## Site

- Domain **(must)**: vasay.ai (canonical). Currently live only at vasay-ai.vercel.app; vasay.ai is not pointed at Vercel yet, so it does not load.
- New or existing, and domain age: new site; domain age ?
- Platform: custom code (Next.js 16, Sanity CMS, Vercel)
- Access available: code repo, CMS; Search Console ?; Analytics ?
- Known history: hosting moved GoDaddy → Vercel (Nov 2026); no penalties known.

## Project type **(must, pick one primary)**

- [x] Local business (serves customers in set areas) — primary
- [ ] Rank and rent / lead generation
- [ ] Ecommerce
- [ ] International or multilingual
- [ ] Content site (blog, affiliate, publisher)
- [x] SaaS / B2B — secondary: B2B services sold to businesses across Canada
- [ ] Other:

## Market

- Country and language **(must)**: Canada, English (en-CA)
- Target locations **(must for local)**: current list (Vaughan, Concord, Toronto, Mississauga, Brampton, Markham, Richmond Hill, GTA) plus more GTA and Golden Horseshoe cities (user wants more, 2026-11-24; list proposed in step 2); AI automation for all of Canada.
- Storefront or service-area: **public address** (user changed to public on 2026-11-24, after first saying hidden). Same address on the site, schema and Business Profile, plus a service-area list. Office: 3300 Hwy 7, Floor 6, Concord, ON L4K 4M3. The site already shows it in the footer, contact page and schema: consistent, no change needed.
- Audience: owners of small and medium businesses (real estate, e-commerce, healthcare, education, professional and home services, hospitality, retail, franchises, startups).

## Goals

- Primary goal: form leads, calls and WhatsApp chats (phone/WhatsApp (647) 559-3900)
- Timeframe and budget level: not given; Claude to propose a realistic publishing pace in the roadmap.
- Current numbers: none yet (no Search Console data for vasay.ai)

## Competitors

- Named by the user: none; Claude finds them from the SERP captures (user, 2026-11-24).
- Claude adds SERP competitors in `research/competitors/selection.md`.

## Tools available

- Screaming Frog: none known
- Ahrefs or Semrush: none known (no search volumes; prioritise by SERP evidence)
- SERP API: none
- Search Console: property **vasay.ai**, submitted a few days before 2026-11-24 (user). Problem: vasay.ai DNS (GoDaddy, A 132.148.182.242) serves a GoDaddy "One moment, please..." challenge page (7 KB, no site content, no robots.txt, no sitemap), not the Next.js site on Vercel. Hosting stays on GoDaddy (user, 2026-11-24). The page is a JavaScript bot challenge (auto-submits a hidden form, reloads after 5s); a plain or Googlebot user-agent request gets only the challenge. Whether real Googlebot passes must be checked with Search Console URL Inspection → Test live URL. Code changes pushed to GitHub reach Vercel, not GoDaddy: GoDaddy needs its own redeploy. Analytics: unknown. Business Profile: unknown.

## Deliverables wanted

- [x] Competitor research report
- [x] Topical map and site architecture
- [x] Content briefs
- [ ] Written content
- [x] Internal link plan
- [x] Technical audit
- [x] Off-page and local plan
- [x] 90-day roadmap

## Constraints

- No invented numbers, reviews or business details; no fake testimonials (current testimonials are placeholders).
- Do not change DNS without the user's go-ahead.
- Do not push to GitHub without asking.
- Toolkit `private/` and its client `projects/` are never copied into this repo.
