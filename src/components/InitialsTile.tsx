// Initials tile for people without a photo yet: intentional brand artwork, not a "missing image".
import { initials } from "@/lib/team";
import { Star } from "./Logo";

export default function InitialsTile({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  return (
    <span aria-hidden="true" className="absolute inset-0 overflow-hidden bg-gradient-to-br from-accent-bright via-accent to-accent-deep">
      {/* Subtle dot grid */}
      <span className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1.5px)] [background-size:18px_18px]" />
      <span
        className={`absolute inset-0 flex items-center justify-center font-display font-semibold tracking-tight text-white/40 ${
          size === "lg" ? "text-[clamp(4.5rem,9vw,7.5rem)]" : "text-5xl sm:text-7xl"
        }`}
      >
        {initials(name)}
      </span>
      <Star size={size === "lg" ? 22 : 16} className="absolute bottom-5 left-5 text-brand-orange" />
    </span>
  );
}
