import { Activity, Database, ExternalLink, GitCommit, LockKeyhole, Server, Wifi, WifiOff } from "lucide-react";
import { compactPeerId, formatBytes, formatExactNumber, formatNumber } from "@/lib/format";
import { getNetworkStatus, getNodeHealthStatuses } from "@/lib/network";
import { StatCard } from "@/components/ui";
import type { NodeHealthStatus } from "@/lib/types";

const statusStyles = {
  online: {
    label: "Online",
    text: "text-emerald-300",
    icon: "text-emerald-300/80",
    dot: true,
  },
  "auth-gated": {
    label: "Auth gated",
    text: "text-amber-200",
    icon: "text-amber-200/80",
    dot: false,
  },
  degraded: {
    label: "Degraded",
    text: "text-amber-200",
    icon: "text-amber-200/80",
    dot: false,
  },
  unreachable: {
    label: "Unreachable",
    text: "text-rose-300",
    icon: "text-rose-400/80",
    dot: false,
  },
} as const;

function NodeHealthCard({ status }: { status: NodeHealthStatus }) {
  const style = statusStyles[status.state];
  const displayUrl = status.node.publicUrl ?? status.node.rpcUrl;

  return (
    <div className="glass-panel group relative min-w-0 overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-60" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{status.node.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {[status.node.operator, status.node.network].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {style.dot ? (
            <span className="pulse-live h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" aria-hidden="true" />
          ) : null}
          {status.state === "online" ? (
            <Wifi className={`h-4 w-4 ${style.icon}`} aria-hidden="true" />
          ) : status.state === "auth-gated" ? (
            <LockKeyhole className={`h-4 w-4 ${style.icon}`} aria-hidden="true" />
          ) : (
            <WifiOff className={`h-4 w-4 ${style.icon}`} aria-hidden="true" />
          )}
        </div>
      </div>
      <div className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between gap-2">
          <span className="text-slate-500">Status</span>
          <span className={`font-medium ${style.text}`}>{style.label}</span>
        </div>
        {status.latencyMs !== null ? (
          <div className="flex justify-between gap-2">
            <span className="text-slate-500">Latency</span>
            <span className="font-mono text-slate-300">{status.latencyMs}ms</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <span className="text-slate-500">Endpoint</span>
          <a
            className="inline-flex min-w-0 items-center gap-1 truncate font-mono text-cyan-200/80 hover:text-cyan-100"
            href={displayUrl}
            rel="noreferrer"
            target="_blank"
            title={displayUrl}
          >
            <span className="truncate">{new URL(displayUrl).host}</span>
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
          </a>
        </div>
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
        {status.node.note ? <p className="pt-1 leading-5 text-slate-500">{status.node.note}</p> : null}
        {status.error ? (
          <div className="flex justify-between gap-2">
            <span className="text-slate-500">Probe</span>
            <span className={`truncate ${style.text}`} title={status.error}>
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

  const onlineCount = nodeStatuses.filter((n) => n.state === "online").length;
  const reachableCount = nodeStatuses.filter((n) => n.reachable).length;

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
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-slate-400">
            Known Hypersnap + Farcaster endpoints
          </h3>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs tabular-nums text-slate-400">
            {onlineCount}/{nodeStatuses.length} public info online
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs tabular-nums text-slate-400">
            {reachableCount}/{nodeStatuses.length} reachable
          </span>
        </div>
        <p className="mb-5 max-w-3xl text-sm leading-6 text-slate-500">
          Public Hypersnap nodes expose <code className="font-mono text-slate-300">/v1/info</code>. Some Farcaster hosted hub providers are alive but intentionally return 401/402/403 without credentials; those are marked auth gated instead of falsely offline.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {nodeStatuses.map((nodeStatus) => (
            <NodeHealthCard key={nodeStatus.node.name} status={nodeStatus} />
          ))}
        </div>
      </div>
    </div>
  );
}
