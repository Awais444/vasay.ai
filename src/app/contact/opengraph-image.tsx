import { brandOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Contact Smart Solutions";

export default function OgImage() {
  return brandOg("Book a free 30-minute strategy call.", `Contact · ${site.phone}`);
}
import { site } from "@/lib/content";
