import { SNAP, correctedSnapFdv } from "@/lib/snap";

export const SNAP_MARKET_REVALIDATE = 30;
export const MARKET_DATA_TIMEOUT_MS = 10_000;

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

export type SnapMarketResponse = {
  ok: boolean;
  sourceUrl?: string;
  updatedAt?: string;
  error?: string;
  market?: {
    priceUsd: number | null;
    priceNative: number | null;
    trueFdv?: number | null;
    correctedFdv: number | null;
    dexscreenerFdv: number | null;
    fdvMultiple?: number | null;
    liquidityUsd: number | null;
    liquiditySnap: number | null;
    liquidityEth: number | null;
    volume24h: number | null;
    priceChange24h: number | null;
    priceChange6h: number | null;
    txns24h: { buys: number; sells: number; total: number } | null;
  };
};

function numberOrNull(value: unknown) {
  const number = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(number) ? number : null;
}

export async function getSnapMarketData(): Promise<SnapMarketResponse> {
  try {
    const response = await fetch(SNAP.dexscreenerApiUrl, {
      headers: {
        accept: "application/json",
        "user-agent": "hypersnap.org market data checker",
      },
      next: { revalidate: SNAP_MARKET_REVALIDATE },
      signal: AbortSignal.timeout(MARKET_DATA_TIMEOUT_MS),
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

    return {
      ok: true,
      sourceUrl: pair.url ?? SNAP.dexscreenerUrl,
      updatedAt: new Date().toISOString(),
      market: {
        priceUsd,
        priceNative: numberOrNull(pair.priceNative),
        trueFdv: correctedFdv,
        correctedFdv,
        dexscreenerFdv,
        fdvMultiple,
        liquidityUsd: numberOrNull(pair.liquidity?.usd),
        liquiditySnap: numberOrNull(pair.liquidity?.base),
        liquidityEth: numberOrNull(pair.liquidity?.quote),
        volume24h: numberOrNull(pair.volume?.h24),
        priceChange24h: numberOrNull(pair.priceChange?.h24),
        priceChange6h: numberOrNull(pair.priceChange?.h6),
        txns24h:
          typeof h24Txns?.buys === "number" || typeof h24Txns?.sells === "number"
            ? {
                buys: h24Txns?.buys ?? 0,
                sells: h24Txns?.sells ?? 0,
                total: (h24Txns?.buys ?? 0) + (h24Txns?.sells ?? 0),
              }
            : null,
      },
    };
  } catch (error) {
    return {
      ok: false,
      updatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown market data error",
    };
  }
}
