import { getNetworkStatus } from "@/lib/network";

export const revalidate = 60;

export async function GET() {
  const status = await getNetworkStatus();

  return Response.json(status, {
    status: status.ok ? 200 : 503,
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
