import { Suspense } from "react";
import Studio from "./Studio";

// Studio defaults: noindex, no referrer, and a viewport that suits the app.
export { metadata, viewport } from "next-sanity/studio";

/** Sanity Studio for the Insights blog. Access is protected by Sanity login (project members only). */
export default function StudioPage() {
  return (
    <Suspense>
      <Studio />
    </Suspense>
  );
}
