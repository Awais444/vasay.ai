"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

/** The Studio is a browser-only app: load it on the client so the server bundle stays small. */
const StudioApp = dynamic(() => import("./StudioApp"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-brand-black" aria-busy="true" />,
});

export default function Studio() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-black" aria-busy="true" />}>
      <StudioApp />
    </Suspense>
  );
}
