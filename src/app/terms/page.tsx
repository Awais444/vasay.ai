// TODO: have this reviewed by a lawyer before launch.
import { getContent } from "@/cms/content";
import { pageMetadata, withSeo } from "@/lib/seo";
import { breadcrumbs, webPage } from "@/lib/schema";
import LegalPage from "@/components/LegalPage";
import JsonLd from "@/components/JsonLd";

const meta = {
  title: "Terms of Service | Smart Solutions, Digital Marketing Agency",
  description:
    "The terms that govern use of the Smart Solutions (VASAY.AI) website, including content, intellectual property, liability and governing law in Ontario.",
  path: "/terms",
};
export async function generateMetadata() {
  const { legal } = await getContent();
  return withSeo(pageMetadata(meta), legal.terms.seo);
}

export default async function TermsPage() {
  const { legal } = await getContent();
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
      <LegalPage doc={legal.terms} />
    </>
  );
}
