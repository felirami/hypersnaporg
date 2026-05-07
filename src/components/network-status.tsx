import { Activity, Database, GitCommit, Server } from "lucide-react";
import { compactPeerId, formatBytes, formatExactNumber, formatNumber } from "@/lib/format";
import { getNetworkStatus } from "@/lib/network";
import { StatCard } from "@/components/ui";

export async function NetworkStatusGrid({ compact = false }: { compact?: boolean }) {
  const status = await getNetworkStatus();
  const info = status.info;
  const maxBlockDelay = Math.max(...(info?.shardInfos ?? []).map((shard) => shard.blockDelay ?? 0), 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Activity}
        label="Public node"
        value={status.ok ? "Online" : "Degraded"}
        detail={status.ok ? `Version ${info?.version ?? "unknown"}` : status.error}
      />
      <StatCard
        icon={Database}
        label="Messages indexed"
        value={formatNumber(info?.dbStats?.numMessages)}
        detail={formatBytes(info?.dbStats?.approxSize)}
      />
      <StatCard
        icon={Server}
        label="Shards"
        value={formatExactNumber(info?.numShards)}
        detail={`Max block delay: ${formatExactNumber(maxBlockDelay)}`}
      />
      <StatCard
        icon={GitCommit}
        label={compact ? "Peer" : "FID registrations"}
        value={compact ? compactPeerId(info?.peer_id) : formatExactNumber(info?.dbStats?.numFidRegistrations)}
        detail={compact ? "Public node identity" : "Indexed from Farcaster identity state"}
      />
    </div>
  );
}
