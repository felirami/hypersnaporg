import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Activity, AlertTriangle, GitBranch, GitPullRequest, Sparkles } from "lucide-react";
import { SnapMarketDashboard } from "@/components/snap-market-dashboard";
import { CodeBlock, InfoPanel, LinkButton, PageHeader, Section, StatCard } from "@/components/ui";
import { SNAP, SNAP_PHASE_ONE_OPENED, SNAP_RETRO_ALLOCATION, SNAP_TOTAL_SUPPLY } from "@/lib/snap";

export const metadata: Metadata = {
  title: "$SNAP",
  description:
    "$SNAP token information for Hypersnap: live market data, corrected FDV, retro rewards, claim links, contract details, and public discussions.",
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
  { label: "Total supply", value: "200B", detail: "Known full supply used for corrected FDV." },
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
    body: "Dexscreener is used for live price, liquidity, volume, and transaction data. Hypersnap.org calculates FDV from the correct 200B supply.",
  },
];

export default function SnapPage() {
  return (
    <>
      <PageHeader
        eyebrow="$SNAP"
        title="The Hypersnap token, without the indexer fog."
        description="Live price data, corrected FDV, claim status, supply math, and the public discussions behind the rollout. No hype math. No fake precision."
      />

      <Section eyebrow="Market" title="Live market data, corrected for the real supply.">
        <SnapMarketDashboard />
      </Section>

      <Section
        eyebrow="Supply"
        title="The core numbers are simple."
        description="Dexscreener can be useful for market data, but the supply and FDV shown by third-party indexers may be wrong. Hypersnap.org uses the known 200B supply for FDV."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {supplyRows.map((row) => (
            <StatCard detail={row.detail} key={row.label} label={row.label} value={row.value} />
          ))}
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Total supply view</p>
            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
              <div
                aria-hidden="true"
                className="h-44 w-44 shrink-0 rounded-full border border-white/10 shadow-2xl shadow-slate-950/25"
                style={{
                  background:
                    "conic-gradient(rgb(251 191 36) 0 var(--retro), rgba(255,255,255,0.08) var(--retro) 360deg)",
                  ...allocationStyle,
                }}
              />
              <div className="text-sm leading-6 text-slate-300">
                <p className="text-lg font-semibold text-white">Retro allocation: 0.1% of supply</p>
                <p className="mt-2">
                  200M $SNAP is allocated to retro rewards out of 200B total supply. The visible slice is intentionally tiny because the allocation is tiny relative to total supply.
                </p>
                <div className="mt-4 space-y-2">
                  <Legend color="bg-amber-300" label="Retro rewards allocation" value="200M" />
                  <Legend color="bg-white/20" label="Rest of supply" value="199.8B" />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Retro rewards view</p>
            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
              <div
                aria-hidden="true"
                className="h-44 w-44 shrink-0 rounded-full border border-white/10 shadow-2xl shadow-slate-950/25"
                style={{
                  background:
                    "conic-gradient(rgb(103 232 249) 0 var(--phase-one), rgba(255,255,255,0.08) var(--phase-one) 360deg)",
                  ...phaseStyle,
                }}
              />
              <div className="text-sm leading-6 text-slate-300">
                <p className="text-lg font-semibold text-white">Phase 1 opened 16.5% of retro rewards</p>
                <p className="mt-2">
                  33M $SNAP opened in Phase 1. The remaining 167M retro allocation is not the same thing as circulating supply or total supply.
                </p>
                <div className="mt-4 space-y-2">
                  <Legend color="bg-cyan-300" label="Phase 1 opened" value="33M" />
                  <Legend color="bg-white/20" label="Remaining retro allocation" value="167M" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="How it works"
        title="$SNAP connects contribution, claims, and market data."
        description="There are three separate layers people often mix together. Keep them separate and the token story becomes much easier to understand."
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
              Market price, liquidity, volume, and transactions come from the live Ethereum pool. FDV here is calculated from price × 200B supply.
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
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
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
            {timeline.map((item) => (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5" key={item.label}>
                <p className="text-xs uppercase tracking-[0.12em] text-cyan-100">{item.label}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
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
