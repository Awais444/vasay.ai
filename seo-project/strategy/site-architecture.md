# Site architecture and page plan (step 7)

Date: 2026-11-24. Built from the topical map, the clusters and the toolkit's local-business playbook (service pages first; place pages only with real substance). Every URL is listed in `url-map.csv`.

## Today (17 URLs in the sitemap)

Home, `/services` + 8 service pages, `/about`, `/contact`, `/insights` + 1 article + 1 category + 1 author, privacy, terms. Navigation: Services (mega menu), Work (`/#work`), Process (`/#process`), About, Insights, Contact.

**Problems found**

1. **Work has no pages of its own.** "Work" in the menu jumps to a home page section, and each card links to a service page. Case studies (the strongest proof, and table stakes for competitors) cannot rank or be linked to.
2. **Address conflict.** The brief says service-area business with a hidden address, but the footer, contact page and Organization schema show 3300 Hwy 7, Floor 6. The site and the Business Profile must match. Two options for the owner: (a) keep the address public everywhere, including the Business Profile; (b) hide it everywhere and show "Serving the GTA from Concord, ON". **Recommendation: (a)**: it is a real staffed office, and a public address helps the map pack near Concord and Vaughan (`local/01`, `[G]` relevance-distance-prominence). **Decided 2026-11-24: (a) public.** No site change needed; the Business Profile must show the same address.
3. **One blog category** (AI automation) and one article; categories for the other services do not exist yet, which is fine until articles exist.

## Target structure

```
/                                   home (brand + all services, proof, CTA)
/services                           hub: all 8 services
  /services/<service>               8 pages: one cluster each (keep URLs)
/work                               NEW hub: all case studies, filter by service
  /work/<slug>                      NEW case study pages
/insights                           blog hub
  /insights/<slug>                  articles (outer topics)
  /insights/category/<service>      one category per service, created with the first article in it
  /insights/author/<slug>           author pages
/about                              team, leadership, story
/contact                            form, phone/WhatsApp, area served
/privacy-policy, /terms             legal
```

**No city pages now.** Results for Vaughan, Toronto, Mississauga and Markham are the same directory set (step 2), so the city goes in the service page copy, title and schema `areaServed`. Revisit a city page only where there is real local work to show (doorway-page rule, `google/01`, `[RISK]` if templated).

## Page decisions

| URL | Decision | Why |
|---|---|---|
| `/` | improve | add review badges and a "Results" strip linking to `/work/*` |
| `/services` | keep | hub works; link to `/work` |
| `/services/seo` | improve | add serik.ca SEO case block + link to `/work/serik-seo` |
| `/services/paid-ads` | improve | add serik.ca Google Ads case block |
| `/services/ai-automation` | improve | priority 1 open field: Canadian detail, CASL, cost range, example workflow |
| `/services/web-development` | improve | link TMS, HRMS, property platform case studies |
| `/services/website-design` | improve | portfolio strip |
| `/services/social-media` | keep | update later (month 4) |
| `/services/brand-identity` | keep | |
| `/services/cybersecurity` | improve (title) | keep URL; retitle around "website security" for small business |
| `/about` | keep | founders + team done |
| `/contact` | improve | area-served list with the 24 cities; address per decision above |
| `/insights/what-is-ai-lead-follow-up` | keep | links to `/services/ai-automation` |
| `/work` + 5 case studies | **new** | proof pages: serik.ca SEO, serik.ca Ads, TMS, Nahj HRMS, property platform |
| 12 planned articles | **new** | per topical map, 2 a month |

## Navigation changes

- Main menu "Work" → `/work` (page), not `/#work`.
- Footer: add "Areas we serve" line (city list, plain text, no city links until city pages exist).
- Each service page: "Related work" (case studies) and "From the blog" (articles in that service's category).

## Build notes (for when the code work starts)

- `/work/[slug]` can reuse the existing Sanity `workItem` documents: add body, client, challenge, what we did, results (real numbers only), service reference and slug. `show` toggle already exists.
- Add `/work/*` to the sitemap and breadcrumbs; schema: `CreativeWork` or `Article` with `about` → the Service.
