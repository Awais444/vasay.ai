"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/** Share links (no third-party scripts) plus copy-link. */
export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
  ];
  const btn = "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 ring-brand-silver transition-colors hover:bg-accent hover:text-white hover:ring-accent";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="mr-2 text-sm font-semibold text-ink-2">Share</p>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={btn} aria-label={`Share on ${l.label}`}>
          {l.label}
        </a>
      ))}
      <button type="button" onClick={copy} className={btn} aria-live="polite">
        {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
