import { sources } from "@/lib/sources";
import type { FarcasterNode, NetworkInfo, NetworkStatus, NodeHealthStatus } from "@/lib/types";

const INFO_ENDPOINT = `${sources.publicNode.baseUrl}${sources.publicNode.infoEndpoint}`;
const PUBLIC_NODE_REVALIDATE_SECONDS = 60;
const NODE_PROBE_TIMEOUT_MS = 10_000;

export const KNOWN_FARCASTER_NODES: FarcasterNode[] = [
  {
    name: "Hypersnap Public",
    rpcUrl: sources.publicNode.baseUrl,
    operator: "Hypersnap",
    network: "Hypersnap",
    note: "Canonical public Hypersnap node used by this site.",
  },
  {
    name: "Ardea / Arca",
    rpcUrl: "http://209.97.147.208:3381",
    publicUrl: "https://ardea.arcabot.ai",
    operator: "Arca",
    network: "Hypersnap",
    note: "Ardea's public node API. The ardea.arcabot.ai domain is the operator site; the node listener is on port 3381.",
  },
  {
    name: "Neynar Hub API",
    rpcUrl: "https://hub-api.neynar.com",
    publicUrl: "https://neynar.com",
    operator: "Neynar",
    network: "Farcaster",
    note: "Reachable hosted Farcaster hub API. It may require a paid/API-key plan, so auth-gated is not the same as offline.",
  },
  {
    name: "Pinata Hub",
    rpcUrl: "https://hub.pinata.cloud",
    publicUrl: "https://pinata.cloud",
    operator: "Pinata",
    network: "Farcaster",
    note: "Hosted Farcaster hub endpoint; usually blocks unauthenticated info probes.",
  },
  {
    name: "Standard Crypto Hub",
    rpcUrl: "https://hub.farcaster.standardcrypto.vc",
    operator: "Standard Crypto",
    network: "Farcaster",
  },
];

function isNetworkInfo(value: unknown): value is NetworkInfo {
  return typeof value === "object" && value !== null;
}

function statusForHttpCode(status: number): Pick<NodeHealthStatus, "state" | "ok" | "reachable" | "error"> {
  if ([401, 402, 403].includes(status)) {
    return {
      state: "auth-gated",
      ok: false,
      reachable: true,
      error: `HTTP ${status} — reachable, but not publicly readable without credentials`,
    };
  }

  return {
    state: "unreachable",
    ok: false,
    reachable: false,
    error: `HTTP ${status}`,
  };
}

function errorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.name === "TimeoutError" || error.message.toLowerCase().includes("timeout")) {
      return "Timed out";
    }
    return error.message;
  }

  return "Unknown error";
}

export async function getNetworkStatus(): Promise<NetworkStatus> {
  try {
    const response = await fetch(INFO_ENDPOINT, {
      next: { revalidate: PUBLIC_NODE_REVALIDATE_SECONDS },
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(NODE_PROBE_TIMEOUT_MS),
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
      error: errorMessage(error),
    };
  }
}

async function checkNodeHealth(node: FarcasterNode): Promise<NodeHealthStatus> {
  const infoUrl = node.infoUrl ?? `${node.rpcUrl}/v1/info`;
  const start = Date.now();

  try {
    const response = await fetch(infoUrl, {
      next: { revalidate: PUBLIC_NODE_REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(NODE_PROBE_TIMEOUT_MS),
    });

    const latencyMs = Date.now() - start;

    if (!response.ok) {
      const classified = statusForHttpCode(response.status);
      return {
        node,
        ...classified,
        latencyMs,
        version: null,
        numShards: null,
        peerId: null,
      };
    }

    const data: unknown = await response.json();

    if (!isNetworkInfo(data)) {
      return {
        node,
        ok: false,
        reachable: true,
        state: "degraded",
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
      reachable: true,
      state: "online",
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
      reachable: false,
      state: "unreachable",
      latencyMs: latencyMs > NODE_PROBE_TIMEOUT_MS - 500 ? null : latencyMs,
      version: null,
      numShards: null,
      peerId: null,
      error: errorMessage(error),
    };
  }
}

export async function getNodeHealthStatuses(): Promise<NodeHealthStatus[]> {
  return Promise.all(KNOWN_FARCASTER_NODES.map(checkNodeHealth));
}
