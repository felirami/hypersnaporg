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
        title="Run the decentralized network, not just a client against it."
        description="Hypersnap nodes read and write Farcaster messages, expose local HTTP/gRPC surfaces, and help keep the fork independently accessible."
      />

      <Section title="Bootstrap from the Farcasterorg source.">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <CodeBlock label="Stable install" command={sources.node.bootstrapCommand} />
          <InfoPanel icon={AlertTriangle} title="Operator notice">
            <p>{sources.node.noRewardsNotice}</p>
          </InfoPanel>
        </div>
      </Section>

      <Section
        eyebrow="Requirements"
        title="Provision for real chain data, not a toy process."
        description="The node maintains a local RocksDB store, catches up from snapshots, and exposes both HTTP and protocol ports."
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

      <Section eyebrow="Operations" title="The node script keeps common work tight.">
        <div className="grid gap-5 lg:grid-cols-2">
          {sources.node.commands.map((command) => (
            <CodeBlock command={command.command} key={command.label} label={command.label} />
          ))}
          <CodeBlock label="Nightly channel" command={sources.node.nightlyCommand} />
        </div>
      </Section>

      <Section
        eyebrow="Runbook"
        title="A practical operator loop."
        description="Start with the bootstrap script, verify the local HTTP surface, then keep upgrades and logs close while the node catches up."
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
