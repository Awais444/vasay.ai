/**
 * Long-form, answer-first content for each service page (SEO + AEO).
 * - `h1Keyword` is the pill at the top of the H1 (the page's primary keyword phrase).
 * - `definition` is the "What is X?" snippet answer engines quote: keep it 1–2 plain sentences.
 * - `guide` sections open with a direct 40–60 word answer, then detail. Inline links use [text](/path).
 * - Numbers only where the business has confirmed them elsewhere on the site. Pricing is deliberately
 *   not published: TODO add "starting from" prices here if you decide to show them.
 * Update `updated` whenever a page's content changes (shown on the page + dateModified in schema).
 */

export type GuideSection = { q: string; a: string[] };
export type Comparison = { title: string; intro: string; head: [string, string, string]; rows: [string, string, string][] };
export type ServiceGuide = {
  h1Keyword: string;
  definition: { q: string; a: string };
  forWho: string[];
  guide: GuideSection[];
  comparison?: Comparison;
  moreFaqs: { q: string; a: string }[];
  updated: string;
};

const UPDATED = "2026-11-14";

export const serviceGuides: Record<string, ServiceGuide> = {
  "brand-identity": {
    h1Keyword: "Brand identity design in Toronto & the GTA",
    definition: {
      q: "What is brand identity?",
      a: "Brand identity is the complete visual and verbal system that makes a business recognisable: its logo, colours, typography, imagery and tone of voice, plus the rules for using them. A strong identity makes you look consistent everywhere, from your website to your trucks.",
    },
    forWho: [
      "Established GTA businesses whose look no longer matches the quality of their work",
      "New businesses that want to launch with a professional, consistent brand",
      "Personal brands: coaches, consultants, realtors and creators",
      "Companies about to invest in a new website or advertising and want the brand right first",
    ],
    guide: [
      {
        q: "What does a branding agency in Toronto actually deliver?",
        a: [
          "A branding agency delivers a strategy and a system, not just a logo. You get positioning (who you're for and why you're different), a logo suite, colour palette, typography, voice and messaging, and a brand guidelines document so every designer, printer and employee applies it the same way.",
          "At Smart Solutions the strategy comes first. We run a discovery workshop on your business, audience and competitors, then design two or three distinct directions shown in real mockups: signage, social posts, your website header. Your chosen direction is refined with unlimited revisions and handed over with print-ready and web-ready files.",
        ],
      },
      {
        q: "How long does a brand identity take?",
        a: [
          "Most brand identity projects take 4 to 6 weeks from the first workshop to final files. A logo refresh that keeps your existing recognition can be faster.",
          "The timeline depends mainly on how quickly feedback comes back between rounds and how many applications you need designed (stationery, vehicle graphics, social templates, packaging).",
        ],
      },
      {
        q: "How much does branding cost?",
        a: [
          "Branding is quoted per project after a free strategy call, because the scope varies widely: a logo refresh for a sole proprietor is a very different job from a full identity system for a multi-location company.",
          "The main cost drivers are the depth of strategy work, the number of logo variations and brand applications, and whether you need copywriting for taglines and key messages. You'll get a fixed, written quote before any work starts.",
        ],
      },
      {
        q: "Why does a consistent brand matter for marketing?",
        a: [
          "Consistency builds recognition, and recognition builds trust. When your website, Google Business Profile, social media and ads all look and sound the same, customers remember you and choose you with less hesitation.",
          "A clear identity also makes every other channel cheaper to run. [Website design](/services/website-design), [social media content](/services/social-media) and [paid ads](/services/paid-ads) all move faster when the colours, type, imagery and voice are already decided.",
        ],
      },
    ],
    moreFaqs: [
      { q: "What's the difference between a logo and a brand identity?", a: "A logo is one mark. A brand identity is the whole system around it: colours, fonts, imagery, tone of voice and the guidelines that keep everything consistent." },
      { q: "What files will I receive?", a: "Logo files in SVG, PNG and PDF (full colour, one colour and reversed), a brand guidelines PDF, colour codes, font files and editable social media templates." },
    ],
    updated: UPDATED,
  },

  "website-design": {
    h1Keyword: "Web design company in Vaughan & Toronto",
    definition: {
      q: "What is conversion-focused web design?",
      a: "Conversion-focused web design plans every page around what visitors need to know and the one action you want them to take, such as calling, booking or buying. It combines UX research, clear structure, persuasive copy and mobile-first layouts, rather than starting from a template.",
    },
    forWho: [
      "Businesses with an outdated site that doesn't work well on phones",
      "Companies that get traffic but too few calls, bookings or sales",
      "Service businesses in Vaughan, Toronto and the GTA that rely on local enquiries",
      "Teams planning a rebrand who need the website to match",
    ],
    guide: [
      {
        q: "What does a web design company do?",
        a: [
          "A web design company plans, designs and (often) builds your website. At Smart Solutions design starts with UX research: we map your customers' questions, plan a sitemap, agree wireframes, then design a custom interface in your brand, mobile first.",
          "You receive Figma designs for every page at mobile and desktop sizes, a clickable prototype you can test, and a design system of colours, type and components. Our [web development](/services/web-development) team then builds it, or we hand developer-ready files to yours.",
        ],
      },
      {
        q: "How long does a website take?",
        a: [
          "Most marketing websites take 3 to 5 weeks of design, depending on the number of pages and review rounds. Development follows, so plan for the whole project in phases rather than a single deadline.",
          "The fastest projects have content and decisions ready early: who the site is for, the services to feature, and photos or brand assets. If you don't have a brand system yet, [brand identity](/services/brand-identity) work usually comes first.",
        ],
      },
      {
        q: "How much does website design cost in Toronto?",
        a: [
          "Website design is quoted per project after a free strategy call. The price depends on the number of unique page layouts, whether we write the copy, the complexity of features such as booking or e-commerce, and how much research and testing the project needs.",
          "You get a fixed, written quote that lists every page and deliverable, so there are no surprises halfway through.",
        ],
      },
      {
        q: "What makes a website convert visitors into customers?",
        a: [
          "Websites convert when visitors understand what you do within seconds and can easily take the next step. That means a clear headline, proof (reviews, results, credentials), simple navigation, fast loading on mobile and calls to action placed where people are ready to act.",
          "Design also affects search: page speed and Core Web Vitals, clear headings and good internal links help your [SEO](/services/seo). And once enquiries arrive, [AI automation](/services/ai-automation) makes sure every lead gets an instant reply.",
        ],
      },
    ],
    comparison: {
      title: "Custom design vs a template: which is right for you?",
      intro: "Templates can work for a quick start. Custom design pays off when the website needs to win business on its own.",
      head: ["", "Template site", "Custom design"],
      rows: [
        ["Look", "Shared with many other businesses", "Unique to your brand"],
        ["Structure", "Fixed by the template", "Planned around your customers' questions"],
        ["Conversion", "Generic calls to action", "Pages designed around one clear action"],
        ["Speed", "Often heavy with unused features", "Only what you need, built to load fast"],
        ["Best for", "Very early-stage or temporary sites", "Businesses that rely on the site for leads"],
      ],
    },
    moreFaqs: [
      { q: "Is the website designed for mobile?", a: "Yes. Every page is designed for phones first, then scaled up for tablet and desktop, because most visitors arrive on mobile." },
      { q: "Do you follow accessibility guidelines?", a: "We build in the basics from the start: readable contrast, clear focus states, sensible heading structure and descriptive links." },
    ],
    updated: UPDATED,
  },

  "web-development": {
    h1Keyword: "Custom web development in Toronto",
    definition: {
      q: "What is custom web development?",
      a: "Custom web development means building a website or web application to your exact requirements, on the platform that suits you (such as Next.js, WordPress or Shopify), instead of bending a template. It covers the front end people see, the content system you edit and integrations such as bookings, payments and your CRM.",
    },
    forWho: [
      "Businesses whose current site is slow, fragile or hard to update",
      "Companies that need online booking, payments or a customer portal",
      "Teams that want leads flowing straight into GoHighLevel or another CRM",
      "Online stores moving to, or growing on, Shopify",
    ],
    guide: [
      {
        q: "Which platform is best: Next.js, WordPress or Shopify?",
        a: [
          "WordPress suits content-heavy sites that marketing teams update often, Shopify suits online stores, and Next.js suits fast, custom builds with complex features or integrations. The right choice depends on your goals, budget and who will maintain the site.",
          "We recommend a platform after the planning call, and put it in writing with the features, integrations and timeline agreed.",
        ],
      },
      {
        q: "How long does custom web development take?",
        a: [
          "Timelines depend on the platform, the number of templates and the integrations involved. Every project follows the same four stages: plan, build on a private staging site you can review at any time, test, and launch with redirects and tracking in place, followed by 30 days of support.",
          "If design isn't done yet, we start with [website design](/services/website-design) so development builds from approved layouts.",
        ],
      },
      {
        q: "Will my Google rankings drop when I switch to a new site?",
        a: [
          "Not if the migration is done properly. We map every old URL to its new address with 301 redirects, carry over titles, descriptions and structured data, and submit the new sitemap to Google Search Console.",
          "Technical SEO is part of every build: clean URLs, metadata, schema markup, XML sitemaps and fast Core Web Vitals. It's the foundation our [SEO service](/services/seo) builds on.",
        ],
      },
      {
        q: "What does website maintenance include?",
        a: [
          "Monthly maintenance covers secure hosting, software and plugin updates, daily off-site backups, uptime and security monitoring, and small content changes. It prevents the most common problems: broken pages after updates, slow loading and hacked sites.",
          "For sites that handle customer data or payments, add [website security](/services/cybersecurity) for malware scanning, a firewall and incident response.",
        ],
      },
    ],
    comparison: {
      title: "Next.js vs WordPress vs Shopify at a glance",
      intro: "Each platform is the right answer for some businesses. Here's how they compare on the things that usually decide it.",
      head: ["", "Best for", "Watch out for"],
      rows: [
        ["Next.js", "Fast custom sites, complex features, integrations", "Needs a developer for structural changes"],
        ["WordPress", "Content-heavy sites edited often by marketing teams", "Plugin updates need care and maintenance"],
        ["Shopify", "Online stores, products, payments and inventory", "Monthly platform and app fees"],
      ],
    },
    moreFaqs: [
      { q: "Can you build online booking and payments?", a: "Yes. We integrate online booking, checkout and payment providers, and connect them to your calendar and CRM." },
      { q: "Do I own my website and code?", a: "Yes. The site, content and code are yours, hosted in accounts in your name or transferred to you at handover." },
    ],
    updated: UPDATED,
  },

  seo: {
    h1Keyword: "SEO services in Vaughan & local SEO in Toronto",
    definition: {
      q: "What is local SEO?",
      a: "Local SEO is the work of making a business appear when nearby customers search on Google, both in the map results (the local pack) and in the regular listings. It combines an optimised Google Business Profile, a technically sound website, location-relevant content, reviews and local links.",
    },
    forWho: [
      "Service businesses in Vaughan, Concord, Toronto and the GTA that depend on local customers",
      "Businesses missing from the Google Maps pack for their main services",
      "Companies with traffic that doesn't turn into enquiries",
      "Multi-location businesses that need each location to rank",
    ],
    guide: [
      {
        q: "What do SEO services include?",
        a: [
          "Professional SEO covers four areas: technical SEO (speed, Core Web Vitals, indexing, schema markup), on-page optimisation (titles, headings, content and internal links), local SEO (Google Business Profile, reviews, citations) and authority (helpful content and quality links).",
          "We start with an audit and keyword research based on the searches your customers actually use, fix the foundations first, then build content and authority month after month. You get clear monthly reporting from Google Search Console and Analytics.",
        ],
      },
      {
        q: "How long does SEO take to work?",
        a: [
          "Technical and local fixes can show movement in 4 to 8 weeks. Competitive rankings usually take 3 to 6 months, and the gains keep compounding after that because content and links keep working without ongoing ad spend.",
          "No one can honestly guarantee a #1 ranking. What you should expect is a clear plan, real work every month and transparent reporting on rankings, traffic and enquiries.",
        ],
      },
      {
        q: "How much does SEO cost in Toronto?",
        a: [
          "SEO is usually a monthly service, quoted after an audit of your site and competitors. The cost depends on how competitive your market is, how many services and locations you need to rank for, and how much content and link building it will take.",
          "We'll show you what the audit found and what we'd do first before you commit to anything.",
        ],
      },
      {
        q: "How do I get into the Google Maps local pack?",
        a: [
          "The local pack is driven by relevance, distance and prominence. You improve your chances with a complete, accurate Google Business Profile (categories, services, photos, posts), consistent name, address and phone number across the web, a steady flow of genuine reviews, and location pages on your website.",
          "Your website's speed and structure matter too. A fast, well-structured site from our [web development](/services/web-development) team gives local SEO a stronger base.",
        ],
      },
    ],
    comparison: {
      title: "SEO vs Google Ads: which first?",
      intro: "Most businesses benefit from both. The right starting point depends on how quickly you need leads and how long you can invest.",
      head: ["", "SEO", "Google Ads"],
      rows: [
        ["Speed", "Builds over 3 to 6 months", "Leads can start within days"],
        ["Ongoing cost", "Monthly work; no cost per click", "You pay for every click"],
        ["When you stop", "Rankings keep working for a while", "Leads stop when the budget stops"],
        ["Trust", "Organic results earn more clicks", "Clearly labelled as ads"],
        ["Best for", "Long-term, compounding growth", "Immediate demand and testing offers"],
      ],
    },
    moreFaqs: [
      { q: "SEO or Google Ads: which should I start with?", a: "If you need leads this month, start with [Google Ads](/services/paid-ads) and build SEO alongside it. If you can invest for 3 to 6 months, SEO usually delivers the lower cost per lead over time." },
      { q: "Will you report on results?", a: "Yes. Every month you get a plain-English report on rankings, traffic, Google Business Profile activity and enquiries, plus what we're doing next." },
    ],
    updated: UPDATED,
  },

  "social-media": {
    h1Keyword: "Social media management agency in Toronto",
    definition: {
      q: "What is social media management?",
      a: "Social media management is planning, creating, publishing and improving a brand's content on platforms such as Instagram, Facebook, LinkedIn and TikTok. It includes strategy, a content calendar, design, short-form video, captions, community replies and monthly reporting.",
    },
    forWho: [
      "Business owners who know social matters but have no time to post consistently",
      "Brands whose posts look different every time and don't sound like them",
      "Local businesses that want more enquiries from Instagram and Facebook",
      "B2B companies building authority on LinkedIn",
    ],
    guide: [
      {
        q: "What does a social media management agency do?",
        a: [
          "A social media agency plans what to post, creates it and publishes it on schedule. We start with strategy (audience, platforms and content pillars), build a monthly calendar for your approval, then design posts, edit reels and stories, write captions and publish.",
          "Every month we review what performed, report on reach, engagement and enquiries, and adjust the plan. Nothing goes live without your approval.",
        ],
      },
      {
        q: "How many posts should a business publish?",
        a: [
          "Consistency matters more than volume. Most of our clients publish 12 to 20 posts a month plus stories and reels, depending on their plan and platforms.",
          "Three good posts a week, every week, will beat a burst of daily posts that stops after a month. That's why we plan in monthly calendars.",
        ],
      },
      {
        q: "How much does social media management cost?",
        a: [
          "Social media management is a monthly service quoted on the number of platforms, posts and videos you need, and whether we film on location. After a free strategy call you'll get a plan with a clear monthly price.",
          "Many businesses pair organic social with [paid social ads](/services/paid-ads) to reach new audiences faster.",
        ],
      },
      {
        q: "How do I get more engagement on social media?",
        a: [
          "Engagement comes from content that is useful, entertaining or personal, published consistently in a recognisable style. Short-form video, real people and replies to comments tend to outperform polished but generic graphics.",
          "A clear [brand identity](/services/brand-identity) makes your posts recognisable in the feed, and linking social to a fast [website](/services/website-design) turns attention into enquiries.",
        ],
      },
    ],
    moreFaqs: [
      { q: "Do you reply to comments and messages?", a: "Community management can be included in your plan. We reply in your voice and pass enquiries to you quickly." },
      { q: "Will you create videos and reels?", a: "Yes. Short-form video is part of most plans, from editing your footage to planning and filming shoots." },
    ],
    updated: UPDATED,
  },

  "paid-ads": {
    h1Keyword: "Google Ads agency in Toronto & Meta ads management",
    definition: {
      q: "What is paid ads management?",
      a: "Paid ads management is planning, building, running and optimising advertising campaigns on platforms such as Google Ads, Meta (Facebook and Instagram) and TikTok. It covers strategy, targeting, ad creative, landing pages, conversion tracking, budget control and reporting.",
    },
    forWho: [
      "Businesses that need enquiries now, not in six months",
      "Companies spending on ads without knowing which campaigns bring customers",
      "Local service businesses in Toronto and the GTA competing on Google Search",
      "Brands launching an offer or testing a new market",
    ],
    guide: [
      {
        q: "What does a Google Ads agency do?",
        a: [
          "A Google Ads agency researches what your customers search, builds campaigns and ads around those searches, sets up conversion tracking, and adjusts bids, keywords and budgets every week so your spend goes to the clicks that turn into leads.",
          "We manage Google Search, Performance Max, Meta (Facebook and Instagram) and TikTok, inside ad accounts you own. Every month you get a clear report connecting spend to real enquiries.",
        ],
      },
      {
        q: "How much should a business spend on Google Ads?",
        a: [
          "Many local businesses start between $1,500 and $5,000 a month in ad spend, paid directly to the platforms. We'll recommend a test budget based on the cost of clicks in your market and how many leads you need.",
          "Ad spend is separate from our management fee, which is quoted clearly after a free strategy call.",
        ],
      },
      {
        q: "How fast do paid ads bring leads?",
        a: [
          "Google Search ads can bring leads within days of launch because they reach people already searching for your service. Meta and TikTok ads usually need 2 to 4 weeks of testing to find the right audiences and creative.",
          "Results depend heavily on the landing page. A page built for the ad, with one clear action, often converts far better than a homepage. Our [website design](/services/website-design) team builds those pages.",
        ],
      },
      {
        q: "Google Ads or Meta ads: which is better?",
        a: [
          "Google Ads captures existing demand: people actively searching for what you sell. Meta ads create demand by showing your offer to people likely to want it. Service businesses usually start with Google Search; brands with a visual product or a strong offer often grow fastest on Meta.",
          "Once leads arrive, [AI automation](/services/ai-automation) replies within seconds, so the leads you paid for don't go cold.",
        ],
      },
    ],
    comparison: {
      title: "Google Ads vs Meta ads",
      intro: "Both can work well. They reach people at different moments, so they suit different goals.",
      head: ["", "Google Ads", "Meta ads"],
      rows: [
        ["Reaches people", "Actively searching for a service", "Scrolling Facebook and Instagram"],
        ["Strength", "High intent, fast leads", "Visual storytelling and reach"],
        ["Typical start", "Search campaigns on core services", "Testing creative and audiences"],
        ["Best for", "Urgent and local services", "Offers, products and brand awareness"],
      ],
    },
    moreFaqs: [
      { q: "Do you set up conversion tracking?", a: "Yes. We track calls, form submissions and bookings so every campaign is measured on leads, not just clicks." },
      { q: "Is there a minimum contract?", a: "We'll discuss terms on the strategy call and put them in writing before anything starts." },
    ],
    updated: UPDATED,
  },

  "ai-automation": {
    h1Keyword: "AI lead generation & marketing automation in Canada",
    definition: {
      q: "What is AI lead follow-up?",
      a: "AI lead follow-up is software that replies to new enquiries within seconds, by text, email or chat, answers common questions in your voice, and books qualified leads into your calendar. It runs 24/7 and hands the conversation to a person whenever it should.",
    },
    forWho: [
      "Businesses losing leads because nobody replies fast enough",
      "Teams doing follow-up, reminders and review requests by hand",
      "Companies that want every lead, call and booking tracked in one CRM",
      "Businesses already running ads that want more booked appointments from them",
    ],
    guide: [
      {
        q: "What can marketing automation do for a small business?",
        a: [
          "Marketing automation handles the repetitive steps between a new lead and a booked customer: instant replies, follow-up sequences, appointment booking and reminders, missed-call text-back, review requests and pipeline updates in your CRM.",
          "We build these systems on GoHighLevel or connect to the tools you already use, and write every message in your voice so it never sounds robotic.",
        ],
      },
      {
        q: "What is a GoHighLevel agency?",
        a: [
          "A GoHighLevel agency sets up and manages GoHighLevel, an all-in-one platform for CRM, pipelines, calendars, SMS and email, forms, chat and automation. A good agency designs the workflows around how your business actually sells, not just the software settings.",
          "You don't need GoHighLevel already. We can set up your account, or connect your existing website, [ads](/services/paid-ads) and phone so every lead lands in one place.",
        ],
      },
      {
        q: "How long does it take to set up automation?",
        a: [
          "Most automation systems are live within 2 to 4 weeks, depending on how many workflows and integrations you need. We map your current lead process, build and test each workflow, then train your team.",
          "Automation works best with a steady flow of leads, so many clients combine it with [SEO](/services/seo) or paid ads.",
        ],
      },
      {
        q: "Will AI replace my sales team?",
        a: [
          "No. AI handles the first response, routine questions and scheduling, so your team spends its time on qualified conversations. You set the rules for when a lead is handed to a person, and you can see every message in the CRM.",
          "The goal is simple: no lead waits hours for a reply, and nobody on your team has to remember to follow up.",
        ],
      },
    ],
    moreFaqs: [
      { q: "Can the AI book appointments directly?", a: "Yes. It can offer available times from your calendar, book the appointment and send reminders to reduce no-shows." },
      { q: "Is my customer data secure?", a: "Data stays in your own accounts. We follow good security practice and can review your setup alongside our [website security](/services/cybersecurity) service." },
    ],
    updated: UPDATED,
  },

  cybersecurity: {
    h1Keyword: "Website security services for small businesses in Toronto",
    definition: {
      q: "What is website security?",
      a: "Website security is the set of measures that keep a site and its customer data safe from hackers and malware: secure hosting, SSL, a firewall, software updates, malware scanning, off-site backups and a plan to respond quickly if something goes wrong.",
    },
    forWho: [
      "Businesses whose website has been hacked or shows spam pages on Google",
      "Sites with no recent, tested backups",
      "Online stores and sites that collect customer information",
      "Businesses whose browser or Google search results warn that the site is unsafe",
    ],
    guide: [
      {
        q: "What do website security services include?",
        a: [
          "Website security services combine prevention, monitoring and recovery: a security audit, a web application firewall, malware scanning, software and plugin updates, SSL, daily off-site backups and a tested restore plan.",
          "If something does go wrong, incident response means the site is cleaned, secured and restored quickly, and Google and browser warnings are cleared.",
        ],
      },
      {
        q: "What should I do if my website is hacked?",
        a: [
          "Act quickly: change all passwords, contact your developer or a security specialist, and don't delete files yourself, which can make clean-up harder. A hacked site can redirect visitors, send spam or get flagged by Google, which hurts both trust and rankings.",
          "We prioritise active infections, clean the site, close the hole that let attackers in, and help clear browser and Google warnings. Then we put monitoring in place so it doesn't happen again.",
        ],
      },
      {
        q: "How often should a website be backed up?",
        a: [
          "Most business websites should be backed up daily and stored off-site, separate from the hosting server. Busy online stores often need more frequent backups. A backup only counts if it has been tested: we check that restores work.",
          "Backups are also part of our [website maintenance](/services/web-development) plans.",
        ],
      },
      {
        q: "Does website security help with PIPEDA and SEO?",
        a: [
          "Yes, on both fronts. Protecting personal information supports your obligations under PIPEDA, Canada's private-sector privacy law. And Google warns users about hacked or unsafe sites, which can wipe out the traffic your [SEO](/services/seo) work has built.",
          "A secure, fast site is good for customers, compliance and rankings at the same time.",
        ],
      },
    ],
    moreFaqs: [
      { q: "Do you provide SSL certificates?", a: "Yes. We make sure your site runs fully on HTTPS with a valid SSL certificate and no mixed-content warnings." },
      { q: "Can you monitor my site continuously?", a: "Yes. Monitoring covers uptime, malware and suspicious changes, with alerts so problems are fixed before customers notice." },
    ],
    updated: UPDATED,
  },
};

export const getGuide = (slug: string) => serviceGuides[slug];
