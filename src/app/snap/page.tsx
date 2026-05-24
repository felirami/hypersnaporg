import type { Metadata } from "next";
import { Activity, AlertTriangle, GitBranch, GitPullRequest, Sparkles } from "lucide-react";
import { InnerPageHero } from "@/components/hero/inner-page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SnapMarketDashboard } from "@/components/snap-market-dashboard";
import {
  AccentCard,
  CodeBlock,
  InfoPanel,
  LinkButton,
  Section,
  StatCard,
  WarningPanel,
} from "@/components/ui";
import { SNAP, SNAP_PHASE_ONE_OPENED, SNAP_RETRO_ALLOCATION, SNAP_TOTAL_SUPPLY } from "@/lib/snap";
import { getSnapMarketData } from "@/lib/snap-market";

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

export default async function SnapPage() {
  const snapMarket = await getSnapMarketData();

  return (
    <>
      <InnerPageHero
        accent="amber"
        eyebrow="$SNAP"
        title="Market data, supply math, and the public source trail."
        description="Dexscreener is useful for price, liquidity, and volume. Its FDV is not the source of truth here. Hypersnap.org calculates true FDV from the live Dexscreener price multiplied by the known 200B $SNAP supply."
        actions={[
          { href: SNAP.claimUrl, label: "Claim on Hypria", external: true },
          { href: SNAP.dexscreenerUrl, label: "View Dexscreener", external: true, variant: "secondary" },
        ]}
        aside={
          <div className="glass-panel rounded-2xl p-6">
            <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Token card</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {quickFacts.map(([label, value]) => (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4" key={label}>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
                  <p className="mt-2 font-mono text-lg text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Contract</p>
              <p className="mt-2 break-all font-mono text-sm leading-6 text-cyan-100/90">{SNAP.contract}</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Verify the contract before claiming or trading. This page is informational, not financial advice.
            </p>
          </div>
        }
      />

      <Section eyebrow="Market" title="Live market data with true FDV.">
        <Reveal>
          <SnapMarketDashboard initialData={snapMarket} />
        </Reveal>
      </Section>

      <Section
        eyebrow="Supply"
        title="The core numbers are simple."
        description="Supply, retro rewards, and claim phases are different concepts. Mixing them together is how indexer fog turns into misinformation."
      >
        <Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {supplyRows.map((row) => (
              <StatCard detail={row.detail} key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <SupplyChartCard
              accent="amber"
              percent={retroPercent}
              title="Retro allocation: 0.1% of supply"
              eyebrow="Total supply view"
              body="200M $SNAP is allocated to retro rewards out of 200B total supply. The visible slice is intentionally tiny because the allocation is tiny relative to total supply."
              legend={[
                ["Retro rewards allocation", "200M", retroPercent, "amber"],
                ["Rest of supply", "199.8B", 100 - retroPercent, "muted"],
              ]}
            />
            <SupplyChartCard
              accent="cyan"
              percent={phaseOnePercentOfRetro}
              title="Phase 1 opened 16.5% of retro rewards"
              eyebrow="Retro rewards view"
              body="33M $SNAP opened in Phase 1. The remaining 167M retro allocation is not the same thing as circulating supply or total supply."
              legend={[
                ["Phase 1 opened", "33M", phaseOnePercentOfRetro, "cyan"],
                ["Remaining retro allocation", "167M", 100 - phaseOnePercentOfRetro, "muted"],
              ]}
            />
          </div>
        </Reveal>
      </Section>

      <Section
        eyebrow="How it works"
        title="$SNAP connects contribution, claims, and market data."
        description="Three layers. Keep them separate and the token story becomes much easier to understand."
      >
        <Stagger className="grid gap-5 md:grid-cols-3">
          <StaggerItem>
            <InfoPanel icon={GitBranch} title="1. Protocol discussion">
              <p>
                Token design and incentive mechanics are discussed in public Farcasterorg FIPs and implementation PRs.
              </p>
            </InfoPanel>
          </StaggerItem>
          <StaggerItem>
            <InfoPanel icon={Sparkles} title="2. Retro rewards">
              <p>
                Retro rewards are a limited allocation for past/proven contribution. Phase 1 opened 33M of the 200M retro bucket through Hypria.
              </p>
            </InfoPanel>
          </StaggerItem>
          <StaggerItem>
            <InfoPanel icon={Activity} title="3. Market trading">
              <p>
                Market price, liquidity, volume, and transactions come from the live Ethereum pool. True FDV here is calculated from Dexscreener price × 200B supply.
              </p>
            </InfoPanel>
          </StaggerItem>
        </Stagger>
        <Reveal>
          <div className="mt-8">
            <WarningPanel>
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
                <p>
                  This page is informational. It is not financial advice, not a promise of rewards, and not a recommendation to buy or sell $SNAP. Verify contract addresses and eligibility before doing anything with money.
                </p>
              </div>
            </WarningPanel>
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="Claim and verify" title="Use the contract address, not vibes.">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <AccentCard>
              <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Contract</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">$SNAP on Ethereum</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Always verify the contract before claiming, trading, or sharing a link. The official claim flow currently lives at Hypria.
              </p>
              <div className="mt-6">
                <CodeBlock label="$SNAP contract" command={SNAP.contract} />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <LinkButton href={SNAP.claimUrl} external>
                  Claim on Hypria
                </LinkButton>
                <LinkButton href={SNAP.dexscreenerUrl} variant="secondary" external>
                  View Dexscreener
                </LinkButton>
              </div>
            </AccentCard>
            <div className="grid gap-4">
              {timeline.map((item, index) => (
                <div className="glass-panel rounded-2xl p-6" key={item.label}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] font-mono text-sm text-cyan-200">
                      {index + 1}
                    </span>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      <Section
        eyebrow="Source trail"
        title="Where the discussion lives."
        description="The useful token conversation is not hidden in a private Telegram. Start with these public links."
      >
        <Stagger className="grid gap-5 md:grid-cols-3">
          {SNAP.discussions.map((discussion) => (
            <StaggerItem key={discussion.href}>
              <InfoPanel icon={GitPullRequest} title={discussion.label}>
                <p className="mb-4">{discussion.description}</p>
                <LinkButton href={discussion.href} variant="secondary" external>
                  Open source thread
                </LinkButton>
              </InfoPanel>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </>
  );
}

function SupplyChartCard({
  accent,
  percent,
  eyebrow,
  title,
  body,
  legend,
}: {
  accent: "amber" | "cyan";
  percent: number;
  eyebrow: string;
  title: string;
  body: string;
  legend: [string, string, number, "amber" | "cyan" | "muted"][];
}) {
  const accentColor = accent === "amber" ? "#fbbf24" : "#38bdf8";
  const accentGlow = accent === "amber" ? "rgba(251,191,36,0.35)" : "rgba(56,189,248,0.35)";

  return (
    <div className="glass-panel overflow-hidden rounded-2xl p-7 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
        <div className="relative mx-auto shrink-0 lg:mx-0">
          <DonutChart accentColor={accentColor} accentGlow={accentGlow} percent={percent} />
          <p className="mt-4 text-center text-xs text-slate-500 lg:text-left">
            {percent < 1 ? "Relative to total supply" : "Of retro allocation"}
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">{body}</p>

          <div className="mt-6 space-y-3">
            {legend.map(([label, value, share, tone]) => (
              <LegendRow key={label} label={label} share={share} tone={tone} value={value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutChart({
  percent,
  accentColor,
  accentGlow,
}: {
  percent: number;
  accentColor: string;
  accentGlow: string;
}) {
  const radius = 38;
  const stroke = 7;
  const circumference = 2 * Math.PI * radius;
  const displayPercent = Math.min(Math.max(percent, 0), 100);
  const filled = (displayPercent / 100) * circumference;
  const label = displayPercent < 1 ? displayPercent.toFixed(2) : displayPercent.toFixed(1);

  return (
    <div className="relative h-44 w-44">
      <svg aria-hidden="true" className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          fill="none"
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx="50"
          cy="50"
          fill="none"
          r={radius}
          stroke={accentColor}
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeLinecap="round"
          strokeWidth={stroke}
          style={{ filter: `drop-shadow(0 0 10px ${accentGlow})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-semibold tracking-tight text-white">{label}%</span>
        <span className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-slate-500">allocated</span>
      </div>
    </div>
  );
}

function LegendRow({
  label,
  value,
  share,
  tone,
}: {
  label: string;
  value: string;
  share: number;
  tone: "amber" | "cyan" | "muted";
}) {
  const barColor =
    tone === "amber" ? "bg-amber-400" : tone === "cyan" ? "bg-cyan-400" : "bg-white/20";
  const dotColor =
    tone === "amber" ? "bg-amber-400" : tone === "cyan" ? "bg-cyan-400" : "bg-white/30";

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2.5 text-sm text-slate-300">
          <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} aria-hidden="true" />
          <span className="truncate">{label}</span>
        </span>
        <span className="shrink-0 font-mono text-sm text-white">{value}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${Math.min(Math.max(share, 0.5), 100)}%` }}
        />
      </div>
    </div>
  );
}
