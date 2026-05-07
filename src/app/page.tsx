import type { Metadata } from "next";
import { Suspense } from "react";
import { BookOpen, Boxes, GitBranch, RadioTower, Server, Sparkles, Terminal } from "lucide-react";
import { NetworkStatusGrid } from "@/components/network-status";
import { Badge, CodeBlock, InfoPanel, LinkButton, Section } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getRepo, sources } from "@/lib/sources";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const hypersnapRepo = getRepo("hypersnap");

const principles = [
  {
    title: "Decentralized by default",
    description:
      "Hypersnap keeps the Farcaster data layer accessible to independent operators instead of leaving the network path locked behind one deployment.",
    icon: RadioTower,
  },
  {
    title: "Snapchain compatible",
    description:
      "The fork keeps the familiar Snapchain/Farcaster wire model while opening room for hyper mode, richer API surfaces, and operator-driven validation.",
    icon: GitBranch,
  },
  {
    title: "Built in the open",
    description:
      "The protocol, docs, API references, and website snapshots all point back to Farcasterorg source repositories.",
    icon: Boxes,
  },
];

const heroSignals = [
  { label: "Public node", value: "haatz.quilibrium.com", className: "right-8 top-12" },
  { label: "Fork source", value: "farcasterorg/hypersnap", className: "right-32 top-52" },
  { label: "Source sync", value: "daily review PRs", className: "right-2 top-[22rem]" },
];

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#020617_0%,#061626_45%,#04231f_100%)]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(125,211,252,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.16)_1px,transparent_1px)] [background-size:56px_56px]"
        />
        <HeroSignalField />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.86)_52%,rgba(2,6,23,0.35)_100%),linear-gradient(180deg,rgba(2,6,23,0.02)_0%,#020617_100%)]" />
        <div className="relative mx-auto flex min-h-[72svh] w-full max-w-7xl flex-col justify-center px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <Badge>Snapchain, made hyperdimensional</Badge>
          <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold tracking-normal text-white sm:text-7xl lg:text-8xl">
            Hypersnap
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-slate-200 sm:text-xl">
            A decentralized fork of Snapchain for the Farcaster ecosystem: live public data,
            self-hosted nodes, open APIs, and contribution paths that stay anchored to the
            Farcasterorg source.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/network">Access the network</LinkButton>
            <LinkButton href="/run-a-node" variant="secondary">
              Run a node
            </LinkButton>
            <LinkButton href={hypersnapRepo?.url ?? "https://github.com/farcasterorg/hypersnap"} variant="secondary" external>
              Open source
            </LinkButton>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Live network"
        title="Read from the public node now, or operate your own."
        description={`The default public endpoint is ${sources.publicNode.baseUrl}. The site checks the node info endpoint directly and refreshes cached status every minute.`}
      >
        <Suspense fallback={<div className="h-32 rounded-lg border border-white/10 bg-white/[0.04]" />}>
          <NetworkStatusGrid />
        </Suspense>
      </Section>

      <Section
        eyebrow="What is Hypersnap"
        title="The Farcaster data layer, forked for independent operation."
        description="Hypersnap starts from Snapchain, the blockchain-like peer-to-peer storage layer used by Farcaster clients, and extends it toward a more operator-owned network."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <InfoPanel icon={principle.icon} key={principle.title} title={principle.title}>
              <p>{principle.description}</p>
            </InfoPanel>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Quick starts"
        title="Three doors into the protocol."
        description="Builders can read the public API, operators can bootstrap a node, and contributors can follow the source back into GitHub."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <InfoPanel icon={BookOpen} title="Read API data">
            <CodeBlock
              label="Public read"
              command={`curl -s "${sources.publicNode.baseUrl}${sources.publicNode.apiPrefix}/user?fid=3" | jq .`}
            />
          </InfoPanel>
          <InfoPanel icon={Terminal} title="Bootstrap a node">
            <CodeBlock label="Stable channel" command={sources.node.bootstrapCommand} />
          </InfoPanel>
          <InfoPanel icon={Sparkles} title="Sync source updates">
            <CodeBlock label="Website data" command="npm run sync:sources" />
          </InfoPanel>
        </div>
      </Section>

      <Section
        eyebrow="Source truth"
        title="The portal follows Farcasterorg."
        description="A scheduled workflow keeps this website's curated data layer updated from the open repositories, so the portal can evolve with the protocol."
      >
        <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Latest source update</p>
            <p className="mt-4 text-3xl font-semibold text-white">{formatDate(sources.sourceUpdatedAt)}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Data is normalized from public Farcasterorg repositories into a typed JSON snapshot,
              then used by the docs, network, and contribution pages.
            </p>
          </div>
          <InfoPanel icon={Server} title="No Railway backend in v1">
            <p>
              The launch build uses Vercel for the frontend and lightweight API routes. A Railway
              service can be added later if persistent aggregation or long-running network indexing
              becomes necessary.
            </p>
          </InfoPanel>
        </div>
      </Section>
    </>
  );
}

function HeroSignalField() {
  return (
    <div aria-hidden="true" className="absolute inset-0 hidden overflow-hidden lg:block">
      <div className="absolute right-[-7rem] top-12 h-[34rem] w-[54rem] rotate-[-7deg] border border-cyan-200/18 bg-cyan-200/[0.03]" />
      <div className="absolute right-[-3rem] top-24 h-[25rem] w-[43rem] rotate-[5deg] border border-emerald-200/18 bg-emerald-200/[0.025]" />
      <div className="absolute right-16 top-16 h-px w-[42rem] rotate-[20deg] bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />
      <div className="absolute right-4 top-64 h-px w-[38rem] rotate-[-14deg] bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent" />
      <div className="absolute right-40 top-40 h-[22rem] w-px rotate-[18deg] bg-gradient-to-b from-transparent via-amber-100/35 to-transparent" />

      {heroSignals.map((signal) => (
        <div
          className={`absolute ${signal.className} rounded-md border border-white/12 bg-slate-950/72 px-4 py-3 shadow-2xl shadow-slate-950/30 backdrop-blur-md`}
          key={signal.label}
        >
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-cyan-100">
            {signal.label}
          </p>
          <p className="mt-1 font-mono text-sm text-white">{signal.value}</p>
        </div>
      ))}

      <div className="absolute right-80 top-28 h-2.5 w-2.5 rounded-[2px] bg-cyan-200 shadow-[0_0_24px_rgba(103,232,249,0.85)]" />
      <div className="absolute right-24 top-80 h-2.5 w-2.5 rounded-[2px] bg-emerald-200 shadow-[0_0_24px_rgba(167,243,208,0.75)]" />
      <div className="absolute right-[29rem] top-72 h-2.5 w-2.5 rounded-[2px] bg-amber-100 shadow-[0_0_24px_rgba(254,243,199,0.65)]" />
    </div>
  );
}
