/** Plain-markdown summaries for AI tools (/llms.txt and /llms-full.txt), generated from the site content. */
import { faqs, site } from "./content";
import { serviceList } from "./services";
import { serviceGuides } from "./serviceGuides";
import { plain } from "./schema";

const AREA = "Vaughan, Concord, Toronto, Mississauga, Brampton, Markham, Richmond Hill and the Greater Toronto Area (GTA), Ontario, Canada";

const header = () => `# Smart Solutions, Powered by VASAY.AI

> ${site.description}

## Key facts
- Legal name: ${site.legalName} (brand: Smart Solutions, Powered by VASAY.AI)
- Website: ${site.url}
- Phone: ${site.phone} (${site.phoneSchema})
- Email: ${site.email}
- Address: ${site.address.full}, Canada
- Service area: ${AREA}
- Experience: 15+ years in digital marketing
- Free 30-minute strategy call: ${site.url}/contact
`;

export function llmsTxt() {
  return `${header()}
## Services
${serviceList.map((s) => `- [${s.title}](${site.url}/services/${s.slug}): ${s.description}`).join("\n")}

## Pages
- [Home](${site.url}): overview, process and FAQs
- [All services](${site.url}/services)
- [About](${site.url}/about)
- [Contact](${site.url}/contact)
- [Insights (blog)](${site.url}/insights)

## Full text
- [llms-full.txt](${site.url}/llms-full.txt): full content of every service page
`;
}

export function llmsFullTxt() {
  const services = serviceList
    .map((s) => {
      const g = serviceGuides[s.slug];
      const lines = [
        `## ${s.title}`,
        `URL: ${site.url}/services/${s.slug}`,
        "",
        s.sub,
      ];
      if (g) {
        lines.push("", `### ${g.definition.q}`, g.definition.a, "", "### Who it's for", ...g.forWho.map((w) => `- ${w}`));
        for (const sec of g.guide) lines.push("", `### ${sec.q}`, ...sec.a.map(plain));
        if (g.comparison) {
          lines.push("", `### ${g.comparison.title}`, g.comparison.intro, "", `| ${g.comparison.head.join(" | ")} |`, `| --- | --- | --- |`, ...g.comparison.rows.map((r) => `| ${r.join(" | ")} |`));
        }
      }
      lines.push("", "### What's included", ...s.included.map((i) => `- ${i.title}: ${i.body}`));
      lines.push("", "### Deliverables", ...s.deliverables.map((d) => `- ${d}`));
      lines.push("", "### Process", ...s.process.map((p, i) => `${i + 1}. ${p.title}: ${p.body}`));
      if (s.note) lines.push("", s.note);
      lines.push("", "### FAQ", ...[...s.faqs, ...(g?.moreFaqs ?? [])].flatMap((f) => [`**${plain(f.q)}**`, plain(f.a), ""]));
      if (g) lines.push(`Last updated: ${g.updated}`);
      return lines.join("\n");
    })
    .join("\n\n---\n\n");

  return `${header()}
# Services

${services}

---

# General FAQ

${faqs.map((f) => `**${plain(f.q)}**\n${plain(f.a)}`).join("\n\n")}
`;
}
