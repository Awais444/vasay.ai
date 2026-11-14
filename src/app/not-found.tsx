import Link from "@/components/TransitionLink";
import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import HeroBackground from "@/components/HeroBackground";

export const metadata = {
  title: "Page not found | Smart Solutions",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-clip bg-accent px-4 py-32 text-center text-white">
      <HeroBackground ringsClassName="top-1/2" />
      <div className="mx-auto max-w-2xl">
        <p className="font-display text-[clamp(7rem,26vw,16rem)] font-semibold leading-none tracking-[-0.06em]">
          4<span className="text-brand-orange">0</span>4
        </p>
        <h1 className="mt-4 font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold">This page took a wrong turn.</h1>
        <p className="mt-4 text-white/75">The page you&apos;re looking for has moved or doesn&apos;t exist.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 font-semibold text-accent"
          >
            Back to home
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white">
              <ButtonArrow dir="up-right" />
            </span>
          </Link>
          <Link
            href="/services"
            className={`${arrowLink} justify-center rounded-full px-6 py-4 font-semibold ring-1 ring-white/40 transition-colors hover:bg-white/10`}
          >
            Explore services
            <ButtonArrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
