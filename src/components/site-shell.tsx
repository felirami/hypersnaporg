import Link from "next/link";
import { GitBranch, RadioTower } from "lucide-react";
import { sources } from "@/lib/sources";

const navItems = [
  { href: "/network", label: "Network" },
  { href: "/run-a-node", label: "Run a node" },
  { href: "/docs", label: "Docs" },
  { href: "/contribute", label: "Contribute" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34rem),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_30rem),#020617] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/78 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-6 lg:px-8">
          <Link
            className="flex items-center gap-3"
            href="/"
            aria-label="Hypersnap home"
            suppressHydrationWarning
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-cyan-300/35 bg-cyan-300/10">
              <RadioTower className="h-5 w-5 text-cyan-200" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-normal text-white">hypersnap.org</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-1 text-sm text-slate-300">
            {navItems.map((item) => (
              <Link
                className="rounded-md px-3 py-2 transition hover:bg-white/[0.06] hover:text-white"
                href={item.href}
                key={item.href}
                suppressHydrationWarning
              >
                {item.label}
              </Link>
            ))}
            <a
              className="ml-1 inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 py-2 text-white transition hover:border-cyan-300/50"
              href={sources.organization.url}
              target="_blank"
              rel="noreferrer"
              suppressHydrationWarning
            >
              <GitBranch className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-white/10">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 text-sm text-slate-400 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <p className="font-semibold text-white">Hypersnap</p>
            <p className="mt-2 max-w-2xl leading-6">
              A decentralized fork of Snapchain for Farcaster data, APIs, operators, and builders.
              Source snapshots are synced from Farcasterorg repositories through reviewable PRs.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-3 md:justify-end">
            <a
              className="hover:text-white"
              href={`${sources.publicNode.baseUrl}/v1/info`}
              suppressHydrationWarning
            >
              Public node info
            </a>
            <a className="hover:text-white" href={sources.organization.url} suppressHydrationWarning>
              Farcasterorg
            </a>
            <Link className="hover:text-white" href="/docs" suppressHydrationWarning>
              Docs hub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
