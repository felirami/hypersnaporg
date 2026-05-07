import type { Metadata } from "next";
import { Suspense } from "react";
import { Activity, Braces, Clock, Database, RadioTower } from "lucide-react";
import { NetworkStatusGrid } from "@/components/network-status";
import { CodeBlock, InfoPanel, PageHeader, Section, StatCard } from "@/components/ui";
import { formatBytes, formatExactNumber } from "@/lib/format";
import { getNetworkStatus } from "@/lib/network";
import { sources } from "@/lib/sources";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Network",
  description: "Access the Hypersnap public node, live status, HTTP API, gRPC port, and shard data.",
  alternates: {
    canonical: "/network",
  },
};

export default async function NetworkPage() {
  const status = await getNetworkStatus();
  const shards = status.info?.shardInfos ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Network access"
        title="A live look at the network."
        description="If you're a builder or operator, this page is your control room — endpoints, node status, shard data. If you're not technical, that's fine: the numbers below come from a real public node, refreshed every minute. Proof the network is actually running."
      />

      <Section
        title="Current public node status"
        description={`Status is read from ${sources.publicNode.baseUrl}${sources.publicNode.infoEndpoint} and cached for 60 seconds.`}
      >
        <Suspense fallback={<div className="h-32 rounded-lg border border-white/10 bg-white/[0.04]" />}>
          <NetworkStatusGrid compact />
        </Suspense>
      </Section>

      <Section
        eyebrow="Endpoints"
        title="Three ways to talk to the network."
        description="Start with the public HTTP API for reads. Drop down to the node info endpoint for live status. Run your own node when you want full control."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <InfoPanel icon={Braces} title="HTTP API">
            <p className="mb-4">Public read endpoints live under the Farcaster v2-compatible prefix.</p>
            <CodeBlock label="Base URL" command={`${sources.publicNode.baseUrl}${sources.publicNode.apiPrefix}`} />
          </InfoPanel>
          <InfoPanel icon={RadioTower} title="Node info">
            <p className="mb-4">Health, shard heights, message counts, peer ID, and release version.</p>
            <CodeBlock label="Info endpoint" command={`curl ${sources.publicNode.baseUrl}${sources.publicNode.infoEndpoint} | jq .`} />
          </InfoPanel>
          <InfoPanel icon={Activity} title="Local node">
            <p className="mb-4">Self-hosted nodes expose the same HTTP listener on port 3381 by default.</p>
            <CodeBlock label="Local status" command="curl http://localhost:3381/v1/info | jq ." />
          </InfoPanel>
        </div>
      </Section>

      <Section eyebrow="Shard view" title="The live node reports the current sync surface.">
        <div className="grid gap-4 md:grid-cols-3">
          {shards.map((shard) => (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5" key={shard.shardId}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-mono text-xl text-white">Shard {shard.shardId}</h3>
                <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-100">
                  delay {formatExactNumber(shard.blockDelay)}
                </span>
              </div>
              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-slate-400">Max height</dt>
                  <dd className="font-mono text-white">{formatExactNumber(shard.maxHeight)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-slate-400">Messages</dt>
                  <dd className="font-mono text-white">{formatExactNumber(shard.numMessages)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Approx size</dt>
                  <dd className="font-mono text-white">{formatBytes(shard.approxSize)}</dd>
                </div>
              </dl>
            </div>
          ))}
          {shards.length === 0 ? (
            <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-6 text-sm leading-6 text-amber-50">
              The public node did not return shard data during this request. The API route will keep
              returning a clear degraded state until the node responds again.
            </div>
          ) : null}
        </div>
      </Section>

      <Section eyebrow="Data profile" title="What the public node is indexing right now.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Database} label="Database size" value={formatBytes(status.info?.dbStats?.approxSize)} />
          <StatCard icon={Database} label="Messages" value={formatExactNumber(status.info?.dbStats?.numMessages)} />
          <StatCard icon={RadioTower} label="FIDs" value={formatExactNumber(status.info?.dbStats?.numFidRegistrations)} />
          <StatCard icon={Clock} label="Checked" value={status.ok ? "Fresh" : "Degraded"} detail={status.error} />
        </div>
      </Section>
    </>
  );
}
