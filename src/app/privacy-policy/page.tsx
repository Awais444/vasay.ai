// TODO: have this reviewed by a lawyer before launch.
import { privacy } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbs, webPage } from "@/lib/schema";
import LegalPage from "@/components/LegalPage";
import JsonLd from "@/components/JsonLd";

const meta = {
  title: "Privacy Policy | Smart Solutions, Digital Marketing Agency",
  description:
    "How Smart Solutions Inc. collects, uses, stores and protects your personal information under PIPEDA, and how to contact us about your privacy rights.",
  path: "/privacy-policy",
};
export const metadata = pageMetadata(meta);

export default function PrivacyPage() {
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
      <LegalPage doc={privacy} />
    </>
  );
}
