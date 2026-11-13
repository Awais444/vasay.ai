// TODO: have this reviewed by a lawyer before launch.
import { privacy } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";

export const metadata = pageMetadata({
  title: "Privacy Policy | Smart Solutions",
  description: "How Smart Solutions collects, uses and protects your personal information under PIPEDA.",
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />;
}
