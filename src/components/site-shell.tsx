"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, GitBranch, RadioTower } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { ScrollHeader } from "@/components/scroll-header";
import { creator } from "@/lib/creator";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/network", label: "Network" },
  { href: "/snap", label: "$SNAP" },
  { href: "/run-a-node", label: "Run a node" },
  { href: "/docs", label: "Docs" },
  { href: "/contribute", label: "Contribute" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      className={cn(
        "relative rounded-full px-3.5 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200",
        active ? "text-white" : "text-slate-400 hover:text-white",
      )}
      href={href}
      suppressHydrationWarning
    >
      {active ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.06]"
        />
      ) : null}
      <span className="relative">{label}</span>
    </Link>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,rgba(56,189,248,0.07),transparent_50%),radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(139,92,246,0.05),transparent_40%),#030712]"
      />
      <div aria-hidden="true" className="ambient-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <div aria-hidden="true" className="ambient-noise pointer-events-none fixed inset-0 -z-10" />

      <a
        className="sr-only left-4 top-4 z-[60] rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 focus:fixed focus:not-sr-only focus:outline-none"
        href="#main-content"
      >
        Skip to content
      </a>
      <ScrollHeader>
        <div className="relative mx-auto flex min-h-[4.25rem] w-full max-w-6xl flex-nowrap items-center justify-between gap-3 px-6 py-3 sm:px-8 lg:px-10">
          <Link
            className="flex min-w-0 items-center gap-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
            href="/"
            aria-label="Hypersnap home"
            suppressHydrationWarning
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08]">
              <RadioTower className="h-5 w-5 text-cyan-300" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-white">hypersnap.org</span>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center justify-end gap-0.5 md:flex">
            {navItems.map((item) => (
              <NavLink href={item.href} key={item.href} label={item.label} />
            ))}
            <a
              className="ml-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white transition hover:border-cyan-400/25 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              href={siteConfig.organizationUrl}
              target="_blank"
              rel="noreferrer"
              suppressHydrationWarning
            >
              <GitBranch className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          </nav>
          <MobileNav items={navItems} organizationUrl={siteConfig.organizationUrl} />
        </div>
      </ScrollHeader>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="relative mt-20 border-t border-white/[0.06]">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 text-sm text-slate-400 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-base font-semibold text-white">Hypersnap</p>
            <p className="mt-4 max-w-sm leading-7 text-slate-400">
              A decentralized social network, built by a global community of contributors. No
              company, no VC, no single owner.
            </p>
            <p className="mt-4 max-w-sm leading-7 text-slate-500">
              Hypersnap.org is built and maintained by{" "}
              <a
                className="font-medium text-cyan-200/90 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                href={creator.website}
                target="_blank"
                rel="noreferrer"
                suppressHydrationWarning
              >
                {creator.name}
              </a>
              .
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">The project</p>
            <ul className="mt-5 space-y-3">
              {["/about", "/contribute", "/run-a-node"].map((href) => (
                <li key={href}>
                  <Link
                    className="rounded-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                    href={href}
                    suppressHydrationWarning
                  >
                    {href === "/about" ? "About" : href === "/contribute" ? "Contribute" : "Run a node"}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">For builders</p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link className="rounded-sm hover:text-white" href="/docs" suppressHydrationWarning>
                  Docs hub
                </Link>
              </li>
              <li>
                <Link className="rounded-sm hover:text-white" href="/network" suppressHydrationWarning>
                  Live network
                </Link>
              </li>
              <li>
                <a
                  className="rounded-sm hover:text-white"
                  href={`${siteConfig.publicNodeBaseUrl}/v1/info`}
                  suppressHydrationWarning
                >
                  Public node info
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Made by</p>
            <ul className="mt-5 space-y-3">
              {creator.links.map((link) => (
                <li key={link.href}>
                  <a
                    className="inline-flex items-center gap-2 rounded-sm hover:text-white"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    suppressHydrationWarning
                  >
                    {link.label}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.04]">
          <div className="mx-auto w-full max-w-6xl px-6 py-6 text-xs leading-6 text-slate-500 sm:px-8 lg:px-10">
            Hypersnap.org · Protocol work is open source at{" "}
            <a
              className="font-medium text-cyan-200/90 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              href={siteConfig.organizationUrl}
              target="_blank"
              rel="noreferrer"
              suppressHydrationWarning
            >
              github.com/farcasterorg
            </a>
            , where all repos live and anyone can contribute.
          </div>
        </div>
      </footer>
    </div>
  );
}
