import type { Metadata } from "next";
import { CalendarClock, GitBranch, GitPullRequest, RefreshCw, ShieldCheck } from "lucide-react";
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
        title="The fork is open because the work should be inspectable."
        description="Hypersnap.org keeps contributors close to the source repos, tracks upstream source updates by PR, and makes the current state of the project visible."
      />

      <Section
        title="Public Farcasterorg repositories"
        description={`The source snapshot was last updated from GitHub on ${formatDate(sources.sourceUpdatedAt)}.`}
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
                  <dt className="text-slate-500">Stars</dt>
                  <dd className="mt-1 font-mono text-white">{repo.stars}</dd>
                </div>
                <div className="rounded-md border border-white/8 bg-slate-950/35 p-3">
                  <dt className="text-slate-500">Forks</dt>
                  <dd className="mt-1 font-mono text-white">{repo.forks}</dd>
                </div>
                <div className="rounded-md border border-white/8 bg-slate-950/35 p-3">
                  <dt className="text-slate-500">Issues</dt>
                  <dd className="mt-1 font-mono text-white">{repo.openIssues}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="How to help" title="Pick the layer that matches your leverage.">
        <div className="grid gap-5 md:grid-cols-3">
          <InfoPanel icon={GitBranch} title="Protocol implementation">
            <p>
              Work in <code className="font-mono text-cyan-100">farcasterorg/hypersnap</code> for
              Rust node logic, hyper mode, storage, gossip, snapshots, and operations.
            </p>
          </InfoPanel>
          <InfoPanel icon={GitPullRequest} title="Docs and API clarity">
            <p>
              Improve reference pages, guide coverage, LLM-friendly exports, or examples in the docs
              web repository.
            </p>
          </InfoPanel>
          <InfoPanel icon={ShieldCheck} title="Website source updates">
            <p>
              Let the scheduled source-sync PR show what changed, review the generated snapshot, then
              merge when the portal still tells the truth.
            </p>
          </InfoPanel>
        </div>
      </Section>

      <Section
        eyebrow="Automation"
        title="The website repo keeps itself honest."
        description="A scheduled GitHub Action runs the same sync command maintainers can run locally, validates the site, and opens a reviewable PR when Farcasterorg source data changes."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <InfoPanel icon={RefreshCw} title="Curated snapshots">
            <p>
              The sync imports selected facts: repo metadata, README summaries, release data, docs
              indexes, public node details, bootstrap commands, and architecture notes.
            </p>
          </InfoPanel>
          <InfoPanel icon={CalendarClock} title="Daily PR cadence">
            <p>
              The workflow avoids timestamp churn, so it should only propose changes when the source
              repos themselves have meaningful updates.
            </p>
          </InfoPanel>
        </div>
      </Section>
    </>
  );
}
