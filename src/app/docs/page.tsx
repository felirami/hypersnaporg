import type { Metadata } from "next";
import { Bot, BookOpen, Braces, ChevronRight, ExternalLink, FileText, Play } from "lucide-react";
import { CodeBlock, InfoPanel, LinkButton, PageHeader, Section } from "@/components/ui";
import { getDocsLinks, getRepo, sources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Docs",
  description: "Curated Hypersnap documentation paths for API developers, node operators, and agents.",
  alternates: {
    canonical: "/docs",
  },
};

function groupedDocs() {
  const groups = new Map<string, ReturnType<typeof getDocsLinks>>();
  for (const link of getDocsLinks()) {
    const current = groups.get(link.section) ?? [];
    current.push(link);
    groups.set(link.section, current);
  }
  return [...groups.entries()];
}

export default function DocsPage() {
  const docsRepo = getRepo("hypersnap-docs-web");
  const groups = groupedDocs();

  return (
    <>
      <PageHeader
        eyebrow="Docs hub"
        title="If you're building something, start here."
        description="The pages link directly to source files in the open repos, so what you read is what's actually shipping. Pick the path that fits your work."
      />

      <Section title="Start with the path that matches your work.">
        <div className="grid gap-5 lg:grid-cols-3">
          <InfoPanel icon={Braces} title="Building an app">
            <p className="mb-4">
              The HTTP API is Farcaster v2-compatible: users, casts, feeds, channels, reactions,
              follows, search, batch reads, webhooks, mini-app notifications. Anything built for
              Farcaster works here.
            </p>
            <CodeBlock label="First request" command={`curl -s "${sources.publicNode.baseUrl}${sources.publicNode.apiPrefix}/user?fid=3" | jq .`} />
          </InfoPanel>
          <InfoPanel icon={BookOpen} title="Running a node">
            <p>
              Bootstrap script, port map, runbook, live node status. Everything you need to move
              from reading the public node to running your own.
            </p>
          </InfoPanel>
          <InfoPanel icon={Bot} title="Coding with an AI agent">
            <p>
              The docs include LLM-friendly indexes and full-spec pages, so coding agents can
              integrate against Hypersnap without scraping rendered HTML.
            </p>
          </InfoPanel>
        </div>
      </Section>

      <Section
        eyebrow="Source index"
        title="Every page points back to its source."
        description="These links go straight to the markdown files in the open Farcasterorg repos. The site doesn't reframe or rewrite — it tracks the source so you always read what's actually there."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {groups.length > 0 ? (
            groups.map(([section, links]) => {
              const visibleLinks = links.slice(0, 8);
              const remainingLinks = links.slice(8);

              return (
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5" key={section}>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="flex min-w-0 items-center gap-2 text-lg font-semibold text-white">
                      <FileText className="h-5 w-5 shrink-0 text-cyan-200" aria-hidden="true" />
                      <span>{section}</span>
                    </h2>
                    <span className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300">
                      {links.length} files
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {visibleLinks.map((link) => (
                      <DocsSourceLink key={`${link.repoName}-${link.sourcePath}`} link={link} />
                    ))}
                  </div>
                  {remainingLinks.length > 0 ? (
                    <details className="group mt-3 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200">
                        <ChevronRight
                          className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-90"
                          aria-hidden="true"
                        />
                        <span>Show {remainingLinks.length} more source files</span>
                      </summary>
                      <div className="mt-2 grid gap-2">
                        {remainingLinks.map((link) => (
                          <DocsSourceLink key={`${link.repoName}-${link.sourcePath}`} link={link} />
                        ))}
                      </div>
                    </details>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-sm leading-6 text-slate-300 lg:col-span-2">
              No docs links were found in the current Farcasterorg source snapshot. Run{" "}
              <code className="font-mono text-cyan-100">npm run sync:sources</code> to refresh the
              local data.
            </div>
          )}
        </div>
      </Section>

      <Section title="Open the full docs source.">
        <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Canonical docs repo</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {docsRepo?.name ?? "hypersnap-docs-web"}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                mdBook source, API references, playground notes, and LLM-friendly exports for agents.
              </p>
            </div>
            <LinkButton href={docsRepo?.url ?? "https://github.com/farcasterorg/hypersnap-docs-web"} external>
              Open docs repo
            </LinkButton>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Playground"
        title="Try the API against live data."
        description="No login, no API key. Curl the public node and start exploring."
      >
        <InfoPanel icon={Play} title="Public node examples">
          <p>
            Every example on this website targets <code className="font-mono text-cyan-100">{sources.publicNode.baseUrl}</code>.
            Swap in your own hostname once you&apos;re running your own node.
          </p>
        </InfoPanel>
      </Section>
    </>
  );
}

type DocsLink = ReturnType<typeof getDocsLinks>[number];

function DocsSourceLink({ link }: { link: DocsLink }) {
  return (
    <a
      className="flex items-center justify-between gap-4 rounded-md border border-white/8 bg-slate-950/35 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
      href={link.githubUrl}
      rel="noreferrer"
      target="_blank"
      suppressHydrationWarning
    >
      <span className="min-w-0 break-words">{link.title}</span>
      <ExternalLink className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
    </a>
  );
}
