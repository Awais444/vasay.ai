import type { TeamMember } from "@/cms/types";
import { imageUrl } from "@/sanity/client";

/**
 * A member's real photo (Sanity image cropped to 4:5 around the editor's hotspot, or a JPG/PNG/WebP
 * shipped with the site). Illustrated SVG avatars are never used on the public site: null means
 * "show the initials tile".
 */
export function memberPhoto(m: TeamMember, width = 720): string | null {
  if (m.photo) return imageUrl(m.photo, width, Math.round((width * 5) / 4));
  if (m.photoSrc && /\.(jpe?g|png|webp|avif)$/i.test(m.photoSrc)) return m.photoSrc;
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
