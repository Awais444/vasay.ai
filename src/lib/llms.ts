/** Plain-markdown summaries for AI tools (/llms.txt and /llms-full.txt), generated from the CMS content. */
import type { CmsContent } from "@/cms/types";
import { siteUrl } from "./env";
import { plain } from "./schema";

const AREA = "Vaughan, Concord, Toronto, Mississauga, Brampton, Markham, Richmond Hill and the Greater Toronto Area (GTA), Ontario, Canada";

const header = (c: CmsContent) => {
  const s = c.settings;
  return `# Smart Solutions, Powered by VASAY.AI

> ${s.description}

## Key facts
- Legal name: ${s.legalName} (brand: Smart Solutions, Powered by VASAY.AI)
- Website: ${siteUrl}
- Phone: ${s.phone} (${s.phoneSchema})
- Email: ${s.email}
- Address: ${s.address.full}, Canada
- Service area: ${AREA}
- Experience: 15+ years in digital marketing
- Free 30-minute strategy call: ${siteUrl}/contact
`;
};

export function llmsTxt(c: CmsContent) {
  return `${header(c)}
## Services
${c.services.map((s) => `- [${s.title}](${siteUrl}/services/${s.slug}): ${s.description}`).join("\n")}

## Pages
- [Home](${siteUrl}): overview, process and FAQs
- [All services](${siteUrl}/services)
- [About](${siteUrl}/about)
- [Contact](${siteUrl}/contact)
- [Insights (blog)](${siteUrl}/insights)

## Full text
- [llms-full.txt](${siteUrl}/llms-full.txt): full content of every service page
`;
}

export function llmsFullTxt(c: CmsContent) {
  const services = c.services
    .map((s) => {
      const lines = [`## ${s.title}`, `URL: ${siteUrl}/services/${s.slug}`, "", s.sub];
      if (s.definition.a) lines.push("", `### ${s.definition.q}`, s.definition.a);
      if (s.forWho.length) lines.push("", "### Who it's for", ...s.forWho.map((w) => `- ${w}`));
      for (const sec of s.guide) lines.push("", `### ${sec.q}`, ...sec.a.map(plain));
      if (s.comparison) {
        lines.push("", `### ${s.comparison.title}`, s.comparison.intro, "", `| ${s.comparison.head.join(" | ")} |`, `| --- | --- | --- |`, ...s.comparison.rows.map((r) => `| ${r.join(" | ")} |`));
      }
      if (s.included.length) lines.push("", "### What's included", ...s.included.map((i) => `- ${i.title}: ${i.body}`));
      if (s.deliverables.length) lines.push("", "### Deliverables", ...s.deliverables.map((d) => `- ${d}`));
      if (s.process.length) lines.push("", "### Process", ...s.process.map((p, i) => `${i + 1}. ${p.title}: ${p.body}`));
      if (s.note) lines.push("", s.note);
      if (s.faqs.length) lines.push("", "### FAQ", ...s.faqs.flatMap((f) => [`**${plain(f.q)}**`, plain(f.a), ""]));
      if (s.updated) lines.push(`Last updated: ${s.updated}`);
      return lines.join("\n");
    })
    .join("\n\n---\n\n");

  return `${header(c)}
# Services

${services}

---

# General FAQ

${c.faqs.home.map((f) => `**${plain(f.q)}**\n${plain(f.a)}`).join("\n\n")}
`;
}
