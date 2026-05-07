import type { Metadata } from "next";
import Link from "next/link";
import { Bot, BookOpen, Braces, ExternalLink, FileText, GitBranch, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/format";
import { getDocsTree, getRepo, sources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Hypersnap documentation, mirrored on-site from the open Farcasterorg source repos. API reference, concepts, runbooks, and AI-agent guides.",
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsPage() {
  const docsRepo = getRepo("hypersnap-docs-web");
  const sections = getDocsTree();
  const introDoc = sections
    .flatMap((section) => section.links)
    .find((link) => link.slug === "introduction" || link.slug === "getting-started");

  const totalDocs = sections.reduce((acc, section) => acc + section.links.length, 0);
  const lastSync = formatDate(sources.sourceUpdatedAt);

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_14rem]">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">Docs</p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-normal text-white sm:text-5xl">
          Read the docs without leaving the site.
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
          Every page here is rendered from the open source docs in{" "}
          <a
            className="text-cyan-200 underline underline-offset-4 hover:text-white"
            href={docsRepo?.url ?? "https://github.com/farcasterorg/hypersnap-docs-web"}
            rel="noreferrer"
            target="_blank"
          >
            farcasterorg/hypersnap-docs-web
          </a>
          . The original repo is the source of truth — we just mirror, link back, and keep things in
          sync.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <FileText aria-hidden="true" className="h-4 w-4 text-cyan-200" />
            {totalDocs} pages mirrored
          </span>
          <span>Last synced: {lastSync}</span>
          <a
            className="inline-flex items-center gap-1.5 text-cyan-200 underline-offset-4 hover:underline"
            href={docsRepo?.url ?? "https://github.com/farcasterorg/hypersnap-docs-web"}
            rel="noreferrer"
            target="_blank"
          >
            View source repo
            <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>

        {introDoc?.slug ? (
          <div className="mt-8">
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100"
              href={`/docs/${introDoc.slug}`}
            >
              Start reading
            </Link>
          </div>
        ) : null}

        <hr className="my-10 border-white/8" />

        <h2 className="text-2xl font-semibold text-white">Pick the path that fits.</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <PathCard
            icon={Braces}
            title="Building an app"
            body="The HTTP API is Farcaster v2-compatible — users, casts, feeds, channels, reactions, follows, search, batch reads, webhooks, and mini-app notifications. Anything built for Farcaster works here."
            ctaLabel="Open API reference"
            ctaHref={resolveSectionEntry(sections, ["Read API reference", "Webhooks"])}
          />
          <PathCard
            icon={BookOpen}
            title="Running a node"
            body="Bootstrap script, port map, runbook, live status. Move from public reads into running your own piece of the network."
            ctaLabel="Operator guides"
            ctaHref="/run-a-node"
            external={false}
          />
          <PathCard
            icon={Bot}
            title="Coding with an AI agent"
            body="LLM-friendly index and full-spec exports help coding agents integrate without scraping HTML. Point your agent at /llms-full.txt for everything in one file."
            ctaLabel="Open AI agents guide"
            ctaHref={resolveSectionEntry(sections, ["For AI agents", "Agents"])}
          />
        </div>

        <hr className="my-10 border-white/8" />

        <h2 className="text-2xl font-semibold text-white">All sections.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Browse the full documentation by topic. Each page is rendered on the site with a link back
          to the source on GitHub.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {sections.map((section) => (
            <div
              className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
              key={section.section}
            >
              <h3 className="text-lg font-semibold text-white">{section.section}</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {section.links.map((link) => (
                  <li key={link.slug}>
                    <Link
                      className="text-slate-300 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                      href={`/docs/${link.slug}`}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-10 border-white/8" />

        <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.05] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-100">
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                For AI agents
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                Two plain-text endpoints are designed for coding agents: an index of all docs, and a
                single concatenated file with everything inline.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex h-10 items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                href="/llms.txt"
              >
                /llms.txt
              </a>
              <a
                className="inline-flex h-10 items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                href="/llms-full.txt"
              >
                /llms-full.txt
              </a>
            </div>
          </div>
        </div>
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-24 rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
            <GitBranch aria-hidden="true" className="h-3.5 w-3.5" />
            Source repository
          </p>
          <p className="mt-3 break-words text-sm text-white">
            {docsRepo?.name ?? "hypersnap-docs-web"}
          </p>
          <p className="mt-1 break-words text-xs leading-5 text-slate-400">
            github.com/{sources.organization.login}/{docsRepo?.name ?? "hypersnap-docs-web"}
          </p>
          <a
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-cyan-200 underline-offset-4 hover:underline"
            href={docsRepo?.url ?? "https://github.com/farcasterorg/hypersnap-docs-web"}
            rel="noreferrer"
            target="_blank"
          >
            View on GitHub
            <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>
      </aside>
    </div>
  );
}

function resolveSectionEntry(
  sections: ReturnType<typeof getDocsTree>,
  candidateNames: string[],
): string {
  for (const candidate of candidateNames) {
    const section = sections.find(
      (item) => item.section.toLowerCase() === candidate.toLowerCase(),
    );
    const first = section?.links[0];
    if (first?.slug) {
      return `/docs/${first.slug}`;
    }
  }
  return "/docs";
}

type Icon = (props: { className?: string; "aria-hidden"?: boolean | "true" }) => React.ReactNode;

function PathCard({
  icon: IconComponent,
  title,
  body,
  ctaLabel,
  ctaHref,
  external = false,
}: {
  icon: Icon;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
}) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-3">
        <IconComponent aria-hidden="true" className="h-5 w-5 text-cyan-200" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{body}</p>
      <div className="mt-4">
        {external ? (
          <a
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-200 underline-offset-4 hover:underline"
            href={ctaHref}
            rel="noreferrer"
            target="_blank"
          >
            {ctaLabel}
            <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        ) : (
          <Link
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-200 underline-offset-4 hover:underline"
            href={ctaHref}
          >
            {ctaLabel} →
          </Link>
        )}
      </div>
    </div>
  );
}
