import type { Metadata } from "next";
import { BookOpen, Compass, Globe, HeartHandshake, RadioTower, Server, UserRound, Users } from "lucide-react";
import { InfoPanel, LinkButton, PageHeader, Section } from "@/components/ui";
import { creator } from "@/lib/creator";
import { sources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Hypersnap, the decentralized Farcaster fork, and Hypersnap.org, the portal made by Felirami.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A social network without an owner."
        description="Hypersnap is a decentralized social network — built and run by people anywhere in the world. No company. No VC. No single point of control. Here's the longer story."
      />

      <Section
        eyebrow="What it is"
        title="The network is the people running it."
      >
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-base leading-7 text-slate-200">
            <p>
              On most social networks, one company owns the servers, the user database, the
              moderation rules, and the algorithm. They can change any of those at any time, sell
              the company, or shut the whole thing down — and your account, your followers, and
              your posts go with them.
            </p>
            <p className="mt-4">
              Hypersnap doesn&apos;t work that way. The network is made of many independent nodes,
              each run by a different person. Anyone can run one. The protocol — the rules
              everyone&apos;s nodes agree on — is open source and shared. No single party can change
              it unilaterally.
            </p>
            <p className="mt-4">
              You get the same kind of social experience you&apos;d expect from Farcaster — posts,
              follows, identities, channels. The difference is structural: the network keeps
              running as long as people keep running it.
            </p>
          </div>
          <div className="grid gap-4">
            <InfoPanel icon={RadioTower} title="Many nodes, no center">
              <p>
                Each node holds its own copy of the network and talks to others as a peer. There
                isn&apos;t a head office to call.
              </p>
            </InfoPanel>
            <InfoPanel icon={Globe} title="Run by people anywhere">
              <p>
                Operators are spread across the world. The network gets stronger every time
                someone new spins up a node.
              </p>
            </InfoPanel>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Why it exists"
        title="Decentralization that's actually decentralized."
      >
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-base leading-7 text-slate-200">
          <p>
            Farcaster set out to be a decentralized social protocol, and it got most of the way
            there: open identities, open clients, open data formats. But the data layer that
            powers all of it — Snapchain — has so far been mostly run by a single team.
          </p>
          <p className="mt-4">
            Hypersnap takes the open Snapchain code and runs it the way decentralization is
            supposed to work: many independent operators, no single point of control, no kill
            switch. Same network, same apps, same identities. Different ownership story.
          </p>
          <p className="mt-4">
            This isn&apos;t a critique of what came before — it&apos;s a continuation of the same
            project, taken a step further by people who want to see it through.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Who builds it"
        title="A global community of contributors."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <InfoPanel icon={Users} title="No company, no VC">
            <p>
              There&apos;s no business entity behind Hypersnap. No investors, no token sale, no
              founders&apos; equity. The project owes nothing to anyone but the people using it.
            </p>
          </InfoPanel>
          <InfoPanel icon={HeartHandshake} title="Anyone can contribute">
            <p>
              Code, docs, design, ideas, running a node, telling a friend — every kind of
              contribution counts. Nobody needs permission to help.
            </p>
          </InfoPanel>
          <InfoPanel icon={Compass} title="All in public">
            <p>
              Every change is a pull request. Every release, every issue, every conversation is
              visible at github.com/farcasterorg.
            </p>
          </InfoPanel>
        </div>
      </Section>

      <Section
        eyebrow="Who made this site"
        title="Hypersnap.org is made by Felirami."
        description="The protocol is open source and community-run. This website is a solo developer contribution from Felirami, built to make the new Farcaster easier for people to understand, access, and improve."
      >
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <InfoPanel icon={UserRound} title={creator.name}>
            <p>
              {creator.role}. Felirami maintains the portal, keeps it pointed at the Farcasterorg
              source, and helps contributors find the right next step.
            </p>
          </InfoPanel>
          <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
            <p className="text-sm uppercase tracking-[0.14em] text-cyan-100">Find Felirami</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Website, social, and source</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              If you are using Hypersnap.org, following the project, or looking for the person
              maintaining this portal, start here.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {creator.links.map((link) => (
                <LinkButton href={link.href} key={link.href} variant="secondary" external>
                  {link.label}
                </LinkButton>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Where we are today"
        title="Honest status: still being built."
      >
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-base leading-7 text-slate-200">
            <p>
              Hypersnap is alive. There&apos;s a public node you can read from right now, and
              anyone can run their own. The protocol works — the network is real — and the work
              keeps going every day.
            </p>
            <p className="mt-4">
              But there isn&apos;t a polished consumer app branded &quot;Hypersnap&quot; yet, and we
              won&apos;t pretend otherwise. Today, the most useful things you can do depend on what
              you&apos;re bringing.
            </p>
          </div>
          <InfoPanel icon={Server} title="What works today">
            <p>
              Read the public node. Run a local node. Build with the API. Watch the network grow
              through public PRs and releases.
            </p>
          </InfoPanel>
        </div>
      </Section>

      <Section
        eyebrow="Get involved"
        title="Pick the way in that fits you."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <InfoPanel icon={Globe} title="Just curious">
            <p className="mb-4">
              Follow along. The network grows in public — every line of code, every decision,
              every release lives on GitHub.
            </p>
            <LinkButton href={sources.organization.url} variant="secondary" external>
              Follow on GitHub
            </LinkButton>
          </InfoPanel>
          <InfoPanel icon={BookOpen} title="Build something">
            <p className="mb-4">
              Read the docs, query the public node, integrate against the API. Anything built for
              Farcaster works here too.
            </p>
            <LinkButton href="/docs" variant="secondary">
              Read the docs
            </LinkButton>
          </InfoPanel>
          <InfoPanel icon={HeartHandshake} title="Help build it">
            <p className="mb-4">
              Run a node, ship a PR, improve the docs, design a logo, write a guide. Contributions
              of every kind are welcome.
            </p>
            <LinkButton href="/contribute" variant="secondary">
              Ways to help
            </LinkButton>
          </InfoPanel>
        </div>
      </Section>
    </>
  );
}
