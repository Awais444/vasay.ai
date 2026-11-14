/** Send a GA4 event (via gtag, or GTM's dataLayer). No-op when analytics isn't loaded. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
  if (w.gtag) w.gtag("event", event, params);
  else w.dataLayer?.push({ event, ...params });
}
