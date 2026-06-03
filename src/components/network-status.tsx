import { Activity, Database, GitCommit, Server, Wifi, WifiOff } from "lucide-react";
import { compactPeerId, formatBytes, formatExactNumber, formatNumber } from "@/lib/format";
import { getNetworkStatus, getNodeHealthStatuses } from "@/lib/network";
import { StatCard } from "@/components/ui";
import type { NodeHealthStatus } from "@/lib/types";

function NodeHealthCard({ status }: { status: NodeHealthStatus }) {
  const isOnline = status.ok;

  return (
    <div className="glass-panel group relative min-w-0 overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-60" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{status.node.name}</p>
          {status.node.operator ? (
            <p className="mt-0.5 text-xs text-slate-500">{status.node.operator}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isOnline ? (
            <>
              <span className="pulse-live h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" aria-hidden="true" />
              <Wifi className="h-4 w-4 text-emerald-300/80" aria-hidden="true" />
            </>
          ) : (
            <WifiOff className="h-4 w-4 text-rose-400/80" aria-hidden="true" />
          )}
        </div>
      </div>
      <div className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between gap-2">
          <span className="text-slate-500">Status</span>
          <span className={isOnline ? "font-medium text-emerald-300" : "font-medium text-rose-300"}>
            {isOnline ? "Online" : "Unreachable"}
          </span>
        </div>
        {status.latencyMs !== null ? (
          <div className="flex justify-between gap-2">
            <span className="text-slate-500">Latency</span>
            <span className="font-mono text-slate-300">{status.latencyMs}ms</span>
          </div>
        ) : null}
        {status.version ? (
          <div className="flex justify-between gap-2">
            <span className="text-slate-500">Version</span>
            <span className="font-mono text-slate-300">{status.version}</span>
          </div>
        ) : null}
        {status.numShards !== null ? (
          <div className="flex justify-between gap-2">
            <span className="text-slate-500">Shards</span>
            <span className="font-mono text-slate-300">{status.numShards}</span>
          </div>
        ) : null}
        {status.peerId ? (
          <div className="flex justify-between gap-2">
            <span className="text-slate-500">Peer</span>
            <span className="truncate font-mono text-slate-300" title={status.peerId}>
              {compactPeerId(status.peerId)}
            </span>
          </div>
        ) : null}
        {status.error ? (
          <div className="flex justify-between gap-2">
            <span className="text-slate-500">Error</span>
            <span className="truncate text-rose-300" title={status.error}>
              {status.error}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export async function NetworkStatusGrid({ compact = false }: { compact?: boolean }) {
  const [status, nodeStatuses] = await Promise.all([
    getNetworkStatus(),
    getNodeHealthStatuses(),
  ]);

  const info = status.info;
  const shardInfos = info?.shardInfos ?? [];
  const shardCount = shardInfos.length > 0 ? shardInfos.length : info?.numShards;
  const includesShardZero = shardInfos.some((shard) => shard.shardId === 0);
  const maxBlockDelay = Math.max(...shardInfos.map((shard) => shard.blockDelay ?? 0), 0);

  const onlineCount = nodeStatuses.filter((n) => n.ok).length;

  return (
    <div className="space-y-8">
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
          label="Reported shards"
          value={formatExactNumber(shardCount)}
          detail={`${includesShardZero ? "Includes shard 0. " : ""}Max block delay: ${formatExactNumber(maxBlockDelay)}`}
        />
        <StatCard
          icon={GitCommit}
          label={compact ? "Peer" : "FID registrations"}
          value={compact ? compactPeerId(info?.peer_id) : formatExactNumber(info?.dbStats?.numFidRegistrations)}
          detail={compact ? "Public node identity" : "Indexed from Farcaster identity state"}
        />
      </div>

      <div>
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-slate-400">
            Known Farcaster Nodes
          </h3>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs tabular-nums text-slate-400">
            {onlineCount}/{nodeStatuses.length} online
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {nodeStatuses.map((nodeStatus) => (
            <NodeHealthCard key={nodeStatus.node.rpcUrl} status={nodeStatus} />
          ))}
        </div>
      </div>
    </div>
  );
}
