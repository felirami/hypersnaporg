import { sources } from "@/lib/sources";
import type { NetworkInfo, NetworkStatus } from "@/lib/types";

const INFO_ENDPOINT = `${sources.publicNode.baseUrl}${sources.publicNode.infoEndpoint}`;

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
