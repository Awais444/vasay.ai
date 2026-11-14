import { brandOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Smart Solutions terms of service";

export default function OgImage() {
  return brandOg("Terms of Service", "Smart Solutions Inc.");
}
