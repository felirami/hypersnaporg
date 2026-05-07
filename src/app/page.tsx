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

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-42"
          style={{
            backgroundImage:
              "url('https://opengraph.githubassets.com/hypersnap-portal/farcasterorg/hypersnap')",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.86)_46%,rgba(2,6,23,0.5)_100%),linear-gradient(180deg,rgba(2,6,23,0.08)_0%,#020617_100%)]" />
        <div className="relative mx-auto flex min-h-[82svh] w-full max-w-7xl flex-col justify-end px-5 pb-14 pt-24 sm:px-6 lg:px-8">
          <Badge>Snapchain, made hyperdimensional</Badge>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-normal text-white sm:text-7xl lg:text-8xl">
            Hypersnap
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
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
