import Link from "next/link";
import { ExternalLink, GitBranch, RadioTower } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { creator } from "@/lib/creator";
import { sources } from "@/lib/sources";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/network", label: "Network" },
  { href: "/#snap", label: "$SNAP" },
  { href: "/run-a-node", label: "Run a node" },
  { href: "/docs", label: "Docs" },
  { href: "/contribute", label: "Contribute" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34rem),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_30rem),#020617] text-slate-100">
      <a
        className="sr-only left-4 top-4 z-[60] rounded-md bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950 focus:fixed focus:not-sr-only focus:outline-none"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/78 backdrop-blur-xl">
        <div className="relative mx-auto flex min-h-16 w-full max-w-7xl flex-nowrap items-center justify-between gap-3 px-5 py-3 sm:px-6 lg:px-8">
          <Link
            className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
            href="/"
            aria-label="Hypersnap home"
            suppressHydrationWarning
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-cyan-300/35 bg-cyan-300/10">
              <RadioTower className="h-5 w-5 text-cyan-200" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-normal text-white">hypersnap.org</span>
          </Link>

          <nav className="hidden items-center justify-end gap-1 text-sm text-slate-300 md:flex">
            {navItems.map((item) => (
              <Link
                className="rounded-md px-3 py-2 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                href={item.href}
                key={item.href}
                suppressHydrationWarning
              >
                {item.label}
              </Link>
            ))}
            <a
              className="ml-1 inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 py-2 text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              href={sources.organization.url}
              target="_blank"
              rel="noreferrer"
              suppressHydrationWarning
            >
              <GitBranch className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          </nav>
          <MobileNav items={navItems} organizationUrl={sources.organization.url} />
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 text-sm text-slate-300 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <p className="text-base font-semibold text-white">Hypersnap</p>
            <p className="mt-3 max-w-md leading-6 text-slate-300">
              A decentralized social network, built by a global community of contributors. No
              company, no VC, no single owner.
            </p>
            <p className="mt-3 max-w-md leading-6 text-slate-400">
              The site updates itself from open repositories at github.com/farcasterorg through
              reviewable PRs.
            </p>
            <p className="mt-4 max-w-md leading-6 text-slate-300">
              Hypersnap.org is built and maintained by{" "}
              <a
                className="rounded-sm font-medium text-cyan-100 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                href={creator.website}
                target="_blank"
                rel="noreferrer"
                suppressHydrationWarning
              >
                {creator.name}
              </a>
              , a solo developer contributing to the new Farcaster.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
              The project
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  className="rounded-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  href="/about"
                  suppressHydrationWarning
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="rounded-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  href="/contribute"
                  suppressHydrationWarning
                >
                  Contribute
                </Link>
              </li>
              <li>
                <Link
                  className="rounded-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  href="/run-a-node"
                  suppressHydrationWarning
                >
                  Run a node
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
              For builders
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  className="rounded-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  href="/docs"
                  suppressHydrationWarning
                >
                  Docs hub
                </Link>
              </li>
              <li>
                <Link
                  className="rounded-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  href="/network"
                  suppressHydrationWarning
                >
                  Live network
                </Link>
              </li>
              <li>
                <a
                  className="rounded-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  href={`${sources.publicNode.baseUrl}/v1/info`}
                  suppressHydrationWarning
                >
                  Public node info
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
              Made by
            </p>
            <ul className="mt-4 space-y-2.5">
              {creator.links.map((link) => (
                <li key={link.href}>
                  <a
                    className="inline-flex items-center gap-2 rounded-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
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
              <li>
                <a
                  className="inline-flex items-center gap-2 rounded-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  href={sources.organization.url}
                  target="_blank"
                  rel="noreferrer"
                  suppressHydrationWarning
                >
                  GitHub org
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
            <p className="mt-4 max-w-xs text-xs leading-5 text-slate-400">
              Protocol work happens in public at Farcasterorg. This website is Felirami&apos;s
              contribution to make the new Farcaster easier to understand and join.
            </p>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="mx-auto w-full max-w-7xl px-5 py-5 text-xs text-slate-400 sm:px-6 lg:px-8">
            Hypersnap.org made by{" "}
            <a
              className="rounded-sm text-slate-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              href={creator.website}
              target="_blank"
              rel="noreferrer"
              suppressHydrationWarning
            >
              {creator.handle}
            </a>
            . Hypersnap protocol work stays open at Farcasterorg.
          </div>
        </div>
      </footer>
    </div>
  );
}
