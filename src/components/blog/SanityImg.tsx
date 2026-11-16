"use client";

import Image, { type ImageLoader } from "next/image";

const MAX_WIDTH = 2000;

/**
 * next/image served straight from Sanity's CDN: the loader sets the width (max 2000px),
 * keeps the 16:9 crop from the base URL, and lets Sanity pick AVIF/WebP (auto=format).
 */
const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  const ratio = Number(url.searchParams.get("ar") || 0);
  const w = Math.min(width, MAX_WIDTH);
  url.searchParams.delete("ar");
  url.searchParams.set("w", String(w));
  if (ratio) url.searchParams.set("h", String(Math.round(w / ratio)));
  url.searchParams.set("q", String(quality ?? 75));
  return url.toString();
};

export default function SanityImg({
  src,
  alt,
  sizes,
  priority,
  blurDataURL,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  blurDataURL?: string;
  className?: string;
}) {
  return (
    <Image
      loader={sanityLoader}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      className={className}
    />
  );
}
