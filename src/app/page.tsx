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
import { HeroSection } from "@/components/hero/hero-section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { NetworkStatusGrid } from "@/components/network-status";
import { SnapMarketDashboard } from "@/components/snap-market-dashboard";
import { CodeBlock, InfoPanel, LinkButton, Section, StatCard } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { creator } from "@/lib/creator";
import { getSnapMarketData } from "@/lib/snap-market";
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

export default async function Home() {
  const snapMarket = await getSnapMarketData();

  return (
    <>
      <HeroSection />

      <Section
        eyebrow="What is Hypersnap"
        title="A social network that belongs to the people running it."
        description="Same kind of social experience as Farcaster — posts, follows, identities, channels. The difference is structural: instead of one company hosting the network, Hypersnap runs across many independent nodes, each operated by a different person, anywhere in the world."
      >
        <Stagger className="grid gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <StaggerItem key={principle.title}>
              <InfoPanel icon={principle.icon} title={principle.title}>
                <p>{principle.description}</p>
              </InfoPanel>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section
        eyebrow="Live network"
        title="The network is running. You can see it for yourself."
        description={`There's a public node anyone can read from right now: ${sources.publicNode.baseUrl}. We check it every minute. Numbers below are real.`}
      >
        <Reveal>
          <Suspense fallback={<div className="glass-panel h-36 rounded-2xl" />}>
            <NetworkStatusGrid />
          </Suspense>
        </Reveal>
      </Section>

      <Section
        id="snap"
        eyebrow="$SNAP"
        title="$SNAP is live. Keep the numbers straight."
        description="The token is part of the Hypersnap ecosystem rollout and retro rewards process. Live market data belongs on its own page, with corrected FDV math and source links."
      >
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {snapStats.map((stat) => (
                <StatCard detail={stat.detail} key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
            <div className="grid gap-5">
              <SnapMarketDashboard initialData={snapMarket} variant="compact" />
              <div className="glass-panel rounded-2xl p-7">
                <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Full explainer</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Price, corrected FDV, charts, claims, and discussions.
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  The $SNAP page separates market data from supply data, explains the 200B / 200M / 33M numbers, and links to the public FIP discussions.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <LinkButton href="/snap">Open $SNAP page</LinkButton>
                  <LinkButton href={SNAP.claimUrl} variant="secondary" external>
                    Claim on Hypria
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section
        eyebrow="Get involved"
        title="There's a path for everyone."
        description="You don't have to write code, run servers, or even understand all of this to be part of it. Pick the way in that fits."
      >
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <InfoPanel icon={Globe} title="Just curious">
              <p className="mb-4">
                Watch the work happen in public. Every line of code, every decision, every release
                lives on GitHub.
              </p>
              <LinkButton href={sources.organization.url} variant="secondary" external>
                Follow on GitHub
              </LinkButton>
            </InfoPanel>
          </StaggerItem>
          <StaggerItem>
            <InfoPanel icon={BookOpen} title="Build with it">
              <CodeBlock
                label="Read public data"
                command={`curl -s "${sources.publicNode.baseUrl}${sources.publicNode.apiPrefix}/user?fid=3" | jq .`}
              />
            </InfoPanel>
          </StaggerItem>
          <StaggerItem>
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
          </StaggerItem>
          <StaggerItem>
            <InfoPanel icon={GitPullRequest} title="Help build it">
              <p className="mb-4">
                Code, docs, design, ideas — anyone who wants to contribute is welcome. The whole
                project lives in public PRs.
              </p>
              <LinkButton href="/contribute" variant="secondary">
                Ways to help
              </LinkButton>
            </InfoPanel>
          </StaggerItem>
        </Stagger>
      </Section>

      <Section
        eyebrow="Made by Felirami"
        title="A solo developer contribution to the new Farcaster."
        description="Hypersnap is open protocol work. Hypersnap.org is the public portal Felirami maintains so people can understand the network, run nodes, and find the source without getting lost."
      >
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="glass-panel rounded-2xl border-cyan-400/15 p-8">
              <p className="text-sm uppercase tracking-[0.14em] text-slate-500">{creator.handle}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">{creator.name}</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                {creator.role}. This site is intentionally signed, because public infrastructure
                should make stewardship visible.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
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
        </Reveal>
      </Section>

      <Section
        eyebrow="Source truth"
        title="What you read here matches what's actually shipping."
        description="The site updates itself from the open Farcasterorg repos. Repo metadata, README summaries, releases, docs links — all pulled from source so the portal stays honest."
      >
        <Reveal>
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="glass-panel rounded-2xl p-8">
              <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Latest source update</p>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{formatDate(sources.sourceUpdatedAt)}</p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
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
        </Reveal>
      </Section>
    </>
  );
}
