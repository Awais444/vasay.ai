"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "./TransitionProvider";

type Props = ComponentProps<typeof Link>;

/** Drop-in replacement for next/link that plays the slide-push page transition. Prefetch is kept. */
export default function TransitionLink({ onClick, href, target, ...rest }: Props) {
  const { navigate } = usePageTransition();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (target && target !== "_self") return;

    const raw = typeof href === "string" ? href : (href.pathname ?? "") + (href.hash ? `#${href.hash.replace(/^#/, "")}` : "");
    const url = new URL(raw, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname) return; // same page or same-page hash: no transition

    e.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  };

  return <Link href={href} target={target} onClick={handle} {...rest} />;
}
