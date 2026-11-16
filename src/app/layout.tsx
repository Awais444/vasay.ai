import type { Metadata, Viewport } from "next";
import { HideOnStudio } from "@/components/SiteChrome";
import { heading, body } from "./fonts";
import { getContent } from "@/cms/content";
import { siteUrl } from "@/lib/env";
import SmoothScroll from "@/components/SmoothScroll";
import MotionProvider from "@/components/MotionProvider";
import RevealObserver from "@/components/RevealObserver";
import Navbar from "@/components/Navbar";
import TransitionProvider, { PAGE_ROOT_ID } from "@/components/TransitionProvider";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import PreviewTools from "@/components/PreviewTools";
import { Suspense } from "react";
import { isIndexable, SITE_NAME } from "@/lib/seo";
import { organization, website } from "@/lib/schema";
import "./globals.css";

const title = "Digital Marketing Agency in Vaughan & GTA | Smart Solutions";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  return {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s" },
  description: settings.defaultSeo.description || settings.description,
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
}

export const viewport: Viewport = { themeColor: "#1B08B7" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const c = await getContent();
  const navServices = c.services.map((s) => ({ slug: s.slug, icon: s.icon, title: s.title, tag: s.tag, href: `/services/${s.slug}` }));
  // Site-wide entities; every page's WebPage/Service/BlogPosting links to these @ids.
  const jsonLd = [organization(c.settings), website()];
  // Page names shown on the transition curtain.
  const routeLabels: Record<string, string> = {
    "/": "Home",
    "/services": "Services",
    "/about": "About",
    "/contact": "Contact",
    "/insights": "Insights",
    "/privacy-policy": "Privacy Policy",
    "/terms": "Terms",
    ...Object.fromEntries(c.services.map((s) => [`/services/${s.slug}`, s.title])),
  };
  return (
    <html lang="en-CA" suppressHydrationWarning className={`${heading.variable} ${body.variable} antialiased`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        {/* Marks JS as available before first paint, so scroll-reveal never hides content without JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <JsonLd data={jsonLd} />
        <RevealObserver />
        <Analytics ga4Id={c.settings.ga4Id} gtmId={c.settings.gtmId} />
        <MotionProvider>
        <SmoothScroll>
          <TransitionProvider labels={routeLabels}>
            <HideOnStudio>
              <Navbar nav={c.nav} services={navServices} settings={c.settings} />
            </HideOnStudio>
            <div id={PAGE_ROOT_ID}>
              <main id="main" tabIndex={-1}>
                {children}
              </main>
              <HideOnStudio>
                <Footer nav={c.nav} services={navServices} settings={c.settings} />
              </HideOnStudio>
            </div>
          </TransitionProvider>
        </SmoothScroll>
        </MotionProvider>
        {/* Studio preview only (Draft Mode); nothing for normal visitors */}
        <Suspense fallback={null}>
          <PreviewTools />
        </Suspense>
      </body>
    </html>
  );
}
