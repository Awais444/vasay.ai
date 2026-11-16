import { Fragment } from "react";
import type { Rich } from "@/cms/types";

/** Text with editor-marked orange words (the "Orange" highlight in the CMS). */
export default function AccentText({ text, accentClassName = "text-brand-orange" }: { text: Rich; accentClassName?: string }) {
  return (
    <>
      {text.map((s, i) =>
        s.accent ? (
          <span key={i} className={accentClassName}>
            {s.text}
          </span>
        ) : (
          <Fragment key={i}>{s.text}</Fragment>
        ),
      )}
    </>
  );
}

/** Plain string of a Rich value (for metadata, aria labels, alt text). */
export const richText = (r?: Rich) => (r ?? []).map((s) => s.text).join("").replace(/\s+/g, " ").trim();
