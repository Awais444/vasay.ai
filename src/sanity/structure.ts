import type { StructureResolver } from "sanity/structure";
import { SINGLETONS } from "./schemas/site";

const single = (S: Parameters<StructureResolver>[0], id: string, title: string, type: string) =>
  S.listItem().id(id).title(title).child(S.document().schemaType(type).documentId(id).title(title));

/** Studio sidebar: Site settings · Navigation · Pages · Services · Work · Team · Testimonials · FAQs · Insights · Redirects */
export const structure: StructureResolver = (S) => {
  const s = (id: string) => SINGLETONS.find((x) => x.id === id)!;
  return S.list()
    .title("Content")
    .items([
      single(S, "siteSettings", "Site settings", "siteSettings"),
      single(S, "navigation", "Navigation", "navigation"),
      S.divider(),
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items(["homePage", "aboutPage", "contactPage", "servicesPage", "insightsPage", "legal-privacy", "legal-terms", "notFoundPage"].map((id) => single(S, id, s(id).title, s(id).type))),
        ),
      S.divider(),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("workItem").title("Work"),
      S.documentTypeListItem("teamMember").title("Team"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("faq").title("FAQs"),
      S.divider(),
      S.listItem()
        .title("Insights")
        .child(
          S.list()
            .title("Insights")
            .items([S.documentTypeListItem("post").title("Articles"), S.documentTypeListItem("category").title("Categories"), S.documentTypeListItem("author").title("Authors")]),
        ),
      S.divider(),
      S.documentTypeListItem("redirect").title("Redirects"),
    ]);
};

/** Types that only exist as the fixed singleton documents above. */
export const SINGLETON_TYPES = new Set(["siteSettings", "navigation", "homePage", "aboutPage", "contactPage", "servicesPage", "insightsPage", "notFoundPage", "legalPage"]);
