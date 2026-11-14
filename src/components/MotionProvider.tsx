"use client";

import type { ReactNode } from "react";
import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/** Framer Motion with the small `m` component; animation features load after first paint. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
