import type { TeamMember } from "@/cms/types";
import { imageUrl } from "@/sanity/client";

/** Default focus for portraits without a hotspot: biased to the top so heads are never cut off. */
export const PORTRAIT_POSITION = "50% 18%";

type Hotspot = { x?: number; y?: number };

/**
 * A member's real photo: { src, position }. The image is requested uncropped (only the editor's
 * crop rectangle from Sanity is applied) and framed in the card with object-fit: cover plus an
 * object-position from the Sanity hotspot, or the top-biased default. This keeps headroom instead
 * of letting a centre crop cut the head. Illustrated SVG avatars are never used on the public site:
 * null means "show the initials tile".
 */
export function memberPhoto(m: TeamMember, width = 800): { src: string; position: string } | null {
  if (m.photo) {
    const src = imageUrl(m.photo, width);
    if (!src) return null;
    const h = m.photo.hotspot as Hotspot | undefined;
    const position = h && typeof h.x === "number" && typeof h.y === "number" ? `${(h.x * 100).toFixed(1)}% ${(h.y * 100).toFixed(1)}%` : PORTRAIT_POSITION;
    return { src, position };
  }
  if (m.photoSrc && /\.(jpe?g|png|webp|avif)$/i.test(m.photoSrc)) return { src: m.photoSrc, position: PORTRAIT_POSITION };
  return null;
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
