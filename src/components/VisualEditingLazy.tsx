"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * Sanity's click-to-edit overlays, imported only when this renders (Draft Mode).
 * A plain import() keeps both the overlays and any loader runtime out of public pages.
 */
export default function VisualEditingLazy() {
  const [VE, setVE] = useState<ComponentType | null>(null);
  useEffect(() => {
    let alive = true;
    import("next-sanity/visual-editing").then((m) => alive && setVE(() => m.VisualEditing));
    return () => {
      alive = false;
    };
  }, []);
  return VE ? <VE /> : null;
}
