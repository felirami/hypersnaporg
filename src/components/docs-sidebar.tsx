"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DocsSection } from "@/lib/sources";

export function DocsSidebar({ sections }: { sections: DocsSection[] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  return (
    <>
      {/* Mobile toggle */}
      <div className="mb-6 lg:hidden">
        <button
          aria-controls={menuId}
          aria-expanded={isOpen}
          className="inline-flex w-full items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <span>Browse docs</span>
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav
        aria-label="Documentation sections"
        className={`${isOpen ? "block" : "hidden"} lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}
        id={menuId}
      >
        <ul className="space-y-7 pb-6 text-sm">
          {sections.map((section) => (
            <li key={section.section}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
                {section.section}
              </p>
              <ul className="mt-3 space-y-0.5 border-l border-white/10">
                {section.links.map((link) => {
                  const href = `/docs/${link.slug}`;
                  const isActive = pathname === href;
                  return (
                    <li key={link.slug}>
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        className={`-ml-px block border-l py-1.5 pl-4 transition ${
                          isActive
                            ? "border-cyan-300 text-white"
                            : "border-transparent text-slate-300 hover:border-white/30 hover:text-white"
                        } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200`}
                        href={href}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
