import type { Metadata } from "next";
import { CalendarClock, GitBranch, GitPullRequest, Lightbulb, Megaphone, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { InfoPanel, LinkButton, PageHeader, Section } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getPrimaryRepos, sources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Contribute",
  description: "Contribute to Hypersnap across the protocol, docs, API, and website repositories.",
  alternates: {
    canonical: "/contribute",
  },
};

export default function ContributePage() {
  const repos = getPrimaryRepos();

  return (
    <>
      <PageHeader
        eyebrow="Contribute"
        title="Anyone can help build it."
        description="Hypersnap is built by a global community of contributors — no company, no VC, no single owner. Code matters, and so do docs, design, ideas, and running a node. Here's where the work happens and how to plug in."
      />

      <Section
        eyebrow="Where the work lives"
        title="The public repositories."
        description={`Everything is on GitHub at github.com/farcasterorg. Every change is a PR. The snapshot below was last refreshed on ${formatDate(sources.sourceUpdatedAt)}.`}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {repos.map((repo) => (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6" key={repo.name}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">
                    {repo.primaryLanguage ?? (repo.isEmpty ? "Empty repo" : "Repository")}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{repo.name}</h2>
                </div>
                <LinkButton href={repo.url} variant="secondary" external>
                  GitHub
                </LinkButton>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{repo.readmeSummary}</p>
              <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-md border border-white/8 bg-slate-950/35 p-3">
                  <dt className="text-slate-400">Stars</dt>
                  <dd className="mt-1 font-mono text-white">{repo.stars}</dd>
                </div>
                <div className="rounded-md border border-white/8 bg-slate-950/35 p-3">
                  <dt className="text-slate-400">Forks</dt>
                  <dd className="mt-1 font-mono text-white">{repo.forks}</dd>
                </div>
                <div className="rounded-md border border-white/8 bg-slate-950/35 p-3">
                  <dt className="text-slate-400">Issues</dt>
                  <dd className="mt-1 font-mono text-white">{repo.openIssues}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How to help"
        title="Every kind of contribution counts."
        description="You don't have to be a Rust engineer to make a difference. Here are some of the most useful places to start."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <InfoPanel icon={GitBranch} title="Write code">
            <p>
              The protocol lives in <code className="font-mono text-cyan-100">farcasterorg/hypersnap</code>:
              Rust node logic, hyper mode, storage, gossip, snapshots. Issues are open and triaged
              in public.
            </p>
          </InfoPanel>
          <InfoPanel icon={GitPullRequest} title="Improve the docs">
            <p>
              Reference pages, guides, examples, LLM-friendly exports — anything that helps the
              next person figure something out faster.
            </p>
          </InfoPanel>
          <InfoPanel icon={ShieldCheck} title="Review what changed">
            <p>
              The site auto-syncs from source and opens a PR when things change. A second pair of
              eyes on those PRs keeps the portal honest.
            </p>
          </InfoPanel>
          <InfoPanel icon={Users} title="Run a node">
            <p>
              The most direct way to make the network more decentralized. Every node added makes
              the whole thing harder to take down.
            </p>
          </InfoPanel>
          <InfoPanel icon={ShieldCheck} title="Improve node tooling">
            <p className="mb-4">
              The operator helper lives at{" "}
              <code className="font-mono text-cyan-100">arcabotai/hypersnap</code>: installer,
              doctor checks, sanitized reports, and safe repair workflows for people running nodes.
            </p>
            <LinkButton href="https://github.com/arcabotai/hypersnap" variant="secondary" external>
              Open toolkit repo
            </LinkButton>
          </InfoPanel>
          <InfoPanel icon={Megaphone} title="Tell people about it">
            <p>
              Decentralized networks grow when people know they exist. Share the project, write
              about it, talk about it.
            </p>
          </InfoPanel>
          <InfoPanel icon={Lightbulb} title="Bring ideas">
            <p>
              Open an issue, start a discussion, sketch a design. The project moves on the strength
              of its contributors&apos; thinking — yours included.
            </p>
          </InfoPanel>
        </div>
      </Section>

      <Section
        eyebrow="Automation"
        title="How the site stays honest."
        description="A scheduled GitHub Action runs the same sync command maintainers can run locally, validates the site, and opens a reviewable PR whenever the source data changes."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <InfoPanel icon={RefreshCw} title="Curated snapshots">
            <p>
              The sync imports a focused set of facts: repo metadata, README summaries, release
              data, docs indexes, public node details, bootstrap commands, and architecture notes.
            </p>
          </InfoPanel>
          <InfoPanel icon={CalendarClock} title="Daily, but only when there's news">
            <p>
              The workflow ignores timestamp churn — it only opens a PR when the source repos
              actually have meaningful updates.
            </p>
          </InfoPanel>
        </div>
      </Section>
    </>
  );
}
