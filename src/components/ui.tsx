import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { CopyCommand } from "@/components/copy-command";
import { cn } from "@/lib/utils";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[0.65rem] font-medium uppercase leading-5 tracking-[0.12em] text-cyan-200/90 sm:text-xs">
      {children}
    </span>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
    >
      <div className="mb-14 max-w-2xl">
        {eyebrow ? <Badge>{eyebrow}</Badge> : null}
        <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          {title}
        </h2>
        {description ? (
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function PageHeaderAccent() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -left-4 -top-6 h-32 w-64 opacity-20 sm:-left-8 sm:h-40 sm:w-80"
      viewBox="0 0 320 160"
      fill="none"
    >
      <circle cx="40" cy="80" r="4" fill="rgba(56,189,248,0.8)" />
      <circle cx="120" cy="40" r="3" fill="rgba(139,92,246,0.7)" />
      <circle cx="200" cy="100" r="3.5" fill="rgba(56,189,248,0.6)" />
      <circle cx="280" cy="60" r="3" fill="rgba(52,211,153,0.6)" />
      <line x1="40" y1="80" x2="120" y2="40" stroke="rgba(56,189,248,0.2)" strokeWidth="1" />
      <line x1="120" y1="40" x2="200" y2="100" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
      <line x1="200" y1="100" x2="280" y2="60" stroke="rgba(56,189,248,0.15)" strokeWidth="1" />
    </svg>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28 lg:px-10 lg:pb-24 lg:pt-32">
      <PageHeaderAccent />
      <Badge>{eyebrow}</Badge>
      <h1 className="relative mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.02em] sm:text-5xl lg:text-6xl">
        <span className="text-gradient-hero">{title}</span>
      </h1>
      <p className="relative mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-400">{description}</p>
    </header>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
}) {
  const className = cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    variant === "primary"
      ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300 hover:shadow-[0_0_32px_rgba(56,189,248,0.35)] focus-visible:outline-cyan-200"
      : "border border-white/10 bg-white/[0.03] text-white backdrop-blur-sm hover:border-cyan-400/30 hover:bg-white/[0.06] hover:shadow-[0_0_24px_rgba(56,189,248,0.12)] focus-visible:outline-cyan-200",
  );

  const icon = external ? (
    <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
  ) : (
    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
  );

  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer" suppressHydrationWarning>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <Link className={className} href={href} suppressHydrationWarning>
      {children}
      {icon}
    </Link>
  );
}

export function StatCard({
  label,
  value,
  detail,
  icon: IconComponent,
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: Icon;
}) {
  const isLive = value === "Online";

  return (
    <div className="glass-panel group relative min-h-36 min-w-0 overflow-hidden rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-60" />
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="pulse-live h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" aria-hidden="true" />
          ) : null}
          {IconComponent ? <IconComponent className="h-5 w-5 text-cyan-300/80" aria-hidden="true" /> : null}
        </div>
      </div>
      <p className="mt-5 font-mono text-3xl tabular-nums tracking-tight text-white">{value}</p>
      {detail ? <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p> : null}
    </div>
  );
}

export function CodeBlock({
  command,
  label,
}: {
  command: string;
  label?: string;
}) {
  return (
    <div className="glass-panel relative min-w-0 overflow-hidden rounded-2xl">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/60" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" aria-hidden="true" />
        <span className="ml-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
          {label ?? "Command"}
        </span>
        <div className="ml-auto">
          <CopyCommand value={command} />
        </div>
      </div>
      <pre className="min-w-0 overflow-x-auto whitespace-pre-wrap break-words p-5 font-mono text-sm leading-7 text-slate-200">
        <code>{command}</code>
      </pre>
    </div>
  );
}

export function InfoPanel({
  title,
  children,
  icon: IconComponent,
}: {
  title: string;
  children: React.ReactNode;
  icon?: Icon;
}) {
  return (
    <div className="glass-panel group min-w-0 rounded-2xl p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/15">
      <div className="flex items-center gap-4">
        {IconComponent ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06]">
            <IconComponent className="h-5 w-5 text-cyan-300/90" aria-hidden="true" />
          </span>
        ) : null}
        <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
      </div>
      <div className="mt-5 text-sm leading-7 text-slate-400">{children}</div>
    </div>
  );
}

export function ProseBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("glass-panel rounded-2xl p-7 text-base leading-7 text-slate-300 sm:p-8", className)}>
      {children}
    </div>
  );
}

export function AccentCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl border-cyan-400/15 bg-cyan-400/[0.04] p-7 sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function WarningPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-2xl border-amber-400/20 bg-amber-400/[0.04] p-6 text-sm leading-7 text-slate-300">
      {children}
    </div>
  );
}

export function ShardCard({
  shardId,
  blockDelay,
  maxHeight,
  numMessages,
  approxSize,
}: {
  shardId: number;
  blockDelay: string;
  maxHeight: string;
  numMessages: string;
  approxSize: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-mono text-xl tracking-tight text-white">Shard {shardId}</h3>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
          delay {blockDelay}
        </span>
      </div>
      <dl className="mt-6 grid gap-4 text-sm">
        <div className="flex justify-between gap-4 border-b border-white/[0.06] pb-3">
          <dt className="text-slate-500">Max height</dt>
          <dd className="font-mono text-white">{maxHeight}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-white/[0.06] pb-3">
          <dt className="text-slate-500">Messages</dt>
          <dd className="font-mono text-white">{numMessages}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Approx size</dt>
          <dd className="font-mono text-white">{approxSize}</dd>
        </div>
      </dl>
    </div>
  );
}

export function RepoCard({
  name,
  language,
  summary,
  stars,
  forks,
  openIssues,
  url,
}: {
  name: string;
  language: string;
  summary: string;
  stars: number;
  forks: number;
  openIssues: number;
  url: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.14em] text-slate-500">{language}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{name}</h2>
        </div>
        <LinkButton href={url} variant="secondary" external>
          GitHub
        </LinkButton>
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-400">{summary}</p>
      <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
        {(
          [
            ["Stars", stars],
            ["Forks", forks],
            ["Issues", openIssues],
          ] as const
        ).map(([label, value]) => (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3" key={label}>
            <dt className="text-slate-500">{label}</dt>
            <dd className="mt-1 font-mono text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
