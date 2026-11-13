import { Bot, Code2, LayoutTemplate, Megaphone, Palette, Search, Share2, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ServiceIconName } from "@/lib/services";

const ICONS: Record<ServiceIconName, LucideIcon> = {
  Palette,
  LayoutTemplate,
  Code2,
  Search,
  Share2,
  Megaphone,
  Bot,
  ShieldCheck,
};

/** The icon for a service (name stored in src/lib/services.ts). */
export function ServiceIcon({ name, size = 20, className = "" }: { name: ServiceIconName; size?: number; className?: string }) {
  const Icon = ICONS[name];
  return <Icon size={size} strokeWidth={1.75} className={className} aria-hidden="true" />;
}

/**
 * 40×40 icon box: light Klein tint with a Klein Blue icon.
 * Inside a `group`, hovering (or `active`) flips it to Klein Blue with a white icon and nudges the icon up 2px.
 */
export function ServiceIconBox({
  name,
  active = false,
  className = "",
}: {
  name: ServiceIconName;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        active ? "bg-accent text-white" : "bg-[#F1F0FB] text-accent group-hover:bg-accent group-hover:text-white group-focus-visible:bg-accent group-focus-visible:text-white"
      } ${className}`}
    >
      <ServiceIcon
        name={name}
        className={`transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          active ? "-translate-y-0.5" : "group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5"
        }`}
      />
    </span>
  );
}
