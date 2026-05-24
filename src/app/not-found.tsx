import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { AccentCard, LinkButton, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist on Hypersnap.org.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="404"
        title="This path isn't on the network."
        description="The page you're looking for doesn't exist or may have moved. Try heading home or browse the docs."
      />
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8 lg:px-10">
        <AccentCard className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06]">
              <Compass className="h-6 w-6 text-cyan-300/90" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-4xl font-semibold tracking-tight text-white">404</p>
              <p className="mt-1 text-sm text-slate-500">Resource not found</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/">Back home</LinkButton>
            <LinkButton href="/docs" variant="secondary">
              Browse docs
            </LinkButton>
          </div>
        </AccentCard>
      </div>
    </>
  );
}
