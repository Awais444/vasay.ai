import { brandOg, ogSize } from "@/lib/og";
import { getContent } from "@/cms/content";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Contact Smart Solutions";

export default async function OgImage() {
  const { settings } = await getContent();
  return brandOg("Book a free 30-minute strategy call.", `Contact · ${settings.phone}`);
}
