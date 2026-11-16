import Link from "@/components/TransitionLink";
import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import HeroBackground from "@/components/HeroBackground";
import AccentText from "@/components/AccentText";
import { getContent } from "@/cms/content";

export const metadata = {
  title: "Page not found | Smart Solutions",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const { notFound: nf } = await getContent();
  const big = nf.eyebrow || "404";
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-clip bg-accent px-4 py-32 text-center text-white">
      <HeroBackground ringsClassName="top-1/2" />
      <div className="mx-auto max-w-2xl">
        <p className="font-display text-[clamp(7rem,26vw,16rem)] font-semibold leading-none tracking-[-0.06em]">
          {big.length === 3 ? (
            <>
              {big[0]}
              <span className="text-brand-orange">{big[1]}</span>
              {big[2]}
            </>
          ) : (
            big
          )}
        </p>
        <h1 className="mt-4 font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold">
          <AccentText text={nf.heading} />
        </h1>
        {nf.text && <p className="mt-4 text-white/75">{nf.text}</p>}
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={nf.primary.href || "/"}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 font-semibold text-accent"
          >
            {nf.primary.label || "Back to home"}
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white">
              <ButtonArrow dir="up-right" />
            </span>
          </Link>
          {nf.secondary.label && (
          <Link
            href={nf.secondary.href || "/services"}
            className={`${arrowLink} justify-center rounded-full px-6 py-4 font-semibold ring-1 ring-white/40 transition-colors hover:bg-white/10`}
          >
            {nf.secondary.label}
            <ButtonArrow />
          </Link>
          )}
        </div>
      </div>
    </section>
  );
}
