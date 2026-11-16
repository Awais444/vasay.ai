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

/**
 * Base URL for <SanityImg>: cropped to `ratio` around the hotspot (honouring the editor's crop).
 * The loader then sets the real width per breakpoint; `ar` tells it the ratio for the height.
 */
export function imageBase(source: SanityImageSource | undefined, ratio: number) {
  if (!builder || !source || !(source as { asset?: unknown }).asset) return null;
  const url = builder.image(source).width(1600).height(Math.round(1600 / ratio)).fit("crop").auto("format").url();
  return `${url}&ar=${ratio}`;
}
