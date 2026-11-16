import { coverTheme } from "@/lib/covers";

/** Fallback cover for articles without a photo: brand gradient with the category icon. Fills its parent. */
export default function BrandCover({ category }: { category?: { slug: string } }) {
  const theme = coverTheme(category?.slug);
  const Icon = theme.icon;
  return (
    <div
      aria-hidden="true"
      className="@container absolute inset-0 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)` }}
    >
      <Icon strokeWidth={1} className="absolute left-1/2 top-1/2 h-[34cqw] w-[34cqw] -translate-x-1/2 -translate-y-1/2 text-white/35" />
    </div>
  );
}
