"use client";

import Link from "next/link";
import { GitBranch, Menu, X } from "lucide-react";
import { useId, useState } from "react";

type MobileNavItem = {
  href: string;
  label: string;
};

export function MobileNav({
  items,
  organizationUrl,
}: {
  items: MobileNavItem[];
  organizationUrl: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  return (
    <div className="md:hidden">
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-100 transition hover:border-cyan-400/25 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>

      {isOpen ? (
        <div
          className="absolute inset-x-6 top-full mt-2 rounded-2xl border border-white/10 bg-[#030712]/95 p-2 shadow-2xl backdrop-blur-xl"
          id={menuId}
        >
          <nav aria-label="Mobile navigation" className="grid gap-1">
            {items.map((item) => (
              <Link
                className="rounded-md px-3 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
                suppressHydrationWarning
              >
                {item.label}
              </Link>
            ))}
            <a
              className="mt-1 inline-flex items-center justify-between gap-3 rounded-md border border-white/12 bg-white/[0.04] px-3 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              href={organizationUrl}
              rel="noreferrer"
              target="_blank"
              suppressHydrationWarning
            >
              Farcasterorg GitHub
              <GitBranch className="h-4 w-4 text-cyan-200" aria-hidden="true" />
            </a>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
