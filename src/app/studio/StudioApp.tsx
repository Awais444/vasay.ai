"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export default function StudioApp() {
  if (!isSanityConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-black p-6 text-white">
        <div className="max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">Insights CMS</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">Connect Sanity to open the Studio</h1>
          <ol className="mt-6 list-decimal space-y-2 pl-5 text-white/80">
            <li>Create a free project at sanity.io/manage (dataset: production).</li>
            <li>
              Set <code className="text-brand-orange">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
              <code className="text-brand-orange">NEXT_PUBLIC_SANITY_DATASET</code> in .env.local (and on Vercel).
            </li>
            <li>Add this site&apos;s URL as a CORS origin (with credentials) in the Sanity project&apos;s API settings.</li>
            <li>Restart the dev server, or redeploy. Full steps are in the README.</li>
          </ol>
        </div>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
