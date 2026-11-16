import { isDev, isLiveSite } from "@/lib/env";
import type { Testimonial } from "./types";

/**
 * Testimonial visibility (same rule as before the CMS):
 * - Live site (vasay.ai): only approved ones, no label, and only once at least 3 are approved.
 * - Preview/staging: all of them, with a "Placeholder" label on unapproved ones.
 * - Local development: all of them, no label.
 */
export const MIN_APPROVED_TESTIMONIALS = 3;

export function testimonialView(all: Testimonial[]) {
  const approved = all.filter((t) => t.approved);
  return {
    items: isLiveSite ? approved : all,
    show: isLiveSite ? approved.length >= MIN_APPROVED_TESTIMONIALS : all.length > 0,
    showLabel: !isLiveSite && !isDev,
  };
}
