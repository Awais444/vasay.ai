import { Fragment } from "react";
import Link from "@/components/TransitionLink";

/** Renders plain content strings with inline [anchor text](/path) links (descriptive internal links). */
export default function RichText({ text, linkClassName }: { text: string; linkClassName?: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <Fragment key={i}>{p}</Fragment>;
        return (
          <Link
            key={i}
            href={m[2]}
            className={linkClassName ?? "font-medium text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"}
          >
            {m[1]}
          </Link>
        );
      })}
    </>
  );
}
