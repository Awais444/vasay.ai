import { isDev } from "./env";

import { serviceList } from "./services";

/**
 * ALL site copy and data lives here. Edit text in this file only;
 * components read from it and never hard-code copy.
 */

export const site = {
  name: "Smart Solutions",
  poweredBy: "Powered by VASAY.AI",
  legalName: "Smart Solutions Inc.",
  domain: "vasay.ai",
  url: "https://vasay.ai",
  tagline: "Smarter marketing. Real business growth.",
  description:
    "Smart Solutions, powered by VASAY.AI, is a full-service digital marketing agency in Concord, Ontario. Brand, websites, SEO, paid ads, content and AI automation, built to work together.",
  phone: "(647) 559-3900",
  phoneHref: "tel:+16475593900",
  address: {
    street: "3300 Hwy 7, Floor 6",
    city: "Concord",
    region: "ON",
    postalCode: "L4K 4M3",
    country: "CA",
    full: "3300 Hwy 7, Floor 6, Concord, ON L4K 4M3",
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=3300+Hwy+7+Floor+6+Concord+ON+L4K+4M3",
  },
  // TODO: confirm real business hours.
  hours: "Mon–Fri, 9am–6pm",
  copyright: "© 2026 Smart Solutions Inc. All rights reserved.",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
    { label: "X", href: "https://x.com/" },
    { label: "Pinterest", href: "https://pinterest.com/" },
  ],
};

export const nav = {
  links: [
    { label: "Services", href: "/services", mega: true },
    { label: "Work", href: "/#work" },
    { label: "Process", href: "/#process" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  /** Mobile menu only: shown after the main links in a smaller style. */
  mobileExtra: [{ label: "FAQ", href: "/#faq" }],
  footer: [
    { label: "About", href: "/about" },
    { label: "Work", href: "/#work" },
    { label: "Process", href: "/#process" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  status: "Taking new clients",
  cta: { label: "Let's talk", href: "/contact" },
  promo: {
    pill: "Free · 30 min",
    title: "Not sure where to start?",
    cta: "Book a free strategy call",
    href: "/contact",
  },
};

export const hero = {
  badge: "15+ yrs",
  trust: "Growing brands on Google / Meta / TikTok / Instagram / LinkedIn",
  /** Shorter version for phones. */
  trustShort: "Google / Meta / TikTok",
  lines: ["Smarter marketing.", "Real business", "growth."],
  sub: "One team for your brand, website, content, ads and automation, built to work together so every dollar you spend turns into attention, leads and booked revenue.",
  primaryCta: { label: "Book a free strategy call", href: "#contact" },
  secondaryCta: { label: "See what we do", href: "#services" },
  checks: ["15+ years in the game", "No hidden fees", "Unlimited revisions"],
  chips: {
    lead: { title: "New lead", meta: "Replied in 8s" },
    ads: { title: "Google Ads", meta: "Campaign live" },
    brand: { title: "✦ Brand refresh" },
    chart: { title: "Leads this month" },
  },
};

export const marquee = [
  "Brand Identity",
  "Web Design",
  "SEO",
  "Google Ads",
  "Meta Ads",
  "TikTok Ads",
  "Content",
  "AI Automation",
  "Lead Generation",
  "Cybersecurity",
];

/** "Three Pillars" section, directly after the hero. Icons are lucide-react names. */
export const pillars = {
  eyebrow: "How we grow businesses",
  title: "Three things every business needs.",
  accent: "We do all three.",
  intro:
    "Most agencies do one piece. We connect all of them, so attention turns into leads and leads turn into booked revenue.",
  linkLabel: "Learn more",
  items: [
    {
      num: "01",
      icon: "Target",
      title: "Attract",
      body: "Get seen by the right people, in the right places.",
      points: ["Brand identity", "SEO & local search", "Paid ads & social"],
      href: "/services/seo",
    },
    {
      num: "02",
      icon: "MonitorSmartphone",
      title: "Convert",
      body: "Turn visitors into enquiries with a site built to sell.",
      points: ["Website design & UX", "Custom development", "Landing pages"],
      href: "/services/website-design",
    },
    {
      num: "03",
      icon: "Zap",
      title: "Automate",
      body: "Reply, follow up and book, without lifting a finger.",
      points: ["Instant AI replies", "Booking & reminders", "CRM & reviews"],
      href: "/services/ai-automation",
    },
  ] as const,
};

export const stats = [
  { value: 15, suffix: "+", label: "Years building brands" },
  { value: 5, suffix: "K+", label: "Projects delivered" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
];

export const manifesto =
  "Most businesses don't have a marketing problem. They have a connection problem. The website doesn't match the brand, the ads don't match the website, and leads go cold while nobody follows up. We fix the whole chain, so strategy, creative and automation finally pull in the same direction.";

export const servicesSection = {
  eyebrow: "Services",
  title: "Everything your growth needs,",
  accent: "under one roof.",
  intro: "Pick one service or the whole stack. Either way, it's planned to work with everything else.",
};

export const services = serviceList.map((s) => ({
  slug: s.slug,
  icon: s.icon,
  title: s.title,
  tag: s.tag,
  description: s.description,
  href: `/services/${s.slug}`,
}));

export const whyUs = {
  eyebrow: "Why Smart Solutions",
  title: "Built different,",
  accent: "on purpose.",
  intro:
    "Fifteen years of building brands taught us one thing: marketing works when every piece is connected. So we built a team that does all of it.",
  cta: { label: "Book a free strategy call", href: "#contact" },
  items: [
    {
      title: "One team, one strategy",
      body: "Brand, web, ads and automation planned together, so nothing gets lost between agencies.",
    },
    {
      title: "Reporting you can read",
      body: "Plain-English monthly reports focused on leads and revenue, not jargon.",
    },
    {
      title: "No hidden fees",
      body: "Clear scopes and transparent pricing. You know what you pay and what you get.",
    },
    {
      title: "AI that follows up for you",
      body: "Every lead gets an instant, personal reply, day or night, so none go cold.",
    },
  ],
};

export const process = {
  eyebrow: "How we work",
  title: "From first call to",
  accent: "compounding growth.",
  steps: [
    {
      num: "01",
      title: "Discover",
      time: "Week 1",
      body: "A free strategy call and a full audit of your brand, website, ads and funnel. We find exactly where attention and leads are leaking.",
      chips: ["Strategy call", "Website audit", "Competitor scan"],
    },
    {
      num: "02",
      title: "Plan",
      time: "Week 2",
      body: "A clear roadmap with priorities, timelines and the numbers we'll be measured on. No vague retainers, no surprises.",
      chips: ["Growth roadmap", "KPIs & targets", "Budget plan"],
    },
    {
      num: "03",
      title: "Build & Launch",
      time: "Weeks 3–6",
      body: "Design, development, content and campaigns go live together, connected to AI automation from day one.",
      chips: ["Website", "Campaigns", "Automation"],
    },
    {
      num: "04",
      title: "Grow",
      time: "Every month",
      body: "We test, report and optimise every month, doubling down on whatever brings booked revenue.",
      chips: ["Monthly report", "A/B tests", "Scale winners"],
    },
  ],
  cta: { label: "Start with step one", href: "#contact" },
};

export const workSection = {
  eyebrow: "Work",
  title: "Creative that",
  accent: "moves numbers.",
};

// Neutral category cards: no client names and no metrics.
// TODO: replace with real projects (client name, real image in /public/work/, and a real, verifiable result).
// When a real project is added, set `image` and optionally `result`.
export const work: {
  category: string;
  title: string;
  description: string;
  gradient: string;
  href: string;
  image?: string;
  result?: string;
}[] = [
  { category: "Brand + Website", title: "Brand and website, launched together", description: "A new identity and a conversion-focused site, built as one system.", gradient: "from-accent via-accent-bright to-accent-deep", href: "/services/website-design" },
  { category: "Google Ads", title: "Search campaigns built around cost per lead", description: "Search and Performance Max campaigns tracked to real enquiries.", gradient: "from-brand-orange via-brand-red to-accent-deep", href: "/services/paid-ads" },
  { category: "Social & Content", title: "A monthly content engine", description: "Shoots, reels and graphics planned and published every month.", gradient: "from-accent-deep via-accent to-brand-orange", href: "/services/social-media" },
  { category: "AI Automation", title: "Instant replies and automatic booking", description: "Every lead answered in seconds and followed up automatically.", gradient: "from-brand-black via-accent-deep to-accent", href: "/services/ai-automation" },
  { category: "SEO & Local Search", title: "Local search and Google Business Profile", description: "Technical fixes, content and a profile that earns map visibility.", gradient: "from-accent-bright via-accent to-brand-black", href: "/services/seo" },
  { category: "Brand Identity", title: "A complete brand system", description: "Logo, colour, type, voice and guidelines your team can use.", gradient: "from-brand-red via-brand-orange to-[#FFB37A]", href: "/services/brand-identity" },
];

export const testimonialsSection = {
  eyebrow: "Testimonials",
  title: "Clients who",
  accent: "stuck around.",
};

/**
 * TODO: these are DRAFT testimonials, not real client reviews. When a client approves a quote,
 * put in their real name and set approved: true.
 *
 * Visibility (computed below the list):
 * - Local development (`next dev`): every item shows, with no "Placeholder" label, for design review.
 * - Production builds: only approved items show (no label), and the whole section stays hidden
 *   until at least MIN_APPROVED_TESTIMONIALS items are approved.
 */
export type Testimonial = { quote: string; name: string; role: string; approved: boolean };

/** 10 drafts: the first 5 fill the top row, the last 5 the bottom row. */
export const testimonials: Testimonial[] = [
  {
    quote: "Our old logo didn't reflect who we'd become. Smart Solutions gave us a brand we're genuinely proud to put on everything, from our trucks to our invoices.",
    name: "Client name",
    role: "Brand Identity",
    approved: false,
  },
  {
    quote: "The new website finally looks like the company we are. Customers tell us it's easy to use, and we're getting enquiries through it every week.",
    name: "Client name",
    role: "Website Design",
    approved: false,
  },
  {
    quote: "They built online booking and payments right into our site and connected it to our CRM. What used to take phone calls now happens on its own.",
    name: "Client name",
    role: "Web Development",
    approved: false,
  },
  {
    quote: "We used to be invisible on Google Maps. Now people find us when they search in our area, and the phone rings more because of it.",
    name: "Client name",
    role: "SEO & Local Search",
    approved: false,
  },
  {
    quote: "Consistent posting was always the first thing we dropped. Now our content goes out every week and actually sounds like us.",
    name: "Client name",
    role: "Social Media & Content",
    approved: false,
  },
  {
    quote: "For the first time, I understand where my ad budget goes. The monthly report is clear, and every dollar is tied to real leads.",
    name: "Client name",
    role: "Paid Ads",
    approved: false,
  },
  {
    quote: "Leads get a reply within seconds, even at night. We've stopped losing customers just because we were too busy to call back.",
    name: "Client name",
    role: "AI Automation",
    approved: false,
  },
  {
    quote: "After our site was hacked, they cleaned it up, secured it and set up backups. I don't lie awake worrying about it anymore.",
    name: "Client name",
    role: "Cybersecurity",
    approved: false,
  },
  {
    quote: "We used to juggle a web designer, an ads freelancer and an SEO agency. Now it's one team and one plan, and everything finally works together.",
    name: "Client name",
    role: "Full service",
    approved: false,
  },
  {
    quote: "Responsive, honest and easy to work with. They tell us what's working and what isn't, without the jargon.",
    name: "Client name",
    role: "Communication",
    approved: false,
  },
];

const MIN_APPROVED_TESTIMONIALS = 3;
const approvedTestimonials = testimonials.filter((t) => t.approved);

/** The items the Testimonials section actually renders. */
export const visibleTestimonials: Testimonial[] = isDev ? testimonials : approvedTestimonials;
export const showTestimonials = isDev || approvedTestimonials.length >= MIN_APPROVED_TESTIMONIALS;
/** The "Placeholder" label: hidden in development; in production only approved items render anyway. */
export const showPlaceholderLabel = false;

export const teamSection = {
  eyebrow: "Team",
  title: "The people behind",
  accent: "the growth.",
};

// TODO: swap the generated avatars in /public/team/ for real team photos.
export const team = [
  { name: "Marcus Reynolds", role: "Head of Growth Strategy", slug: "marcus-reynolds", tint: "#DCE2FF" },
  { name: "Sophia Bennett", role: "SEO & Content Strategist", slug: "sophia-bennett", tint: "#FFE3CC" },
  { name: "Ethan Carter", role: "Web Design & UI/UX Lead", slug: "ethan-carter", tint: "#E7EAEC" },
  { name: "Amelia Hayes", role: "Google & Meta Ads Manager", slug: "amelia-hayes", tint: "#D9D4FA" },
  { name: "Olivia Morgan", role: "AI Automation Specialist", slug: "olivia-morgan", tint: "#FFD9CC" },
];

export const faqSection = {
  eyebrow: "FAQ",
  title: "Good",
  accent: "questions.",
  intro: "Straight answers to what clients ask us most. Don't see yours? Ask us on a free strategy call.",
  cta: { label: "Book a free strategy call", href: "#contact" },
};

export const faqs = [
  {
    q: "How long does a new website take?",
    a: "Most marketing websites take 4 to 8 weeks from kickoff to launch, depending on page count, content and integrations. You'll get a clear timeline before we start.",
  },
  {
    q: "When will I see results from SEO?",
    a: "Technical fixes and local SEO can show movement within 4 to 8 weeks. Competitive rankings usually build over 3 to 6 months, and the gains compound from there.",
  },
  {
    q: "How much should I spend on ads?",
    a: "It depends on your market and goals. Many local businesses start between $1,500 and $5,000 a month in ad spend. We'll recommend a test budget and scale what works.",
  },
  {
    q: "What does AI automation actually do?",
    a: "It replies to new leads in seconds by text, email or chat, answers common questions, qualifies them and books appointments into your calendar, then follows up automatically.",
  },
  {
    q: "Which social platforms do you manage?",
    a: "Instagram, Facebook, TikTok, LinkedIn, YouTube and Pinterest. We focus on the ones where your customers actually spend time.",
  },
  {
    q: "Can I start with just one service?",
    a: "Absolutely. Many clients start with a website or ads and add more as they grow. Everything we build is designed to plug into the rest later.",
  },
  {
    q: "How do I know if my website has been hacked?",
    a: "Warning signs include strange redirects, unfamiliar admin users, spam pages in Google results, browser security warnings, a sudden traffic drop or a slow site. If you see any of these, contact us right away.",
  },
];

export const contact = {
  eyebrow: "Contact",
  lines: ["Let's build", "something", "loud."],
  intro: "Tell us where you are and where you want to be. We'll reply within one business day with next steps.",
  services: [
    ...services.map((s) => s.title),
    "Not sure yet",
  ],
  budgets: ["Under $2k", "$2k–$5k", "$5k–$15k", "$15k+"],
  success: {
    title: "Message sent.",
    body: "Thanks! We'll be in touch within one business day.",
  },
};

export const about = {
  title: "We're Smart Solutions.",
  accentLead: "Marketing that",
  accent: "works as one.",
  eyebrow: "About us · Powered by VASAY.AI",
  sub: "A digital marketing agency in Concord, Ontario, helping businesses across the GTA grow with modern marketing, automation and AI.",
  story: {
    eyebrow: "Our story",
    title: "Fifteen years of",
    accent: "building what works.",
    paragraphs: [
      "Smart Solutions is a full-service digital marketing agency based in Concord, Ontario. For more than 15 years we've helped businesses grow by building brands people remember, generating leads that turn into customers and creating systems that keep working when nobody's watching.",
      "Along the way we noticed the same thing again and again: most businesses weren't short on marketing. They were short on connection. Their brand, website, ads and follow-up were all handled by different people, pulling in different directions.",
      "So we brought it all under one roof. Today, powered by VASAY.AI, our team combines strategy, design, development, advertising and AI automation, so every piece of your marketing works together.",
    ],
  },
  mission: {
    eyebrow: "Mission & values",
    title: "What we",
    accent: "stand for.",
    statement:
      "Our mission is simple: make marketing clear, connected and accountable, so the businesses we work with can grow with confidence.",
    values: [
      { title: "Clarity", body: "Plain language, clear plans and reports you can actually read. No jargon, no smoke and mirrors." },
      { title: "Results over vanity metrics", body: "We measure success in leads, bookings and revenue, not likes and impressions." },
      { title: "Honesty & no hidden fees", body: "Transparent pricing, honest advice and the truth about what is and isn't working." },
      { title: "Long-term partnership", body: "We'd rather grow with you for years than win a quick project. Most of our clients stay." },
    ],
  },
};
