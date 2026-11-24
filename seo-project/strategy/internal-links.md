# Internal link plan (step 9)

Date: 2026-11-24. Crawl of vasay-ai.vercel.app (same build as vasay.ai should serve): 18 pages, all 200, all in the sitemap, no orphans.

## Current graph

- **Flat:** header, mega menu and footer link every page to the 15 main pages, so each main page has 17 linking pages. Good for crawling, but it says nothing about which pages matter most.
- **The one article is weakly linked:** `/insights/what-is-ai-lead-follow-up` is linked from 4 pages (home "Latest article", `/insights`, its category, its author). **No service page links to it**, including `/services/ai-automation`, the page it supports.
- **Anchors are generic or long:** article links use the whole card text as anchor; service links use "Learn more" / "Explore". Fine for cards, but there are no descriptive in-text anchors.
- Category and author pages: 3 and 1 inlinks (expected).

## Rules for the new structure (toolkit `internal-links/01`)

1. **Hub → spoke:** `/services` → each service; `/work` → each case study; `/insights` → articles and categories.
2. **Spoke → hub and siblings:** each service page links to its case studies ("Related work") and its articles ("From the blog"), and to 1–2 related services (already exists: "Works even better together").
3. **Article → service:** the first in-text mention of the service links to the service page with a descriptive anchor; one link to a related article.
4. **Case study → service + sibling case study.**
5. Anchors describe the target ("SEO services in Vaughan and Toronto", "GoHighLevel setup in Canada"), never "click here"; one anchor text per target where possible.
6. No page more than 3 clicks from home (already true).

## Link map for the planned pages

| From | To | Anchor (in text) |
|---|---|---|
| `/services/ai-automation` | `/insights/what-is-ai-lead-follow-up` | what AI lead follow-up is |
| `/services/ai-automation` | `/insights/gohighlevel-canada`, `/insights/missed-call-text-back`, `/insights/casl-sms-email-rules` | GoHighLevel in Canada · missed-call text-back · CASL rules for SMS and email |
| `/services/seo` | `/work/serik-seo`, `/insights/seo-cost-toronto`, `/insights/google-business-profile-guide` | the serik.ca SEO case study · what SEO costs in Toronto · Google Business Profile guide |
| `/services/paid-ads` | `/work/serik-google-ads`, `/insights/google-ads-budget-toronto` | serik.ca Google Ads results · Google Ads budget for Toronto |
| `/services/web-development` | `/work/tms…`, `/work/nahj-hrms`, `/work/property-investment-platform` | project names |
| `/services/website-design` | `/insights/website-cost-toronto` | what a website costs in Toronto |
| `/services/cybersecurity` | `/insights/website-hacked` | what to do if your website is hacked |
| every article | its service page | service name + city |
| every case study | its service page + `/contact` | service name |
| home | `/work` (Results strip), newest article | "See our work" · article title |

## Build note

Add two Sanity-driven blocks to the service page template: "Related work" (work items whose service matches) and "From the blog" (posts in the service's category). Then the links above appear automatically as content is added.
