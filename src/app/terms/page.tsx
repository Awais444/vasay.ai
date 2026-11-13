// TODO: have this reviewed by a lawyer before launch.
import { terms } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";

export const metadata = pageMetadata({
  title: "Terms of Service | Smart Solutions",
  description: "The terms that govern use of the Smart Solutions (VASAY.AI) website.",
  path: "/terms",
});

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
