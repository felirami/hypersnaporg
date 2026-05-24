import { SNAP, SNAP_TOTAL_SUPPLY, correctedSnapFdv } from "@/lib/snap";

export const revalidate = 30;

type DexPeriod = {
  buys?: number;
  sells?: number;
};

type DexPair = {
  url?: string;
  priceNative?: string;
  priceUsd?: string;
  fdv?: number;
  marketCap?: number;
  liquidity?: {
    usd?: number;
    base?: number;
    quote?: number;
  };
  volume?: {
    h24?: number;
    h6?: number;
    h1?: number;
    m5?: number;
  };
  priceChange?: {
    h24?: number;
    h6?: number;
    h1?: number;
    m5?: number;
  };
  txns?: {
    h24?: DexPeriod;
    h6?: DexPeriod;
    h1?: DexPeriod;
    m5?: DexPeriod;
  };
  pairCreatedAt?: number;
};

type DexResponse = {
  pair?: DexPair;
  pairs?: DexPair[];
};

function numberOrNull(value: unknown) {
  const number = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(number) ? number : null;
}

export async function GET() {
  try {
    const response = await fetch(SNAP.dexscreenerApiUrl, {
      headers: {
        accept: "application/json",
        "user-agent": "hypersnap.org market data checker",
      },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`Dexscreener returned ${response.status}`);
    }

    const data = (await response.json()) as DexResponse;
    const pair = data.pair ?? data.pairs?.[0];

    if (!pair) {
      throw new Error("Dexscreener response did not include a pair");
    }

    const priceUsd = numberOrNull(pair.priceUsd);
    const correctedFdv = priceUsd === null ? null : correctedSnapFdv(priceUsd);
    const dexscreenerFdv = numberOrNull(pair.fdv);
    const fdvMultiple =
      correctedFdv !== null && dexscreenerFdv !== null && dexscreenerFdv > 0
        ? correctedFdv / dexscreenerFdv
        : null;
    const h24Txns = pair.txns?.h24;

    return Response.json(
      {
        ok: true,
        source: "dexscreener",
        sourceUrl: pair.url ?? SNAP.dexscreenerUrl,
        updatedAt: new Date().toISOString(),
        token: {
          symbol: SNAP.symbol,
          chain: SNAP.chain,
          contract: SNAP.contract,
          totalSupply: SNAP_TOTAL_SUPPLY,
        },
        market: {
          priceUsd,
          priceNative: numberOrNull(pair.priceNative),
          trueFdv: correctedFdv,
          correctedFdv,
          dexscreenerFdv,
          fdvMultiple,
          dexscreenerMarketCap: numberOrNull(pair.marketCap),
          liquidityUsd: numberOrNull(pair.liquidity?.usd),
          liquiditySnap: numberOrNull(pair.liquidity?.base),
          liquidityEth: numberOrNull(pair.liquidity?.quote),
          volume24h: numberOrNull(pair.volume?.h24),
          volume6h: numberOrNull(pair.volume?.h6),
          volume1h: numberOrNull(pair.volume?.h1),
          priceChange24h: numberOrNull(pair.priceChange?.h24),
          priceChange6h: numberOrNull(pair.priceChange?.h6),
          priceChange1h: numberOrNull(pair.priceChange?.h1),
          txns24h:
            typeof h24Txns?.buys === "number" || typeof h24Txns?.sells === "number"
              ? {
                  buys: h24Txns?.buys ?? 0,
                  sells: h24Txns?.sells ?? 0,
                  total: (h24Txns?.buys ?? 0) + (h24Txns?.sells ?? 0),
                }
              : null,
          pairCreatedAt: numberOrNull(pair.pairCreatedAt),
        },
      },
      {
        headers: {
          "cache-control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      },
    );
  } catch (error) {
    return Response.json(
      {
        ok: false,
        updatedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown market data error",
      },
      {
        status: 502,
        headers: {
          "cache-control": "public, s-maxage=15, stale-while-revalidate=60",
        },
      },
    );
  }
}
