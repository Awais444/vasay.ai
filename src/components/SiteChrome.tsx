"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** The embedded Sanity Studio (/studio) is a full-screen app with its own UI. */
export const useIsStudio = () => usePathname()?.startsWith("/studio") ?? false;

/** Renders the site's navbar/footer everywhere except inside the Studio. */
export function HideOnStudio({ children }: { children: ReactNode }) {
  return useIsStudio() ? null : <>{children}</>;
}
