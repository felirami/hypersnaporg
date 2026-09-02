import { getNetworkStatus, getNodeHealthStatuses } from "./lib/network";
import { getSnapMarketData } from "./lib/snap-market";

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

function json(data: unknown, status: number, cacheControl: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": cacheControl,
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/network-status") {
      const [status, nodes] = await Promise.all([
        getNetworkStatus(),
        getNodeHealthStatuses(),
      ]);
      return json(
        { ...status, nodes },
        status.ok ? 200 : 503,
        "public, s-maxage=60, stale-while-revalidate=300",
      );
    }

    if (url.pathname === "/api/snap-market") {
      const data = await getSnapMarketData();
      return json(
        data,
        data.ok ? 200 : 502,
        data.ok
          ? "public, s-maxage=30, stale-while-revalidate=120"
          : "public, s-maxage=15, stale-while-revalidate=60",
      );
    }

    return env.ASSETS.fetch(request);
  },
};
