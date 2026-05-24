import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Activity, AlertTriangle, CheckCircle2, GitBranch, GitPullRequest, Sparkles } from "lucide-react";
import { SnapMarketDashboard } from "@/components/snap-market-dashboard";
import { CodeBlock, InfoPanel, LinkButton, Section, StatCard } from "@/components/ui";
import { SNAP, SNAP_PHASE_ONE_OPENED, SNAP_RETRO_ALLOCATION, SNAP_TOTAL_SUPPLY } from "@/lib/snap";

export const metadata: Metadata = {
  title: "$SNAP",
  description:
    "$SNAP token information for Hypersnap: live market data, true FDV, retro rewards, claim links, contract details, and public discussions.",
  alternates: {
    canonical: "/snap",
  },
};

const retroPercent = (SNAP_RETRO_ALLOCATION / SNAP_TOTAL_SUPPLY) * 100;
const phaseOnePercentOfRetro = (SNAP_PHASE_ONE_OPENED / SNAP_RETRO_ALLOCATION) * 100;
const phaseOnePercentOfSupply = (SNAP_PHASE_ONE_OPENED / SNAP_TOTAL_SUPPLY) * 100;

const allocationStyle = {
  "--retro": `${retroPercent * 360}deg`,
} as CSSProperties;

const phaseStyle = {
  "--phase-one": `${phaseOnePercentOfRetro * 360}deg`,
} as CSSProperties;

const supplyRows = [
  { label: "Total supply", value: "200B", detail: "Known full supply used for true FDV." },
  { label: "Retro rewards allocation", value: "200M", detail: `${retroPercent.toFixed(1)}% of total supply.` },
  { label: "Phase 1 opened", value: "33M", detail: `${phaseOnePercentOfRetro.toFixed(1)}% of retro allocation; ${phaseOnePercentOfSupply.toFixed(3)}% of total supply.` },
];

const timeline = [
  {
    label: "Discussion",
    title: "Token mechanics live in public FIPs",
    body: "The design conversation is public in Farcasterorg discussions and linked PRs, including FIP-19 and related rollout work.",
  },
  {
    label: "Claim",
    title: "Retro rewards open in phases",
    body: "The retro allocation is 200M $SNAP. Phase 1 opened 33M through Hypria for eligible contributors/participants.",
  },
  {
    label: "Market",
    title: "The token trades on Ethereum",
    body: "Dexscreener is used for live price, liquidity, volume, and transaction data. Hypersnap.org calculates true FDV from Dexscreener price × 200B supply.",
  },
];

const quickFacts = [
  ["Chain", "Ethereum"],
  ["Claim", "Hypria"],
  ["Pair", "Uniswap v4"],
];

export default function SnapPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(103,232,249,0.2),transparent_32rem),radial-gradient(circle_at_80%_15%,rgba(251,191,36,0.13),transparent_28rem),linear-gradient(180deg,#020617_0%,#050817_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(125,211,252,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.12)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-cyan-100">
              $SNAP
            </p>
            <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold tracking-normal text-white sm:text-7xl">
              Market data, supply math, and the public source trail.
            </h1>
            <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-slate-300">
              Dexscreener is useful for price, liquidity, and volume. Its FDV is not the source of truth here. Hypersnap.org calculates true FDV from the live Dexscreener price multiplied by the known 200B $SNAP supply.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href={SNAP.claimUrl} external>
                Claim on Hypria
              </LinkButton>
              <LinkButton href={SNAP.dexscreenerUrl} variant="secondary" external>
                View Dexscreener
              </LinkButton>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 shadow-2xl shadow-slate-950/35 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Token card</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {quickFacts.map(([label, value]) => (
                <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4" key={label}>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
                  <p className="mt-2 font-mono text-xl text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-cyan-100">Contract</p>
              <p className="mt-2 break-all font-mono text-sm leading-6 text-white">{SNAP.contract}</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">
              Verify the contract before claiming or trading. This page is informational, not financial advice.
            </p>
          </div>
        </div>
      </section>

      <Section eyebrow="Market" title="Live market data with true FDV.">
        <SnapMarketDashboard />
      </Section>

      <Section
        eyebrow="Supply"
        title="The core numbers are simple."
        description="Supply, retro rewards, and claim phases are different concepts. Mixing them together is how indexer fog turns into misinformation."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {supplyRows.map((row) => (
            <StatCard detail={row.detail} key={row.label} label={row.label} value={row.value} />
          ))}
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <SupplyChartCard
            accent="amber"
            style={allocationStyle}
            title="Retro allocation: 0.1% of supply"
            eyebrow="Total supply view"
            body="200M $SNAP is allocated to retro rewards out of 200B total supply. The visible slice is intentionally tiny because the allocation is tiny relative to total supply."
            legend={[
              ["Retro rewards allocation", "200M", "bg-amber-300"],
              ["Rest of supply", "199.8B", "bg-white/20"],
            ]}
          />
          <SupplyChartCard
            accent="cyan"
            style={phaseStyle}
            title="Phase 1 opened 16.5% of retro rewards"
            eyebrow="Retro rewards view"
            body="33M $SNAP opened in Phase 1. The remaining 167M retro allocation is not the same thing as circulating supply or total supply."
            legend={[
              ["Phase 1 opened", "33M", "bg-cyan-300"],
              ["Remaining retro allocation", "167M", "bg-white/20"],
            ]}
          />
        </div>
      </Section>

      <Section
        eyebrow="How it works"
        title="$SNAP connects contribution, claims, and market data."
        description="Three layers. Keep them separate and the token story becomes much easier to understand."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <InfoPanel icon={GitBranch} title="1. Protocol discussion">
            <p>
              Token design and incentive mechanics are discussed in public Farcasterorg FIPs and implementation PRs. That is where the long-form reasoning lives.
            </p>
          </InfoPanel>
          <InfoPanel icon={Sparkles} title="2. Retro rewards">
            <p>
              Retro rewards are a limited allocation for past/proven contribution. Phase 1 opened 33M of the 200M retro bucket through Hypria.
            </p>
          </InfoPanel>
          <InfoPanel icon={Activity} title="3. Market trading">
            <p>
              Market price, liquidity, volume, and transactions come from the live Ethereum pool. True FDV here is calculated from Dexscreener price × 200B supply.
            </p>
          </InfoPanel>
        </div>
        <div className="mt-6 rounded-lg border border-amber-200/20 bg-amber-200/[0.055] p-5 text-sm leading-6 text-slate-200">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-100" aria-hidden="true" />
            <p>
              This page is informational. It is not financial advice, not a promise of rewards, and not a recommendation to buy or sell $SNAP. Verify contract addresses and eligibility before doing anything with money. Crypto goblins love sleepy clicks.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Claim and verify" title="Use the contract address, not vibes.">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Contract</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">$SNAP on Ethereum</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Always verify the contract before claiming, trading, or sharing a link. The official claim flow currently lives at Hypria.
            </p>
            <div className="mt-5">
              <CodeBlock label="$SNAP contract" command={SNAP.contract} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <LinkButton href={SNAP.claimUrl} external>
                Claim on Hypria
              </LinkButton>
              <LinkButton href={SNAP.dexscreenerUrl} variant="secondary" external>
                View Dexscreener
              </LinkButton>
            </div>
          </div>
          <div className="grid gap-4">
            {timeline.map((item, index) => (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5" key={item.label}>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 font-mono text-sm text-cyan-100">
                    {index + 1}
                  </span>
                  <p className="text-xs uppercase tracking-[0.12em] text-cyan-100">{item.label}</p>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Source trail"
        title="Where the discussion lives."
        description="The useful token conversation is not hidden in a private Telegram. Start with these public links."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {SNAP.discussions.map((discussion) => (
            <InfoPanel icon={GitPullRequest} key={discussion.href} title={discussion.label}>
              <p className="mb-4">{discussion.description}</p>
              <LinkButton href={discussion.href} variant="secondary" external>
                Open source thread
              </LinkButton>
            </InfoPanel>
          ))}
        </div>
      </Section>
    </>
  );
}

function SupplyChartCard({
  accent,
  style,
  eyebrow,
  title,
  body,
  legend,
}: {
  accent: "amber" | "cyan";
  style: CSSProperties;
  eyebrow: string;
  title: string;
  body: string;
  legend: [string, string, string][];
}) {
  const gradient =
    accent === "amber"
      ? "conic-gradient(rgb(251 191 36) 0 var(--retro), rgba(255,255,255,0.08) var(--retro) 360deg)"
      : "conic-gradient(rgb(103 232 249) 0 var(--phase-one), rgba(255,255,255,0.08) var(--phase-one) 360deg)";

  return (
    <div className="rounded-xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.08),transparent_22rem),rgba(255,255,255,0.04)] p-6">
      <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">{eyebrow}</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-[12rem_1fr] sm:items-center">
        <div className="relative mx-auto h-48 w-48 sm:mx-0">
          <div aria-hidden="true" className="absolute inset-0 rounded-full border border-white/10 shadow-2xl shadow-slate-950/25" style={{ background: gradient, ...style }} />
          <div className="absolute inset-10 rounded-full border border-white/10 bg-slate-950/88" />
          <CheckCircle2 className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-white/80" aria-hidden="true" />
        </div>
        <div className="text-sm leading-6 text-slate-300">
          <p className="text-lg font-semibold text-white">{title}</p>
          <p className="mt-2">{body}</p>
          <div className="mt-4 space-y-2">
            {legend.map(([label, value, color]) => (
              <Legend color={color} key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
      <span className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} aria-hidden="true" />
        <span>{label}</span>
      </span>
      <span className="font-mono text-slate-100">{value}</span>
    </div>
  );
}
