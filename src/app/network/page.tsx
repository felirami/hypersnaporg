import type { Metadata } from "next";
import { Suspense } from "react";
import { Activity, Braces, Clock, Database, RadioTower } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { NetworkStatusGrid } from "@/components/network-status";
import {
  CodeBlock,
  InfoPanel,
  PageHeader,
  Section,
  ShardCard,
  StatCard,
  WarningPanel,
} from "@/components/ui";
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
        description="If you're a builder or operator, this page is your control room — endpoints, node status, shard data. If you're not technical, that's fine: the numbers below come from a real public node, refreshed every minute."
      />

      <Section
        title="Current public node status"
        description={`Status is read from ${sources.publicNode.baseUrl}${sources.publicNode.infoEndpoint} and cached for 60 seconds.`}
      >
        <Reveal>
          <Suspense fallback={<div className="glass-panel h-36 rounded-2xl" />}>
            <NetworkStatusGrid compact />
          </Suspense>
        </Reveal>
      </Section>

      <Section
        eyebrow="Endpoints"
        title="Three ways to talk to the network."
        description="Start with the public HTTP API for reads. Drop down to the node info endpoint for live status. Run your own node when you want full control."
      >
        <Stagger className="grid gap-5 lg:grid-cols-3">
          <StaggerItem>
            <InfoPanel icon={Braces} title="HTTP API">
              <p className="mb-4">Public read endpoints live under the Farcaster v2-compatible prefix.</p>
              <CodeBlock label="Base URL" command={`${sources.publicNode.baseUrl}${sources.publicNode.apiPrefix}`} />
            </InfoPanel>
          </StaggerItem>
          <StaggerItem>
            <InfoPanel icon={RadioTower} title="Node info">
              <p className="mb-4">Health, shard heights, message counts, peer ID, and release version.</p>
              <CodeBlock label="Info endpoint" command={`curl ${sources.publicNode.baseUrl}${sources.publicNode.infoEndpoint} | jq .`} />
            </InfoPanel>
          </StaggerItem>
          <StaggerItem>
            <InfoPanel icon={Activity} title="Local node">
              <p className="mb-4">Self-hosted nodes expose the same HTTP listener on port 3381 by default.</p>
              <CodeBlock label="Local status" command="curl http://localhost:3381/v1/info | jq ." />
            </InfoPanel>
          </StaggerItem>
        </Stagger>
      </Section>

      <Section eyebrow="Shard view" title="The live node reports the current sync surface.">
        <Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {shards.map((shard) => (
              <ShardCard
                approxSize={formatBytes(shard.approxSize)}
                blockDelay={formatExactNumber(shard.blockDelay ?? 0)}
                key={shard.shardId}
                maxHeight={formatExactNumber(shard.maxHeight)}
                numMessages={formatExactNumber(shard.numMessages)}
                shardId={shard.shardId}
              />
            ))}
            {shards.length === 0 ? (
              <WarningPanel>
                The public node did not return shard data during this request. The API route will keep
                returning a clear degraded state until the node responds again.
              </WarningPanel>
            ) : null}
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="Data profile" title="What the public node is indexing right now.">
        <Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Database} label="Database size" value={formatBytes(status.info?.dbStats?.approxSize)} />
            <StatCard icon={Database} label="Messages" value={formatExactNumber(status.info?.dbStats?.numMessages)} />
            <StatCard icon={RadioTower} label="FIDs" value={formatExactNumber(status.info?.dbStats?.numFidRegistrations)} />
            <StatCard icon={Clock} label="Checked" value={status.ok ? "Fresh" : "Degraded"} detail={status.error} />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
