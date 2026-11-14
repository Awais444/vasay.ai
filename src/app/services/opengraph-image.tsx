import { brandOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Smart Solutions digital marketing services";

export default function OgImage() {
  return brandOg("Digital marketing services, all under one roof.", "Services");
}
