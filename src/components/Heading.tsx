// Shared section heading. Its own module so client components can use it without pulling in server code.
import type { Rich } from "@/cms/types";
import AccentText from "./AccentText";
import { Star } from "./Logo";

export function Heading({
  eyebrow,
  title,
  accent,
  dark = false,
  className = "",
}: {
  eyebrow: string;
  /** Rich (CMS, with orange words) or plain string + `accent` */
  title: Rich | string;
  accent?: string;
  dark?: boolean;
  className?: string;
}) {
  if (!eyebrow && (Array.isArray(title) ? !title.length : !title)) return null;
  return (
    <div className={className}>
      <p className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] ${dark ? "text-white/75" : "text-accent"}`}>
        <Star size={10} className="text-brand-orange" />
        {eyebrow}
      </p>
      <h2 className={`mt-4 font-display text-[clamp(2.3rem,5.5vw,4.5rem)] font-semibold leading-[1] ${dark ? "text-white" : ""}`}>
        {Array.isArray(title) ? (
          <AccentText text={title} />
        ) : (
          <>
            {title} {accent && <span className="text-brand-orange">{accent}</span>}
          </>
        )}
      </h2>
    </div>
  );
}
