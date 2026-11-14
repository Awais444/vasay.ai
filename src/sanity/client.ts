import { createClient } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

/** Read-only client for published content. Responses are cached by Next (see data.ts), so no CDN. */
export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" })
  : null;

const builder = isSanityConfigured ? createImageUrlBuilder({ projectId, dataset }) : null;

/** Sanity image URL at a given width (Sanity's CDN crops to the hotspot and serves modern formats). */
export function imageUrl(source: SanityImageSource | undefined, width: number, height?: number) {
  if (!builder || !source) return null;
  let b = builder.image(source).width(width).fit("crop").auto("format");
  if (height) b = b.height(height);
  return b.url();
}
