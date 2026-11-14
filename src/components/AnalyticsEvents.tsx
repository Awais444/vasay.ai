"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/** Conversion clicks: phone, email and "strategy call" CTAs (form success is tracked in Contact.tsx). */
export default function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const label = (a.textContent ?? "").trim().slice(0, 80);
      if (href.startsWith("tel:")) track("phone_click", { link_text: label });
      else if (href.startsWith("mailto:")) track("email_click", { link_text: label });
      else if (/strategy call/i.test(label)) track("book_call_click", { link_text: label, link_url: href });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
