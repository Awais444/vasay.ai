import { imageBase } from "@/sanity/client";
import type { SanityImage } from "@/sanity/data";
import BrandCover from "./BrandCover";
import SanityImg from "./SanityImg";

/**
 * Every article cover: 16:9, rounded 20px, object-fit cover (Sanity crop + hotspot),
 * a subtle Klein Blue overlay from the bottom-left so different photos read as one set,
 * and a blur placeholder from Sanity's LQIP. No photo → brand gradient with the category icon.
 */
export default function CoverImage({
  image,
  category,
  sizes,
  priority = false,
  zoom = false,
  className = "",
}: {
  image?: SanityImage;
  category?: { slug: string };
  sizes: string;
  priority?: boolean;
  /** Zoom 1.03 when the parent `.group` is hovered. */
  zoom?: boolean;
  className?: string;
}) {
  const base = imageBase(image, 16 / 9);
  return (
    <div className={`relative aspect-video overflow-hidden rounded-[20px] bg-[#F1F0FB] ${className}`}>
      {base ? (
        <>
          <SanityImg
            src={base}
            alt={image?.alt ?? ""}
            sizes={sizes}
            priority={priority}
            blurDataURL={image?.lqip}
            className={`object-cover ${zoom ? "transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" : ""}`}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top_right,rgba(27,8,183,0.18),rgba(27,8,183,0)_65%)]"
          />
        </>
      ) : (
        <BrandCover category={category} />
      )}
    </div>
  );
}
