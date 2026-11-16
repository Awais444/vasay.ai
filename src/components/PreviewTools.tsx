import { draftMode } from "next/headers";
import VisualEditingLazy from "./VisualEditingLazy";
import { getContent } from "@/cms/content";

/**
 * Only while Draft Mode is on (Studio preview): click-to-edit overlays, an "Exit preview" link and a
 * notice when fallback content is being used. Renders nothing for normal visitors, so none of this
 * code is loaded on public pages.
 */
export default async function PreviewTools() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  const { fallbacks } = await getContent();
  return (
    <>
      <VisualEditingLazy />
      <div className="fixed bottom-4 left-4 z-[90] flex max-w-[calc(100vw-2rem)] flex-col gap-2 text-[13px] font-semibold">
        {fallbacks.length > 0 && (
          <p className="rounded-xl bg-brand-red px-3 py-2 text-white shadow-lg" role="status">
            Using fallback content: {fallbacks.join(", ")}
          </p>
        )}
        <a href="/api/draft-mode/disable" className="self-start rounded-full bg-brand-black px-4 py-2 text-white shadow-lg hover:bg-accent">
          Preview mode · Exit
        </a>
      </div>
    </>
  );
}
