import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { CopyCommand } from "@/components/copy-command";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[0.65rem] font-medium uppercase leading-5 tracking-[0.1em] text-cyan-100 sm:text-xs sm:tracking-[0.14em]">
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
    <section id={id} className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-10 max-w-3xl">
        {eyebrow ? <Badge>{eyebrow}</Badge> : null}
        <h2 className="mt-5 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
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
    <header className="mx-auto w-full max-w-7xl px-5 pb-12 pt-16 sm:px-6 lg:px-8 lg:pb-16 lg:pt-24">
      <Badge>{eyebrow}</Badge>
      <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-normal text-white sm:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{description}</p>
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
  const className =
    variant === "primary"
      ? "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
      : "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10";

  const icon = external ? <ExternalLink className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />;

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
  return (
    <div className="min-h-32 rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-400">{label}</p>
        {IconComponent ? <IconComponent className="h-5 w-5 text-cyan-200" aria-hidden="true" /> : null}
      </div>
      <p className="mt-4 font-mono text-3xl text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p> : null}
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
    <div className="rounded-lg border border-cyan-300/20 bg-slate-950/80 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-cyan-200">
          {label ?? "Command"}
        </span>
        <CopyCommand value={command} />
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-slate-100">
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
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center gap-3">
        {IconComponent ? <IconComponent className="h-5 w-5 text-cyan-200" aria-hidden="true" /> : null}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="mt-4 text-sm leading-6 text-slate-300">{children}</div>
    </div>
  );
}
