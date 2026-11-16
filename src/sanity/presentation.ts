import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";

/** Where each document appears on the site (Presentation tool: "Used on" + opening the right page). */
export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    { route: "/", filter: `_id == "homePage"` },
    { route: "/about", filter: `_id == "aboutPage"` },
    { route: "/contact", filter: `_id == "contactPage"` },
    { route: "/services", filter: `_id == "servicesPage"` },
    { route: "/services/:slug", filter: `_type == "service" && slug.current == $slug` },
    { route: "/insights", filter: `_id == "insightsPage"` },
    { route: "/insights/:slug", filter: `_type == "post" && slug.current == $slug` },
    { route: "/privacy-policy", filter: `_id == "legal-privacy"` },
    { route: "/terms", filter: `_id == "legal-terms"` },
  ]),
  locations: {
    service: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({ locations: doc?.slug ? [{ title: doc.title ?? "Service", href: `/services/${doc.slug}` }, { title: "Services", href: "/services" }] : [] }),
    }),
    post: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({ locations: doc?.slug ? [{ title: doc.title ?? "Article", href: `/insights/${doc.slug}` }] : [] }),
    }),
    siteSettings: defineLocations({ message: "Used on every page (header, footer, contact details)", tone: "positive", locations: [{ title: "Home", href: "/" }] }),
    navigation: defineLocations({ message: "Used on every page (navbar and footer)", tone: "positive", locations: [{ title: "Home", href: "/" }] }),
    teamMember: defineLocations({ locations: [{ title: "Home", href: "/#team" }, { title: "About", href: "/about#team" }] }),
    testimonial: defineLocations({ locations: [{ title: "Home", href: "/" }] }),
    workItem: defineLocations({ locations: [{ title: "Home", href: "/#work" }] }),
    faq: defineLocations({ locations: [{ title: "Home", href: "/#faq" }, { title: "Contact", href: "/contact" }] }),
  },
};
