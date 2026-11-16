import { Bot, LayoutTemplate, Megaphone, Palette, PenLine, Search, Share2, ShieldCheck, type LucideIcon } from "lucide-react";

/*
 * Fallback look for articles without a cover photo: a brand gradient with the category icon.
 * Picked by the category slug, which matches the service slugs (ai-automation, seo, paid-ads, ...).
 */

export type CoverTheme = { from: string; to: string; icon: LucideIcon };

const KLEIN = "#1b08b7";
const VIBRANT = "#011efd";
const DEEP = "#12057f";
const BLACK = "#141317";
const ORANGE = "#ff7001";
const RED = "#ff3600";

const THEMES: Record<string, CoverTheme> = {
  "ai-automation": { from: KLEIN, to: VIBRANT, icon: Bot },
  seo: { from: BLACK, to: KLEIN, icon: Search },
  "paid-ads": { from: RED, to: ORANGE, icon: Megaphone },
  "brand-identity": { from: ORANGE, to: KLEIN, icon: Palette },
  "website-design": { from: VIBRANT, to: KLEIN, icon: LayoutTemplate },
  "web-development": { from: VIBRANT, to: KLEIN, icon: LayoutTemplate },
  "social-media": { from: DEEP, to: KLEIN, icon: Share2 },
  cybersecurity: { from: BLACK, to: "#26252b", icon: ShieldCheck },
};
const DEFAULT_THEME: CoverTheme = { from: KLEIN, to: VIBRANT, icon: PenLine };

export const coverTheme = (categorySlug?: string) => (categorySlug && THEMES[categorySlug]) || DEFAULT_THEME;

/** `sizes` of the cover on the article page; cards preload it with exactly this value. */
export const ARTICLE_COVER_SIZES = "(min-width: 1200px) 1112px, calc(100vw - 40px)";
