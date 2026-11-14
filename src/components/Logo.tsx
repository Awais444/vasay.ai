import Image from "next/image";
import Link from "./TransitionLink";

// Official logo files, used exactly as supplied (900×589):
//   /public/brand/logo.webp         normal version, for white/light backgrounds
//   /public/brand/logo-dark-bg.png  version for blue/dark backgrounds
const SRC = { light: "/brand/logo.webp", dark: "/brand/logo-dark-bg.png" } as const;
const ALT = "Smart Solutions, powered by VASAY.AI";
const W = 900;
const H = 589;

export function Star({ className = "", size = 14 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Variant = keyof typeof SRC;

/**
 * Fixed-size box (height from `className`, width from the logo's aspect ratio), so swapping
 * versions never shifts the layout. `variant` may be "light" | "dark", or `crossfade` shows
 * both images stacked and fades to `variant` (navbar).
 */
export default function Logo({
  variant = "light",
  className = "h-11",
  priority = false,
  sizes = "80px",
  crossfade = false,
  link = true,
}: {
  variant?: Variant;
  className?: string;
  priority?: boolean;
  /** Displayed width (CSS px) for next/image srcset selection. Navbar ≈ 67–80px, footer ≈ 150px. */
  sizes?: string;
  crossfade?: boolean;
  link?: boolean;
}) {
  const img = (v: Variant, visible: boolean) => (
    <Image
      key={v}
      src={SRC[v]}
      alt={visible ? ALT : ""}
      aria-hidden={visible ? undefined : true}
      width={W}
      height={H}
      // Only the version visible on load is preloaded; the crossfade partner loads normally.
      priority={priority && visible}
      sizes={sizes}
      className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    />
  );

  const box = (
    <span className={`relative block aspect-[900/589] shrink-0 ${className}`}>
      {crossfade ? (
        <>
          {img("light", variant === "light")}
          {img("dark", variant === "dark")}
        </>
      ) : (
        img(variant, true)
      )}
    </span>
  );

  if (!link) return box;
  return (
    <Link href="/" aria-label="Smart Solutions home" className="block shrink-0 rounded-md">
      {box}
    </Link>
  );
}
