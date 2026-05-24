"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, ArrowUpRight, Database } from "lucide-react";

type SnapMarketResponse = {
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

function Metric({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "cyan" | "amber" | "danger";
}) {
  const toneClass = {
    default: "border-white/10 bg-white/[0.045]",
    cyan: "border-cyan-300/25 bg-cyan-300/[0.075] shadow-cyan-950/30",
    amber: "border-amber-200/25 bg-amber-200/[0.07] shadow-amber-950/20",
    danger: "border-rose-200/20 bg-rose-200/[0.055]",
  }[tone];

  return (
    <div className={`min-w-0 rounded-lg border p-4 shadow-xl ${toneClass}`}>
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 break-words font-mono text-2xl text-white">{value}</p>
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
  const trueFdv = market?.trueFdv ?? market?.correctedFdv;
  const change = market?.priceChange24h;
  const changeClass = change === undefined || change === null ? "text-slate-300" : change >= 0 ? "text-emerald-200" : "text-rose-200";
  const fdvGap = market?.fdvMultiple ? `${formatNumber(market.fdvMultiple, false)}×` : "—";

  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.16),transparent_22rem),rgba(255,255,255,0.04)] p-5 shadow-2xl shadow-slate-950/25">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-cyan-100" aria-hidden="true" />
            <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Live market</p>
          </div>
          <p className="text-xs text-slate-400">{loading ? "Updating…" : formatTime(data?.updatedAt)}</p>
        </div>
        {data?.ok === false ? (
          <p className="mt-4 text-sm leading-6 text-slate-300">Market feed is temporarily unavailable. Static supply data remains valid.</p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="Price" value={loading ? "…" : formatUsd(market?.priceUsd)} tone="cyan" />
            <Metric label="True FDV" value={loading ? "…" : formatUsd(trueFdv, true)} detail="Dex price × 200B" tone="amber" />
            <Metric label="Liquidity" value={loading ? "…" : formatUsd(market?.liquidityUsd, true)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-300/16 bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.13),transparent_28rem),radial-gradient(circle_at_90%_0%,rgba(251,191,36,0.11),transparent_24rem),rgba(255,255,255,0.035)] shadow-2xl shadow-slate-950/30">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-cyan-200" aria-hidden="true" />
              <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Live Dexscreener feed</p>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-white">Market snapshot</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Price, liquidity, volume, and transaction counts come from Dexscreener. True FDV is recalculated here from Dexscreener price × 200B supply.
            </p>
          </div>
          <p className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-xs text-slate-300">
            Updated {loading ? "…" : formatTime(data?.updatedAt)}
          </p>
        </div>
      </div>

      {data?.ok === false ? (
        <div className="m-5 flex gap-3 rounded-lg border border-amber-200/20 bg-amber-200/[0.06] p-4 text-sm leading-6 text-slate-200 sm:m-6">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-100" aria-hidden="true" />
          <p>Market feed unavailable: {data.error ?? "unknown error"}. Try Dexscreener directly or refresh in a minute.</p>
        </div>
      ) : (
        <div className="p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-xl border border-cyan-300/20 bg-slate-950/45 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-cyan-100">USD price</p>
              <p className="mt-3 font-mono text-5xl text-white sm:text-6xl">{loading ? "…" : formatUsd(market?.priceUsd)}</p>
              <p className={`mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm ${changeClass}`}>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                24h {loading ? "…" : formatPercent(change)}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric label="True FDV" value={loading ? "…" : formatUsd(trueFdv, true)} detail="Dexscreener price × 200B supply" tone="amber" />
              <Metric label="Dexscreener FDV" value={loading ? "…" : formatUsd(market?.dexscreenerFdv, true)} detail="Indexer-reported value, shown for comparison." tone="danger" />
              <Metric label="Indexer gap" value={loading ? "…" : fdvGap} detail="How far the true FDV is above Dexscreener's reported FDV." />
              <Metric label="Liquidity" value={loading ? "…" : formatUsd(market?.liquidityUsd, true)} detail={`${formatNumber(market?.liquiditySnap)} SNAP / ${formatNumber(market?.liquidityEth, false)} ETH`} />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Metric label="24h volume" value={loading ? "…" : formatUsd(market?.volume24h, true)} detail="Dexscreener reported volume" />
            <Metric label="24h transactions" value={loading ? "…" : formatNumber(market?.txns24h?.total, false)} detail={loading ? undefined : `${market?.txns24h?.buys ?? 0} buys / ${market?.txns24h?.sells ?? 0} sells`} />
            <Metric label="6h change" value={loading ? "…" : formatPercent(market?.priceChange6h)} detail="Short-window price movement" />
          </div>
        </div>
      )}
    </div>
  );
}
