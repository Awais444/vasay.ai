import Script from "next/script";
import { isIndexable } from "@/lib/seo";
import AnalyticsEvents from "./AnalyticsEvents";

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * GA4 and/or Google Tag Manager, production only (same rule as indexing). The tags load after the page
 * has finished loading (lazyOnload); only the tiny consent-defaults snippet runs earlier.
 * Consent Mode v2 defaults: analytics on, advertising storage/personalisation off.
 * To require opt-in (e.g. for Quebec), set analytics_storage to "denied" and add a consent banner
 * that calls gtag("consent", "update", {...}).
 */
export default function Analytics() {
  if (!isIndexable || (!GA_ID && !GTM_ID)) return null;
  return (
    <>
      <Script id="consent-defaults" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});`}
      </Script>
      {GTM_ID && (
        <Script id="gtm" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
          <Script id="ga4" strategy="lazyOnload">
            {`gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      <AnalyticsEvents />
    </>
  );
}
