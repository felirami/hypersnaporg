import type { Metadata } from "next";
import { Suspense } from "react";
import {
  BookOpen,
  GitBranch,
  GitPullRequest,
  Globe,
  RadioTower,
  Server,
  Terminal,
  UserRound,
  Users,
} from "lucide-react";
import { NetworkStatusGrid } from "@/components/network-status";
import { SnapMarketDashboard } from "@/components/snap-market-dashboard";
import { Badge, CodeBlock, InfoPanel, LinkButton, Section, StatCard } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { creator } from "@/lib/creator";
import { SNAP } from "@/lib/snap";
import { sources } from "@/lib/sources";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const principles = [
  {
    title: "Owned by everyone running it",
    description:
      "Your account, your followers, your posts — they don't live on one company's servers. As long as people keep running nodes, the network keeps running. No one can flip a switch and turn it off.",
    icon: RadioTower,
  },
  {
    title: "Works with Farcaster",
    description:
      "Hypersnap speaks the same wire format as Farcaster, so apps and identities built for Farcaster work here too. The difference is structural: the network belongs to whoever runs a piece of it, not a single company.",
    icon: GitBranch,
  },
  {
    title: "Built in the open, by everyone",
    description:
      "No company, no VC, no token sale. A global community of contributors writes the code, runs the nodes, and ships the changes — every PR public, every decision visible at github.com/farcasterorg.",
    icon: Users,
  },
];

const heroSignals = [
  { label: "Live node", value: "haatz.quilibrium.com", className: "right-8 top-12" },
  { label: "Source code", value: "github.com/farcasterorg", className: "right-32 top-52" },
  { label: "Sync cadence", value: "daily review PRs", className: "right-2 top-[22rem]" },
];

const snapStats = [
  {
    label: "Total supply",
    value: "200B",
    detail: "Fixed $SNAP supply. Dexscreener may report supply or FDV incorrectly for the live pool.",
  },
  {
    label: "Retro allocation",
    value: "200M",
    detail: "Community retro rewards allocation, separate from total supply.",
  },
  {
    label: "Phase 1 opened",
    value: "33M",
    detail: "The first claim phase opened 33M $SNAP through Hypria.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#020617_0%,#061626_45%,#04231f_100%)]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(125,211,252,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.16)_1px,transparent_1px)] [background-size:56px_56px]"
        />
        <HeroSignalField />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.86)_52%,rgba(2,6,23,0.35)_100%),linear-gradient(180deg,rgba(2,6,23,0.02)_0%,#020617_100%)]" />
        <div className="relative mx-auto flex min-h-[72svh] w-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Badge>Built by contributors worldwide. No company. No VC.</Badge>
          <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold tracking-normal text-white sm:text-7xl lg:text-8xl">
            Hypersnap
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-2xl font-medium leading-9 text-white sm:text-3xl sm:leading-tight">
            A decentralized social network — actually decentralized.
          </p>
          <p className="mt-5 max-w-3xl text-pretty text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
            The evolution of Farcaster: same posts, follows, and identities — but every node
            is run by someone different, anywhere in the world. No company. No VC. No single
            owner. It&apos;s still being built, out in the open. You can read it, run it, or
            help build it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/about">What is Hypersnap?</LinkButton>
            <LinkButton href="/run-a-node" variant="secondary">
              Run a node
            </LinkButton>
            <LinkButton href="/contribute" variant="secondary">
              Help build it
            </LinkButton>
          </div>
        </div>
      </section>

      <Section
        eyebrow="What is Hypersnap"
        title="A social network that belongs to the people running it."
        description="Same kind of social experience as Farcaster — posts, follows, identities, channels. The difference is structural: instead of one company hosting the network, Hypersnap runs across many independent nodes, each operated by a different person, anywhere in the world."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <InfoPanel icon={principle.icon} key={principle.title} title={principle.title}>
              <p>{principle.description}</p>
            </InfoPanel>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Live network"
        title="The network is running. You can see it for yourself."
        description={`There's a public node anyone can read from right now: ${sources.publicNode.baseUrl}. We check it every minute. Numbers below are real.`}
      >
        <Suspense fallback={<div className="h-32 rounded-lg border border-white/10 bg-white/[0.04]" />}>
          <NetworkStatusGrid />
        </Suspense>
      </Section>

      <Section
        id="snap"
        eyebrow="$SNAP"
        title="$SNAP is live. Keep the numbers straight."
        description="The token is part of the Hypersnap ecosystem rollout and retro rewards process. Live market data belongs on its own page, with corrected FDV math and source links."
      >
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {snapStats.map((stat) => (
              <StatCard detail={stat.detail} key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
          <div className="grid gap-4">
            <SnapMarketDashboard variant="compact" />
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Full explainer</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Price, corrected FDV, charts, claims, and discussions.</h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                The $SNAP page separates market data from supply data, explains the 200B / 200M / 33M numbers, and links to the public FIP discussions.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <LinkButton href="/snap">Open $SNAP page</LinkButton>
                <LinkButton href={SNAP.claimUrl} variant="secondary" external>
                  Claim on Hypria
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Get involved"
        title="There's a path for everyone."
        description="You don't have to write code, run servers, or even understand all of this to be part of it. Pick the way in that fits."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoPanel icon={Globe} title="Just curious">
            <p className="mb-4">
              Watch the work happen in public. Every line of code, every decision, every release
              lives on GitHub.
            </p>
            <LinkButton
              href={sources.organization.url}
              variant="secondary"
              external
            >
              Follow on GitHub
            </LinkButton>
          </InfoPanel>
          <InfoPanel icon={BookOpen} title="Build with it">
            <CodeBlock
              label="Read public data"
              command={`curl -s "${sources.publicNode.baseUrl}${sources.publicNode.apiPrefix}/user?fid=3" | jq .`}
            />
          </InfoPanel>
          <InfoPanel icon={Terminal} title="Run a node">
            <p className="mb-4">
              Help make the network more decentralized by running part of it yourself. One command
              gets you started, and the open-source helper gives you a doctor command when things
              get weird.
            </p>
            <div className="mb-4">
              <CodeBlock label="Operator helper" command="curl -fsSL https://hypersnap.org/install.sh | bash" />
            </div>
            <LinkButton href="/run-a-node" variant="secondary">
              See how
            </LinkButton>
          </InfoPanel>
          <InfoPanel icon={GitPullRequest} title="Help build it">
            <p className="mb-4">
              Code, docs, design, ideas — anyone who wants to contribute is welcome. The whole
              project lives in public PRs.
            </p>
            <LinkButton href="/contribute" variant="secondary">
              Ways to help
            </LinkButton>
          </InfoPanel>
        </div>
      </Section>

      <Section
        eyebrow="Made by Felirami"
        title="A solo developer contribution to the new Farcaster."
        description="Hypersnap is open protocol work. Hypersnap.org is the public portal Felirami maintains so people can understand the network, run nodes, and find the source without getting lost."
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
            <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">{creator.handle}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{creator.name}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
              {creator.role}. This site is intentionally signed, because public infrastructure
              should make stewardship visible.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {creator.links.map((link) => (
                <LinkButton href={link.href} key={link.href} variant="secondary" external>
                  {link.label}
                </LinkButton>
              ))}
            </div>
          </div>
          <InfoPanel icon={UserRound} title="Clear attribution, open project">
            <p>
              Felirami maintains the website and contributes to the Farcasterorg effort. The protocol
              remains open source, inspectable, and open to anyone who wants to help.
            </p>
          </InfoPanel>
        </div>
      </Section>

      <Section
        eyebrow="Source truth"
        title="What you read here matches what's actually shipping."
        description="The site updates itself from the open Farcasterorg repos. Repo metadata, README summaries, releases, docs links — all pulled from source so the portal stays honest."
      >
        <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Latest source update</p>
            <p className="mt-4 text-3xl font-semibold text-white">{formatDate(sources.sourceUpdatedAt)}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              A scheduled job pulls fresh data from public repositories every day, then opens a
              reviewable PR if anything meaningful changed.
            </p>
          </div>
          <InfoPanel icon={Server} title="Built lightweight">
            <p>
              The site is a static portal generated from open source data. No persistent backend,
              no telemetry pipeline — what you see here is a faithful snapshot of the public code.
            </p>
          </InfoPanel>
        </div>
      </Section>
    </>
  );
}

function HeroSignalField() {
  return (
    <div aria-hidden="true" className="absolute inset-0 hidden overflow-hidden lg:block">
      <div className="absolute right-[-7rem] top-12 h-[34rem] w-[54rem] rotate-[-7deg] border border-cyan-200/18 bg-cyan-200/[0.03]" />
      <div className="absolute right-[-3rem] top-24 h-[25rem] w-[43rem] rotate-[5deg] border border-emerald-200/18 bg-emerald-200/[0.025]" />
      <div className="absolute right-16 top-16 h-px w-[42rem] rotate-[20deg] bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />
      <div className="absolute right-4 top-64 h-px w-[38rem] rotate-[-14deg] bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent" />
      <div className="absolute right-40 top-40 h-[22rem] w-px rotate-[18deg] bg-gradient-to-b from-transparent via-amber-100/35 to-transparent" />

      {heroSignals.map((signal) => (
        <div
          className={`absolute ${signal.className} rounded-md border border-white/12 bg-slate-950/72 px-4 py-3 shadow-2xl shadow-slate-950/30 backdrop-blur-md`}
          key={signal.label}
        >
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-cyan-100">
            {signal.label}
          </p>
          <p className="mt-1 font-mono text-sm text-white">{signal.value}</p>
        </div>
      ))}

      <div className="absolute right-80 top-28 h-2.5 w-2.5 rounded-[2px] bg-cyan-200 shadow-[0_0_24px_rgba(103,232,249,0.85)]" />
      <div className="absolute right-24 top-80 h-2.5 w-2.5 rounded-[2px] bg-emerald-200 shadow-[0_0_24px_rgba(167,243,208,0.75)]" />
      <div className="absolute right-[29rem] top-72 h-2.5 w-2.5 rounded-[2px] bg-amber-100 shadow-[0_0_24px_rgba(254,243,199,0.65)]" />
    </div>
  );
}
