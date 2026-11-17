"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "wa-bubble-dismissed";

/** Floating WhatsApp button (bottom-left) with a dismissible "Need help?" bubble. */
export default function WhatsAppFloat({ href }: { href: string }) {
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {}
    if (dismissed) return;
    const t = window.setTimeout(() => setBubble(true), 2500);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    setBubble(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-[80] flex flex-col items-start gap-3 sm:bottom-6 sm:left-6">
      {bubble && (
        <div className="wa-bubble pointer-events-auto relative flex items-center gap-3 rounded-2xl bg-white py-3 pl-4 pr-2 text-[15px] font-medium text-brand-black shadow-[0_10px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
          <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            Need help? Chat with us!
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close chat message"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-black/5 hover:text-brand-black"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {/* Tail pointing down at the button */}
          <span aria-hidden="true" className="absolute -bottom-2 left-7 h-4 w-4 rotate-45 bg-white" />
        </div>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="wa-float pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-110 focus-visible:scale-110 sm:h-16 sm:w-16"
      >
        <svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden="true">
          <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.54 1.75 6.52L3 29l6.66-1.74A12.95 12.95 0 0 0 16.04 29C23.2 29 29.04 23.18 29.04 16S23.2 3 16.04 3Zm0 23.62c-2 0-3.95-.54-5.66-1.55l-.4-.24-3.95 1.03 1.05-3.85-.26-.4A10.6 10.6 0 0 1 5.4 16c0-5.86 4.77-10.62 10.64-10.62 5.86 0 10.63 4.76 10.63 10.62 0 5.86-4.77 10.62-10.63 10.62Zm5.83-7.95c-.32-.16-1.89-.93-2.18-1.04-.3-.1-.5-.16-.72.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.3.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.08 1.3 3.3.16.2 2.25 3.43 5.44 4.81.76.33 1.35.52 1.81.67.76.24 1.46.2 2 .12.62-.09 1.89-.77 2.16-1.52.26-.74.26-1.38.18-1.51-.08-.14-.29-.22-.61-.38Z" />
        </svg>
      </a>
    </div>
  );
}
