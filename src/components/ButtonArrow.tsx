import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, ChevronRight, type LucideIcon } from "lucide-react";

export type ArrowDir = "right" | "left" | "down" | "up" | "up-right" | "chevron";

const ICONS: Record<ArrowDir, LucideIcon> = {
  right: ArrowRight,
  left: ArrowLeft,
  down: ArrowDown,
  up: ArrowUp,
  "up-right": ArrowUpRight,
  chevron: ChevronRight,
};

/** Hover nudge in the arrow's own direction. Triggered by the nearest `.group` ancestor (the link/button). */
const NUDGE: Record<ArrowDir, string> = {
  right: "group-hover:translate-x-1 group-focus-visible:translate-x-1",
  left: "group-hover:-translate-x-1 group-focus-visible:-translate-x-1",
  down: "group-hover:translate-y-[3px] group-focus-visible:translate-y-[3px]",
  up: "group-hover:-translate-y-[3px] group-focus-visible:-translate-y-[3px]",
  "up-right":
    "group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-focus-visible:translate-x-[3px] group-focus-visible:-translate-y-[3px]",
  chevron: "",
};

/** Shared classes for a text link or button that ends in a ButtonArrow: 8px gap, icon centred. */
export const arrowLink = "group inline-flex items-center gap-2";

/**
 * The site's single arrow icon. Decorative (aria-hidden): the link text describes the action.
 * 18px in buttons, `size={16}` in small text links. Put it inside an element with `group`.
 */
export default function ButtonArrow({
  dir = "right",
  size = 18,
  nudge = true,
  className = "",
}: {
  dir?: ArrowDir;
  size?: number;
  /** Slide in its direction on hover/focus of the parent `.group`. */
  nudge?: boolean;
  className?: string;
}) {
  const Icon = ICONS[dir];
  return (
    <Icon
      size={size}
      strokeWidth={2}
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${nudge ? NUDGE[dir] : ""} ${className}`}
    />
  );
}
