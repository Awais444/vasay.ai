// TODO: have this reviewed by a lawyer before launch.
import { getContent } from "@/cms/content";
import { pageMetadata, withSeo } from "@/lib/seo";
import { breadcrumbs, webPage } from "@/lib/schema";
import LegalPage from "@/components/LegalPage";
import JsonLd from "@/components/JsonLd";

const meta = {
  title: "Privacy Policy | Smart Solutions, Digital Marketing Agency",
  description:
    "How Smart Solutions Inc. collects, uses, stores and protects your personal information under PIPEDA, and how to contact us about your privacy rights.",
  path: "/privacy-policy",
};
export async function generateMetadata() {
  const { legal } = await getContent();
  return withSeo(pageMetadata(meta), legal.privacy.seo);
}

export default async function PrivacyPage() {
  const { legal } = await getContent();
  return (
    <>
      <JsonLd
        data={[
          webPage({ path: meta.path, name: meta.title, description: meta.description }),
          breadcrumbs(meta.path, [
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: meta.path },
          ]),
        ]}
      />
      <LegalPage doc={legal.privacy} />
    </>
  );
}
