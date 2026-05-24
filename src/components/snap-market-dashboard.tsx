"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Database } from "lucide-react";

type SnapMarketResponse = {
  ok: boolean;
  sourceUrl?: string;
  updatedAt?: string;
  error?: string;
  market?: {
    priceUsd: number | null;
    priceNative: number | null;
    correctedFdv: number | null;
    dexscreenerFdv: number | null;
    liquidityUsd: number | null;
    liquiditySnap: number | null;
    liquidityEth: number | null;
    volume24h: number | null;
    priceChange24h: number | null;
    priceChange6h: number | null;
    txns24h: { buys: number; sells: number; total: number } | null;
  };
};

type Variant = "full" | "compact";

function formatUsd(value: number | null | undefined, compact = false) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: value < 1 ? 6 : value < 1000 ? 2 : 0,
  }).format(value);
}

function formatNumber(value: number | null | undefined, compact = true) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatTime(value: string | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 font-mono text-2xl text-white">{value}</p>
      {detail ? <p className="mt-2 text-xs leading-5 text-slate-400">{detail}</p> : null}
    </div>
  );
}

export function SnapMarketDashboard({ variant = "full" }: { variant?: Variant }) {
  const [data, setData] = useState<SnapMarketResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/snap-market", { cache: "no-store" });
        const json = (await response.json()) as SnapMarketResponse;
        if (!cancelled) setData(json);
      } catch (error) {
        if (!cancelled) {
          setData({
            ok: false,
            error: error instanceof Error ? error.message : "Could not load market data",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const market = data?.market;
  const change = market?.priceChange24h;
  const changeClass = change === undefined || change === null ? "text-slate-300" : change >= 0 ? "text-emerald-200" : "text-rose-200";

  if (variant === "compact") {
    return (
      <div className="rounded-lg border border-amber-200/20 bg-amber-200/[0.055] p-6">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-amber-100" aria-hidden="true" />
          <p className="text-sm uppercase tracking-[0.14em] text-amber-100">Live market</p>
        </div>
        {data?.ok === false ? (
          <p className="mt-4 text-sm leading-6 text-slate-300">Market feed is temporarily unavailable. Static supply data remains valid.</p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="Price" value={loading ? "…" : formatUsd(market?.priceUsd)} />
            <Metric label="Corrected FDV" value={loading ? "…" : formatUsd(market?.correctedFdv, true)} />
            <Metric label="Liquidity" value={loading ? "…" : formatUsd(market?.liquidityUsd, true)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-cyan-200" aria-hidden="true" />
            <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Live Dexscreener feed</p>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white">Market snapshot</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Price, liquidity, volume, and transaction counts come from Dexscreener. FDV is recalculated by hypersnap.org using the known 200B total supply.
          </p>
        </div>
        <p className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
          Updated {loading ? "…" : formatTime(data?.updatedAt)}
        </p>
      </div>

      {data?.ok === false ? (
        <div className="mt-5 flex gap-3 rounded-lg border border-amber-200/20 bg-amber-200/[0.06] p-4 text-sm leading-6 text-slate-200">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-100" aria-hidden="true" />
          <p>Market feed unavailable: {data.error ?? "unknown error"}. Try Dexscreener directly or refresh in a minute.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Price" value={loading ? "…" : formatUsd(market?.priceUsd)} detail="USD per $SNAP" />
            <Metric label="Corrected FDV" value={loading ? "…" : formatUsd(market?.correctedFdv, true)} detail="Price × 200B supply" />
            <Metric label="Liquidity" value={loading ? "…" : formatUsd(market?.liquidityUsd, true)} detail={`${formatNumber(market?.liquiditySnap)} SNAP / ${formatNumber(market?.liquidityEth, false)} ETH`} />
            <Metric label="24h volume" value={loading ? "…" : formatUsd(market?.volume24h, true)} detail="Dexscreener reported volume" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Metric label="24h change" value={loading ? "…" : formatPercent(market?.priceChange24h)} detail={loading ? undefined : `6h: ${formatPercent(market?.priceChange6h)}`} />
            <Metric label="24h transactions" value={loading ? "…" : formatNumber(market?.txns24h?.total, false)} detail={loading ? undefined : `${market?.txns24h?.buys ?? 0} buys / ${market?.txns24h?.sells ?? 0} sells`} />
            <Metric label="Dexscreener FDV" value={loading ? "…" : formatUsd(market?.dexscreenerFdv, true)} detail="Shown for comparison only; this is the value that may be wrong." />
          </div>
          <p className={`mt-4 text-sm ${changeClass}`}>24h price move: {loading ? "…" : formatPercent(change)}</p>
        </>
      )}
    </div>
  );
}
