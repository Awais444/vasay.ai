import type { Metadata, Viewport } from "next";
import { HideOnStudio } from "@/components/SiteChrome";
import { heading, body } from "./fonts";
import { site } from "@/lib/content";
import SmoothScroll from "@/components/SmoothScroll";
import MotionProvider from "@/components/MotionProvider";
import Navbar from "@/components/Navbar";
import TransitionProvider, { PAGE_ROOT_ID } from "@/components/TransitionProvider";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import { isIndexable, SITE_NAME } from "@/lib/seo";
import { organization, website } from "@/lib/schema";
import "./globals.css";

const title = "Digital Marketing Agency in Vaughan & GTA | Smart Solutions";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s" },
  description: site.description,
  applicationName: SITE_NAME,
  // Only the production deployment is indexable (see src/lib/seo.ts).
  robots: isIndexable ? { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } : { index: false, follow: false },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } : undefined,
  },
  openGraph: { siteName: SITE_NAME, locale: "en_CA", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#1B08B7" };

// Site-wide entities; every page's WebPage/Service/BlogPosting links to these @ids.
const jsonLd = [organization(), website()];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${heading.variable} ${body.variable} antialiased`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <JsonLd data={jsonLd} />
        <Analytics />
        <MotionProvider>
        <SmoothScroll>
          <TransitionProvider>
            <HideOnStudio>
              <Navbar />
            </HideOnStudio>
            <div id={PAGE_ROOT_ID}>
              <main id="main" tabIndex={-1}>
                {children}
              </main>
              <HideOnStudio>
                <Footer />
              </HideOnStudio>
            </div>
          </TransitionProvider>
        </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
