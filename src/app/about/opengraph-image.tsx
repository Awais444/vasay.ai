import { brandOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "About Smart Solutions";

export default function OgImage() {
  return brandOg("About Smart Solutions, Powered by VASAY.AI", "About us");
}
