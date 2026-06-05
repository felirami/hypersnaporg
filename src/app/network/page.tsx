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
  description: "Access Hypersnap public nodes, Ardea / Arca node status, HTTP API endpoints, and shard data.",
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
        title="Live Hypersnap nodes, not vibes."
        description="A builder/operator view of the public Hypersnap node, Ardea's Arca-run node, and nearby Farcaster hub endpoints. Public node stats refresh every minute; hosted hub providers that require credentials are marked auth gated instead of being misreported as dead."
      />

      <Section
        title="Current public node status"
        description={`Primary status is read from ${sources.publicNode.baseUrl}${sources.publicNode.infoEndpoint}; the endpoint grid also probes Ardea and known Farcaster hub providers.`}
      >
        <Reveal>
          <Suspense fallback={<div className="glass-panel h-36 rounded-2xl" />}>
            <NetworkStatusGrid compact />
          </Suspense>
        </Reveal>
      </Section>

      <Section
        eyebrow="Endpoints"
        title="Four practical ways to talk to the network."
        description="Start with the public HTTP API for reads. Use /v1/info for node health. Use Ardea's operator site when you want the Arca-run node context, and port 3381 when you want raw node JSON."
      >
        <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StaggerItem>
            <InfoPanel icon={Braces} title="HTTP API">
              <p className="mb-4">Public read endpoints live under the Farcaster v2-compatible prefix.</p>
              <CodeBlock label="Base URL" command={`${sources.publicNode.baseUrl}${sources.publicNode.apiPrefix}`} />
            </InfoPanel>
          </StaggerItem>
          <StaggerItem>
            <InfoPanel icon={RadioTower} title="Primary node info">
              <p className="mb-4">Health, shard heights, message counts, peer ID, and release version.</p>
              <CodeBlock label="Info endpoint" command={`curl ${sources.publicNode.baseUrl}${sources.publicNode.infoEndpoint} | jq .`} />
            </InfoPanel>
          </StaggerItem>
          <StaggerItem>
            <InfoPanel icon={RadioTower} title="Ardea / Arca node">
              <p className="mb-4">Ardea is the Arca-run Hypersnap node. The site lives at ardea.arcabot.ai; the node API is exposed on port 3381.</p>
              <CodeBlock label="Ardea status" command="curl http://209.97.147.208:3381/v1/info | jq ." />
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
