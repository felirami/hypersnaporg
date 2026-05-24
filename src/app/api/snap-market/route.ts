import { getSnapMarketData } from "@/lib/snap-market";

export const revalidate = 30;

export async function GET() {
  const data = await getSnapMarketData();

  return Response.json(data, {
    status: data.ok ? 200 : 502,
    headers: {
      "cache-control": data.ok
        ? "public, s-maxage=30, stale-while-revalidate=120"
        : "public, s-maxage=15, stale-while-revalidate=60",
    },
  });
}
