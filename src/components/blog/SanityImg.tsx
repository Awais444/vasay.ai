"use client";

import { useState } from "react";
import { preload } from "react-dom";
import Image, { getImageProps, type ImageLoader } from "next/image";

const MAX_WIDTH = 2000;

/**
 * next/image served straight from Sanity's CDN: the loader sets the width (max 2000px),
 * keeps the crop ratio from the base URL (`ar`), and lets Sanity pick AVIF/WebP (auto=format).
 */
export const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  const ratio = Number(url.searchParams.get("ar") || 0);
  const w = Math.min(width, MAX_WIDTH);
  url.searchParams.delete("ar");
  url.searchParams.set("w", String(w));
  if (ratio) url.searchParams.set("h", String(Math.round(w / ratio)));
  url.searchParams.set("q", String(quality ?? 75));
  return url.toString();
};

/**
 * Asks the browser to fetch an image exactly as <SanityImg src sizes> will request it
 * (same srcset and sizes), so it is already cached when that image mounts.
 */
export function preloadSanityImage(src: string, sizes: string) {
  const { props } = getImageProps({ loader: sanityLoader, src, alt: "", fill: true, sizes });
  if (!props.srcSet) return;
  preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: sizes, fetchPriority: "high" });
}

/**
 * Fills its parent. With a blur placeholder (Sanity LQIP), the sharp image fades in over it in 300ms
 * instead of popping.
 */
export default function SanityImg({
  src,
  alt,
  sizes,
  priority,
  blurDataURL,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  blurDataURL?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {blurDataURL && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full scale-105 object-cover blur-xl ${className}`}
        />
      )}
      <Image
        loader={sanityLoader}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        // Already cached (e.g. preloaded from the card): show it at once, without the fade.
        ref={(img) => {
          if (!img || loaded || !img.complete || !img.naturalWidth) return;
          img.style.transition = "none";
          img.style.opacity = "1";
          setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-300 ease-out ${blurDataURL && !loaded ? "opacity-0" : "opacity-100"}`}
      />
    </>
  );
}
