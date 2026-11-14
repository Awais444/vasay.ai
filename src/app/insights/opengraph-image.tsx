import { brandOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Smart Solutions Insights";

export default function OgImage() {
  return brandOg("Marketing that actually works, explained.", "Insights");
}
