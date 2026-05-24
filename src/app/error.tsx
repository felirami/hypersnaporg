"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { AccentCard, LinkButton } from "@/components/ui";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-20 sm:px-8 sm:py-28 lg:px-10">
      <div className="relative mb-10 max-w-2xl">
        <p className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-4 py-1.5 text-[0.65rem] font-medium uppercase leading-5 tracking-[0.12em] text-amber-200/90 sm:text-xs">
          Error
        </p>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
          <span className="text-gradient-hero">Something went wrong.</span>
        </h1>
        <p className="mt-6 text-pretty text-lg leading-8 text-slate-400">
          An unexpected error interrupted this page. You can try again, or head back to a stable part
          of the site.
        </p>
      </div>

      <AccentCard className="flex flex-col items-start gap-6 border-amber-400/20 bg-amber-400/[0.04] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.08]">
            <AlertTriangle className="h-6 w-6 text-amber-300/90" aria-hidden="true" />
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">Unexpected failure</p>
            {error.digest ? (
              <p className="mt-1 font-mono text-sm text-slate-500">Reference: {error.digest}</p>
            ) : (
              <p className="mt-1 text-sm text-slate-500">The page could not be rendered.</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-cyan-300 hover:shadow-[0_0_32px_rgba(56,189,248,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            onClick={() => unstable_retry()}
          >
            Try again
          </button>
          <LinkButton href="/" variant="secondary">
            Back home
          </LinkButton>
        </div>
      </AccentCard>
    </div>
  );
}
