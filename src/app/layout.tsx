import type { Metadata, Viewport } from "next";
import { heading, body } from "./fonts";
import { site } from "@/lib/content";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import TransitionProvider, { PAGE_ROOT_ID } from "@/components/TransitionProvider";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const title = "Smart Solutions — Powered by VASAY.AI | Marketing, Automation & AI";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: site.description,
    url: site.url,
    siteName: "Smart Solutions — Powered by VASAY.AI",
    locale: "en_CA",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = { themeColor: "#1B08B7" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#business`,
  name: "Smart Solutions — Powered by VASAY.AI",
  url: site.url,
  telephone: "+1-647-559-3900",
  description: site.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  areaServed: "Greater Toronto Area",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} antialiased`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <JsonLd data={jsonLd} />
        <SmoothScroll>
          <TransitionProvider>
            <Navbar />
            <div id={PAGE_ROOT_ID}>
              <main id="main" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </div>
          </TransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
