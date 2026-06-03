import { sources } from "@/lib/sources";
import type { FarcasterNode, NetworkInfo, NetworkStatus, NodeHealthStatus } from "@/lib/types";

const INFO_ENDPOINT = `${sources.publicNode.baseUrl}${sources.publicNode.infoEndpoint}`;

export const KNOWN_FARCASTER_NODES: FarcasterNode[] = [
  {
    name: "Hypersnap Public",
    rpcUrl: sources.publicNode.baseUrl,
    operator: "Hypersnap",
  },
  {
    name: "Neynar Hub 1",
    rpcUrl: "https://hub.neynar.com",
    operator: "Neynar",
  },
  {
    name: "Neynar Hub 2",
    rpcUrl: "https://hub-grpc.neynar.com",
    operator: "Neynar",
  },
  {
    name: "Standard Crypto Hub",
    rpcUrl: "https://hub.farcaster.standardcrypto.vc",
    operator: "Standard Crypto",
  },
  {
    name: "Pinata Hub",
    rpcUrl: "https://hub.pinata.cloud",
    operator: "Pinata",
  },
];

function isNetworkInfo(value: unknown): value is NetworkInfo {
  return typeof value === "object" && value !== null;
}

export async function getNetworkStatus(): Promise<NetworkStatus> {
  try {
    const response = await fetch(INFO_ENDPOINT, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        checkedAt: new Date().toISOString(),
        endpoint: INFO_ENDPOINT,
        info: null,
        error: `Node returned HTTP ${response.status}`,
      };
    }

    const info = await response.json();

    return {
      ok: isNetworkInfo(info),
      checkedAt: new Date().toISOString(),
      endpoint: INFO_ENDPOINT,
      info: isNetworkInfo(info) ? info : null,
      error: isNetworkInfo(info) ? undefined : "Unexpected node response shape",
    };
  } catch (error) {
    return {
      ok: false,
      checkedAt: new Date().toISOString(),
      endpoint: INFO_ENDPOINT,
      info: null,
      error: error instanceof Error ? error.message : "Unknown network status error",
    };
  }
}

async function checkNodeHealth(node: FarcasterNode): Promise<NodeHealthStatus> {
  const infoUrl = `${node.rpcUrl}/v1/info`;
  const start = Date.now();

  try {
    const response = await fetch(infoUrl, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });

    const latencyMs = Date.now() - start;

    if (!response.ok) {
      return {
        node,
        ok: false,
        latencyMs,
        version: null,
        numShards: null,
        peerId: null,
        error: `HTTP ${response.status}`,
      };
    }

    const data: unknown = await response.json();

    if (!isNetworkInfo(data)) {
      return {
        node,
        ok: false,
        latencyMs,
        version: null,
        numShards: null,
        peerId: null,
        error: "Unexpected response shape",
      };
    }

    const info = data as NetworkInfo;
    return {
      node,
      ok: true,
      latencyMs,
      version: info.version ?? null,
      numShards: info.numShards ?? info.shardInfos?.length ?? null,
      peerId: info.peer_id ?? null,
    };
  } catch (error) {
    const latencyMs = Date.now() - start;
    return {
      node,
      ok: false,
      latencyMs: latencyMs > 9_500 ? null : latencyMs,
      version: null,
      numShards: null,
      peerId: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getNodeHealthStatuses(): Promise<NodeHealthStatus[]> {
  return Promise.all(KNOWN_FARCASTER_NODES.map(checkNodeHealth));
}
