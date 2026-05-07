import type { Metadata } from "next";
import { AlertTriangle, Gauge, HardDrive, Network, ServerCog, Terminal } from "lucide-react";
import { CodeBlock, InfoPanel, PageHeader, Section } from "@/components/ui";
import { sources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Run a Node",
  description: "Bootstrap, upgrade, monitor, and operate a Hypersnap node.",
  alternates: {
    canonical: "/run-a-node",
  },
};

export default function RunNodePage() {
  return (
    <>
      <PageHeader
        eyebrow="Operators"
        title="Run part of the network yourself."
        description="Every node makes the network a little more decentralized. This page is for people who want to operate one. You don't have to be an expert — there's a single bootstrap command — but you do need a machine to run it on."
      />

      <Section
        title="Get started with one command."
        description="The bootstrap script pulls the latest stable node from the Farcasterorg source, sets up the local store, and starts syncing."
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <CodeBlock label="Stable install" command={sources.node.bootstrapCommand} />
          <InfoPanel icon={AlertTriangle} title="Heads up">
            <p>{sources.node.noRewardsNotice}</p>
          </InfoPanel>
        </div>
      </Section>

      <Section
        eyebrow="Requirements"
        title="What you'll need to run a node."
        description="A node holds its own copy of the network's data and stays in sync with peers. That means real disk, real bandwidth, and a few open ports."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <InfoPanel icon={HardDrive} title="Machine">
            <ul className="space-y-2">
              {sources.node.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </InfoPanel>
          <InfoPanel icon={Network} title="Ports">
            <ul className="space-y-2">
              {sources.node.ports.map((port) => (
                <li key={port}>{port}</li>
              ))}
            </ul>
          </InfoPanel>
          <InfoPanel icon={Gauge} title="Catch-up">
            <p>
              A new node downloads historical snapshots, then syncs until max heights rise and block
              delay approaches zero.
            </p>
          </InfoPanel>
        </div>
      </Section>

      <Section
        eyebrow="Operations"
        title="Day-to-day commands."
        description="The bundled script wraps the most common tasks so you don't have to memorize flags."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {sources.node.commands.map((command) => (
            <CodeBlock command={command.command} key={command.label} label={command.label} />
          ))}
          <CodeBlock label="Nightly channel" command={sources.node.nightlyCommand} />
        </div>
      </Section>

      <Section
        eyebrow="Runbook"
        title="The operator loop, in three steps."
        description="Install, verify, then keep an eye on it while it catches up. The first sync takes a while; after that it's mostly steady state."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <InfoPanel icon={Terminal} title="Install">
            <p>Run the bootstrap command from a machine with public networking and Docker available.</p>
          </InfoPanel>
          <InfoPanel icon={ServerCog} title="Verify">
            <p>
              Query <code className="font-mono text-cyan-100">/v1/info</code> locally and watch
              heights increase while block delay falls.
            </p>
          </InfoPanel>
          <InfoPanel icon={AlertTriangle} title="Monitor">
            <p>Track storage growth, shard lag, release version, and Grafana metrics when enabled.</p>
          </InfoPanel>
        </div>
      </Section>
    </>
  );
}
