import { brandOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Smart Solutions privacy policy";

export default function OgImage() {
  return brandOg("Privacy Policy", "Smart Solutions Inc.");
}
