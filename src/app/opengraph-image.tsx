import { brandOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Smart Solutions, digital marketing agency in Vaughan and the GTA";

export default function OgImage() {
  return brandOg("Smarter marketing. Real business growth.", "Digital marketing agency · Vaughan & GTA");
}
