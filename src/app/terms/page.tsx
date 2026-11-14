// TODO: have this reviewed by a lawyer before launch.
import { terms } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbs, webPage } from "@/lib/schema";
import LegalPage from "@/components/LegalPage";
import JsonLd from "@/components/JsonLd";

const meta = {
  title: "Terms of Service | Smart Solutions, Digital Marketing Agency",
  description:
    "The terms that govern use of the Smart Solutions (VASAY.AI) website, including content, intellectual property, liability and governing law in Ontario.",
  path: "/terms",
};
export const metadata = pageMetadata(meta);

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ path: meta.path, name: meta.title, description: meta.description }),
          breadcrumbs(meta.path, [
            { name: "Home", path: "/" },
            { name: "Terms of Service", path: meta.path },
          ]),
        ]}
      />
      <LegalPage doc={terms} />
    </>
  );
}
