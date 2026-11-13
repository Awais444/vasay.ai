/**
 * One object per service. Drives the homepage list, mega menu, footer,
 * /services and every /services/[slug] page. Edit copy here.
 */

/** lucide-react icon names used on the "Sound familiar?" problem cards. */
export type ProblemIconName =
  | "History"
  | "Copy"
  | "Shuffle"
  | "Smartphone"
  | "MousePointerClick"
  | "Signpost"
  | "Timer"
  | "Puzzle"
  | "Wrench"
  | "TrendingDown"
  | "MapPinOff"
  | "Filter"
  | "CalendarX"
  | "Clock"
  | "HeartCrack"
  | "Flame"
  | "MousePointer2"
  | "HelpCircle"
  | "Snowflake"
  | "BellOff"
  | "CalendarX2"
  | "Bug"
  | "DatabaseBackup"
  | "ShieldAlert";

export type ServiceIconName =
  | "Palette"
  | "LayoutTemplate"
  | "Code2"
  | "Search"
  | "Share2"
  | "Megaphone"
  | "Bot"
  | "ShieldCheck";

export type Service = {
  slug: string;
  /** lucide-react icon, reused in the mega menu, services list, heroes, cards and footer. */
  icon: ServiceIconName;
  title: string;
  tag: string;
  description: string;
  heroTitle: string;
  heroAccent: string;
  sub: string;
  problems: { icon: ProblemIconName; title: string; body: string }[];
  included: { title: string; body: string }[];
  deliverables: string[];
  process: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
  note?: string;
  extraList?: { title: string; items: string[] };
  seoTitle: string;
  seoDescription: string;
};

export const serviceList: Service[] = [
  {
    slug: "brand-identity",
    icon: "Palette",
    title: "Brand Identity",
    tag: "Look the part.",
    description:
      "Logo, colour, type and voice that make you instantly recognisable, packaged in a guide your whole team can use.",
    heroTitle: "A brand people",
    heroAccent: "remember.",
    sub: "For businesses and personal brands that have outgrown their look. We build an identity with a clear story behind it, and a system that keeps it consistent everywhere it shows up.",
    problems: [
      { icon: "History", title: "It looks outdated", body: "Your logo and visuals were fine years ago. Now they quietly tell customers you've stood still." },
      { icon: "Copy", title: "You blend in", body: "Put your website next to a competitor's and customers can't tell who's who." },
      { icon: "Shuffle", title: "Every designer does it differently", body: "No rules, so every flyer, post and ad looks like it came from a different company." },
    ],
    included: [
      { title: "Strategy & positioning", body: "Who you're for, what makes you different and how to say it." },
      { title: "Logo system", body: "Primary logo, secondary lockup and icon, built to work at any size." },
      { title: "Colour & typography", body: "A palette and type pairing that feel like you, with clear usage rules." },
      { title: "Voice & messaging", body: "Tone, key messages and taglines so your words sound as good as you look." },
      { title: "Social media kit", body: "Profile assets, post templates and story frames, ready to use." },
      { title: "Brand guidelines", body: "One document that keeps every designer and supplier on brand." },
    ],
    deliverables: [
      "Logo files in SVG, PNG and PDF (full colour, one colour and reversed)",
      "Brand guidelines PDF",
      "Business card and stationery design",
      "Editable social media templates",
      "Colour codes and font files for your team",
    ],
    process: [
      { title: "Discover", body: "A workshop on your business, audience and competitors, then a clear creative brief." },
      { title: "Concepts", body: "Two or three distinct directions, each shown in real-world mockups." },
      { title: "Refine", body: "We develop your chosen direction together, with unlimited revisions." },
      { title: "Handover", body: "Final files, guidelines and templates, organised and ready to use." },
    ],
    faqs: [
      { q: "How long does a brand identity take?", a: "Most projects take 4 to 6 weeks from workshop to final files. A logo refresh can be faster." },
      { q: "Can you refresh my logo instead of starting over?", a: "Yes. If your current logo has recognition worth keeping, we'll modernise it rather than replace it." },
      { q: "Do I own the final files?", a: "Yes. Once the project is paid, you own all final artwork and can use it however you like." },
      { q: "Do you also design for personal brands?", a: "Absolutely. Coaches, consultants, realtors and creators get the same strategic process as companies." },
    ],
    related: ["website-design", "social-media", "paid-ads"],
    seoTitle: "Brand Identity & Logo Design in Concord, ON | Smart Solutions",
    seoDescription:
      "Brand strategy, logo systems, colour, typography and brand guidelines for GTA businesses and personal brands. Look the part with Smart Solutions.",
  },
  {
    slug: "website-design",
    icon: "LayoutTemplate",
    title: "Website Design & UI/UX",
    tag: "First impressions.",
    description:
      "Conversion-focused design built on real user journeys, so visitors understand you in seconds and know exactly what to do next.",
    heroTitle: "Websites that turn visitors into",
    heroAccent: "customers.",
    sub: "Your website is often the first conversation a customer has with you. We design it around what they need to see, and what you need them to do.",
    problems: [
      { icon: "Smartphone", title: "It's broken on mobile", body: "Most of your visitors are on their phones, and your site makes them pinch and zoom." },
      { icon: "MousePointerClick", title: "Traffic, but no enquiries", body: "People visit, look around and leave without calling, booking or buying." },
      { icon: "Signpost", title: "Confusing navigation", body: "Visitors can't find what they came for, so they find a competitor instead." },
    ],
    included: [
      { title: "UX research & sitemap", body: "We map your customers' questions and plan every page around them." },
      { title: "Wireframes", body: "Page layouts agreed before any visual design, so structure comes first." },
      { title: "Custom UI design", body: "A unique look built from your brand, not a recycled template." },
      { title: "Mobile-first layouts", body: "Designed for phones first, then scaled up for tablet and desktop." },
      { title: "Conversion copy structure", body: "Headlines, sections and calls to action placed where they work." },
      { title: "Accessibility basics", body: "Readable contrast, clear focus states and sensible structure." },
    ],
    deliverables: [
      "Figma designs for every page, at mobile and desktop sizes",
      "A clickable prototype you can test and share",
      "A design system of colours, type, buttons and components",
      "Developer-ready specs and assets",
    ],
    process: [
      { title: "Discovery", body: "Goals, audience, competitors and analytics review, then a sitemap." },
      { title: "Wireframes", body: "Clear page layouts so we agree on structure and content flow." },
      { title: "Design", body: "Full visual design and a clickable prototype, refined with your feedback." },
      { title: "Handoff", body: "Organised files and specs, ready for our developers or yours." },
    ],
    faqs: [
      { q: "How long does website design take?", a: "Most marketing sites take 3 to 5 weeks of design, depending on the number of pages and the review rounds." },
      { q: "Do you write the copy too?", a: "We structure every page for conversion and can write the full copy, or polish what you already have." },
      { q: "Can you redesign my existing site?", a: "Yes. We'll keep what works, fix what doesn't and protect your existing search rankings." },
      { q: "Will I be able to update it myself?", a: "Yes. We design with editing in mind, and our development team sets you up with an easy content editor." },
    ],
    related: ["web-development", "brand-identity", "seo"],
    seoTitle: "Website Design & UI/UX in Concord, ON | Smart Solutions",
    seoDescription:
      "Mobile-first website design, wireframes, UX research and conversion-focused layouts for GTA businesses. Turn visitors into customers.",
  },
  {
    slug: "web-development",
    icon: "Code2",
    title: "Custom Web Development",
    tag: "Built to scale.",
    description:
      "Hand-built websites and web apps on modern frameworks: fast, accessible, easy to update and ready to grow with you.",
    heroTitle: "Fast, secure sites built",
    heroAccent: "to grow.",
    sub: "From marketing sites to booking systems and online stores, we build on solid foundations so your website keeps up with your business instead of holding it back.",
    problems: [
      { icon: "Timer", title: "It's slow", body: "Every extra second of loading time sends visitors back to Google." },
      { icon: "Puzzle", title: "It can't do what you need", body: "Bookings, payments or integrations feel impossible on your current platform." },
      { icon: "Wrench", title: "Updates break things", body: "Every plugin update is a gamble, and fixing it costs you time and money." },
    ],
    included: [
      { title: "Next.js, WordPress or Shopify", body: "The right platform for your goals, budget and team." },
      { title: "Bookings & payments", body: "Online booking, checkout and payment integrations that just work." },
      { title: "CRM integration", body: "Forms and leads flowing straight into GoHighLevel or your CRM." },
      { title: "Speed optimisation", body: "Lean code, optimised images and fast hosting for top Core Web Vitals." },
      { title: "Technical SEO setup", body: "Clean structure, metadata, schema and sitemaps from day one." },
      { title: "Hosting & maintenance", body: "Secure hosting, updates and backups handled for you." },
    ],
    deliverables: [
      "A live, fully tested website",
      "Admin training so your team can update content",
      "30 days of post-launch support",
      "Analytics and conversion tracking set up",
    ],
    process: [
      { title: "Plan", body: "Platform, features, integrations and timeline agreed in writing." },
      { title: "Build", body: "Development on a private staging site you can review at any time." },
      { title: "Test", body: "Speed, mobile, forms, browsers and accessibility checked before launch." },
      { title: "Launch", body: "Go live with redirects and tracking in place, then 30 days of support." },
    ],
    faqs: [
      { q: "Which platform should I use?", a: "WordPress suits content-heavy sites, Shopify suits online stores, and Next.js suits fast, custom builds. We'll recommend one based on your goals." },
      { q: "Will my Google rankings drop when we switch sites?", a: "Not if it's done right. We map and redirect every old URL and carry over your SEO setup." },
      { q: "Can you connect my site to GoHighLevel?", a: "Yes. Forms, bookings and chat can all feed directly into your GoHighLevel pipeline." },
      { q: "Do you offer ongoing maintenance?", a: "Yes. Monthly plans cover hosting, updates, backups, security monitoring and small content changes." },
    ],
    related: ["website-design", "cybersecurity", "ai-automation"],
    seoTitle: "Custom Web Development (Next.js, WordPress, Shopify) | Smart Solutions",
    seoDescription:
      "Fast, secure websites and web apps for GTA businesses. Next.js, WordPress and Shopify builds with bookings, payments and CRM integrations.",
  },
  {
    slug: "seo",
    icon: "Search",
    title: "SEO & Local Search",
    tag: "Get found.",
    description:
      "Technical SEO, content and Google Business Profile optimisation that puts you in front of people already searching for you.",
    heroTitle: "Show up when customers",
    heroAccent: "search.",
    sub: "When someone nearby searches for what you do, you should be one of the first names they see. We make that happen with a clear plan and honest reporting.",
    problems: [
      { icon: "TrendingDown", title: "Competitors rank above you", body: "They're not better than you. They're just easier for Google to understand." },
      { icon: "MapPinOff", title: "You're missing from the map", body: "You don't appear in the Google Maps pack, where local customers click first." },
      { icon: "Filter", title: "Traffic without leads", body: "You rank for the wrong searches, so visitors aren't ready to buy." },
    ],
    included: [
      { title: "SEO audit", body: "A full review of your site, rankings and competitors to find quick wins." },
      { title: "Keyword research", body: "The searches your customers actually use, ranked by intent and value." },
      { title: "On-page optimisation", body: "Titles, headings, content and internal links tuned for every key page." },
      { title: "Technical SEO", body: "Speed, indexing, schema and site structure fixed at the foundation." },
      { title: "Google Business Profile", body: "A complete, active profile that wins more map pack visibility." },
      { title: "Content & link building", body: "Helpful content and quality links that build real authority." },
    ],
    deliverables: [
      "A prioritised SEO audit and action plan",
      "Monthly ranking, traffic and lead report",
      "A content calendar",
      "An optimised Google Business Profile",
    ],
    note: "SEO compounds over time. Most businesses see steady movement within 3 to 6 months, and the gains keep building from there.",
    process: [
      { title: "Audit", body: "We benchmark where you stand today against the competitors you want to beat." },
      { title: "Fix foundations", body: "Technical, on-page and Google Business Profile fixes come first." },
      { title: "Content & authority", body: "New pages, articles and links that build relevance month after month." },
      { title: "Report & improve", body: "Clear monthly reporting, and we double down on what's working." },
    ],
    faqs: [
      { q: "How long until I see results?", a: "Technical and local fixes can show movement in 4 to 8 weeks. Competitive rankings usually take 3 to 6 months." },
      { q: "Can you guarantee a #1 ranking?", a: "No one honestly can. What we guarantee is a clear plan, real work every month and transparent reporting." },
      { q: "Do you do local SEO for multiple locations?", a: "Yes. We build location pages and optimise each Google Business Profile separately." },
      { q: "Do I need to write content?", a: "No. We handle research and writing, and you approve anything before it goes live." },
    ],
    related: ["web-development", "paid-ads", "social-media"],
    seoTitle: "SEO & Local Search Agency in Concord, ON | Smart Solutions",
    seoDescription:
      "SEO audits, keyword research, technical SEO and Google Business Profile optimisation for GTA businesses. Show up when customers search.",
  },
  {
    slug: "social-media",
    icon: "Share2",
    title: "Social Media & Content",
    tag: "Stay top of mind.",
    description:
      "A consistent content engine across Instagram, TikTok, LinkedIn and Facebook, planned, produced and published for you.",
    heroTitle: "Content that keeps you",
    heroAccent: "top of mind.",
    sub: "We plan, shoot, design and publish content across Instagram, Facebook, LinkedIn and TikTok, so you stay visible without it taking over your week.",
    problems: [
      { icon: "CalendarX", title: "Inconsistent posting", body: "You post three times in a week, then nothing for a month." },
      { icon: "Clock", title: "No time to create", body: "You know content matters, but running the business always comes first." },
      { icon: "HeartCrack", title: "Nobody engages", body: "Posts go out, but the likes, comments and enquiries don't come back." },
    ],
    included: [
      { title: "Content strategy", body: "Pillars, formats and platforms chosen around your audience and goals." },
      { title: "Monthly calendar", body: "A full month planned in advance, approved by you before anything posts." },
      { title: "Photo & video shoots", body: "On-location shoots that capture your team, work and personality." },
      { title: "Reels & short-form video", body: "Scroll-stopping vertical video edited for each platform." },
      { title: "Graphics & captions", body: "On-brand designs and captions written in your voice." },
      { title: "Community management", body: "Replies to comments and messages so no one is left waiting." },
    ],
    deliverables: [
      "Scheduled posts across your chosen platforms",
      "A monthly content calendar for approval",
      "Edited photos and short-form videos",
      "A monthly performance report",
    ],
    extraList: { title: "Platforms we manage", items: ["Instagram", "Facebook", "LinkedIn", "TikTok"] },
    process: [
      { title: "Strategy", body: "We define your audience, content pillars and posting rhythm." },
      { title: "Create", body: "Shoots, edits, graphics and captions, batched every month." },
      { title: "Publish", body: "Everything scheduled at the best times, with community replies handled." },
      { title: "Analyse", body: "A monthly report on reach, engagement and enquiries, then we adjust." },
    ],
    faqs: [
      { q: "How many posts do I get each month?", a: "It depends on your plan. Most clients get 12 to 20 posts plus stories and reels each month." },
      { q: "Do I need to be on camera?", a: "Not necessarily, but people connect with people. We'll make it easy and comfortable if you choose to be." },
      { q: "Do I approve posts before they go live?", a: "Yes. You review the full calendar in advance, and nothing is published without your approval." },
      { q: "Which platform should I focus on?", a: "The one your customers use most. For B2B that's often LinkedIn; for local and consumer brands, Instagram and TikTok." },
    ],
    related: ["brand-identity", "paid-ads", "seo"],
    seoTitle: "Social Media Management & Content Creation | Smart Solutions",
    seoDescription:
      "Content strategy, photo and video shoots, reels and community management on Instagram, Facebook, LinkedIn and TikTok for GTA brands.",
  },
  {
    slug: "paid-ads",
    icon: "Megaphone",
    title: "Paid Ads (Google · Meta · TikTok)",
    tag: "Google · Meta · TikTok",
    description:
      "Campaigns built around cost per lead, not vanity metrics. Constant testing, clear reporting, no wasted budget.",
    heroTitle: "Ads built around cost per",
    heroAccent: "lead.",
    sub: "We run Google, Meta and TikTok campaigns with one goal: more qualified leads for every dollar you spend. And we show you exactly where that money goes.",
    problems: [
      { icon: "Flame", title: "Wasted ad spend", body: "Budget goes out every month, and you're not sure what came back." },
      { icon: "MousePointer2", title: "Clicks, not customers", body: "Plenty of traffic, but very few calls, forms or sales." },
      { icon: "HelpCircle", title: "No idea what's working", body: "Reports full of impressions and jargon, with no link to revenue." },
    ],
    included: [
      { title: "Campaign strategy", body: "Channels, audiences, offers and budgets planned around your goals." },
      { title: "Google Search & PMax", body: "Search and Performance Max campaigns that capture ready-to-buy demand." },
      { title: "Meta ads", body: "Facebook and Instagram campaigns that build demand and retarget visitors." },
      { title: "TikTok ads", body: "Native-feeling short video ads that reach new audiences." },
      { title: "Creative & landing pages", body: "Ad copy, visuals and landing pages built to convert." },
      { title: "Conversion tracking", body: "Calls, forms and bookings tracked properly, so we optimise for leads." },
    ],
    deliverables: [
      "Fully built and tracked campaigns",
      "Ad creative and copy variations",
      "Dedicated landing pages where needed",
      "A clear monthly report on leads, cost per lead and return",
    ],
    note: "Ad spend is paid directly to Google, Meta or TikTok and is separate from our management fee. You always own your ad accounts.",
    process: [
      { title: "Research", body: "Audience, keyword and competitor research, plus tracking set up first." },
      { title: "Launch", body: "Campaigns go live with multiple ads and audiences to test." },
      { title: "Test", body: "We cut what doesn't work and move budget to what does, every week." },
      { title: "Scale", body: "Once cost per lead is proven, we grow budget with confidence." },
    ],
    faqs: [
      { q: "How much should I spend on ads?", a: "Many local businesses start between $1,500 and $5,000 a month in ad spend. We'll recommend a test budget for your market." },
      { q: "Is ad spend included in your fee?", a: "No. Ad spend is paid directly to the platforms. Our management fee is separate and clearly quoted." },
      { q: "How fast will I get leads?", a: "Google Search can bring leads within days. Meta and TikTok usually need 2 to 4 weeks of testing to optimise." },
      { q: "Who owns the ad accounts?", a: "You do. We work inside accounts in your name, so your data and history stay with you." },
    ],
    related: ["seo", "ai-automation", "website-design"],
    seoTitle: "Google, Meta & TikTok Ads Management | Smart Solutions",
    seoDescription:
      "Paid ads built around cost per lead. Google Search, Performance Max, Facebook, Instagram and TikTok campaigns with clear monthly reporting.",
  },
  {
    slug: "ai-automation",
    icon: "Bot",
    title: "Lead Gen & AI Automation",
    tag: "Never miss a lead.",
    description:
      "AI assistants and workflows that reply in seconds, qualify leads, book appointments and follow up automatically.",
    heroTitle: "Reply to every lead in",
    heroAccent: "seconds.",
    sub: "The business that replies first usually wins the job. We set up AI and automation that respond instantly, follow up consistently and fill your calendar, day or night.",
    problems: [
      { icon: "Snowflake", title: "Leads go cold", body: "By the time someone calls back, the customer has already booked elsewhere." },
      { icon: "BellOff", title: "Follow-up gets forgotten", body: "Manual follow-up depends on someone remembering, and on a busy week no one does." },
      { icon: "CalendarX2", title: "No-shows", body: "Booked appointments don't show up, and that time is gone for good." },
    ],
    included: [
      { title: "Instant SMS & email replies", body: "Every new lead gets a personal reply within seconds." },
      { title: "AI chat assistant", body: "Answers questions and qualifies leads on your website, 24/7." },
      { title: "Follow-up sequences", body: "Automatic texts and emails that nurture leads until they're ready." },
      { title: "Booking & reminders", body: "Leads book themselves in, and reminders cut no-shows." },
      { title: "Review requests", body: "Happy customers are asked for a Google review at the right moment." },
      { title: "GoHighLevel pipeline", body: "Every lead tracked in one clear CRM pipeline your team can use." },
    ],
    deliverables: [
      "A fully set-up automation system in GoHighLevel",
      "AI assistant trained on your services and FAQs",
      "Follow-up, reminder and review workflows",
      "Team training and a simple how-to guide",
    ],
    process: [
      { title: "Map your funnel", body: "We trace every way leads reach you and where they currently drop off." },
      { title: "Build automations", body: "Replies, sequences, booking and pipeline built around your process." },
      { title: "Test", body: "Every path tested end to end before a real lead ever sees it." },
      { title: "Optimise", body: "We review response, booking and show-up rates monthly and improve them." },
    ],
    faqs: [
      { q: "Will the AI sound robotic?", a: "No. We write and train it in your voice, and it hands over to a person whenever it should." },
      { q: "Do I need GoHighLevel already?", a: "No. We can set up your account, or connect to the tools you already use." },
      { q: "Does it work with my existing website and ads?", a: "Yes. It connects to your forms, ads, chat and phone, wherever your leads come from." },
      { q: "How long does setup take?", a: "Most systems are live within 2 to 4 weeks, depending on how many workflows you need." },
    ],
    related: ["paid-ads", "web-development", "seo"],
    seoTitle: "Lead Generation & AI Automation (GoHighLevel) | Smart Solutions",
    seoDescription:
      "Instant lead replies, AI chat, follow-up sequences, booking and reminders in GoHighLevel. Reply to every lead in seconds with Smart Solutions.",
  },
  {
    slug: "cybersecurity",
    icon: "ShieldCheck",
    title: "Cybersecurity & Data Protection",
    tag: "Stay protected.",
    description:
      "Hardening, monitoring, backups and malware clean-up so your site and customer data stay protected.",
    heroTitle: "Keep your site and data",
    heroAccent: "safe.",
    sub: "A hacked website can cost you customers, rankings and trust overnight. We lock it down, watch it around the clock and keep backups ready, so you can focus on business.",
    problems: [
      { icon: "Bug", title: "Hacked or spammed", body: "Strange pages appear in Google, or your site sends visitors somewhere else." },
      { icon: "DatabaseBackup", title: "No backups", body: "If something went wrong today, you'd have nothing to restore from." },
      { icon: "ShieldAlert", title: "Slow or flagged unsafe", body: "Browsers warn visitors away, or the site crawls for no clear reason." },
    ],
    included: [
      { title: "Risk assessment", body: "A review of your site, hosting, logins and plugins for weak spots." },
      { title: "Website hardening", body: "Locked-down logins, permissions, updates and firewall rules." },
      { title: "Malware scan & clean-up", body: "Infections found, removed and blacklist warnings cleared." },
      { title: "SSL & security headers", body: "Encrypted connections and modern browser protections in place." },
      { title: "Automated backups", body: "Daily off-site backups you can restore from quickly." },
      { title: "Uptime monitoring", body: "Alerts the moment your site goes down, so we can act fast." },
    ],
    deliverables: [
      "A written security report with findings and fixes",
      "A monitoring dashboard for uptime and security",
      "Automated off-site backups",
      "A clean bill of health for Google and browsers",
    ],
    extraList: {
      title: "Warning signs your site may be hacked",
      items: ["Unexpected redirects", "Unknown admin users", "Spam pages in Google results", "Sudden slowdowns"],
    },
    process: [
      { title: "Assess", body: "We scan and review your site, hosting and access to find every risk." },
      { title: "Secure", body: "Clean-up, hardening, SSL, headers and backups put in place." },
      { title: "Monitor", body: "Ongoing scanning and uptime alerts, around the clock." },
      { title: "Report", body: "A clear monthly report on threats blocked and actions taken." },
    ],
    faqs: [
      { q: "My site is hacked right now. Can you help?", a: "Yes. Call us. We prioritise active infections, clean the site and help clear browser and Google warnings." },
      { q: "Do you only work on WordPress?", a: "No. We secure WordPress, Shopify, custom builds and most common hosting setups." },
      { q: "How often are backups taken?", a: "Daily by default, stored off-site, with more frequent backups available for busy stores." },
      { q: "Does this help with PIPEDA?", a: "Good security practices support your PIPEDA obligations to protect personal information. We'll explain where you stand in plain terms." },
    ],
    related: ["web-development", "website-design", "ai-automation"],
    seoTitle: "Website Security, Malware Removal & Backups | Smart Solutions",
    seoDescription:
      "Website hardening, malware clean-up, SSL, automated backups and uptime monitoring for GTA businesses. Keep your site and data safe.",
  },
];

export const getService = (slug: string) => serviceList.find((s) => s.slug === slug);
export const serviceHref = (slug: string) => `/services/${slug}`;
