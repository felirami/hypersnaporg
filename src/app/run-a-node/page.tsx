import type { Metadata } from "next";
import {
  AlertTriangle,
  CircleCheck,
  Cloud,
  Cpu,
  Gauge,
  HardDrive,
  Heart,
  Home,
  Lock,
  MessagesSquare,
  Network,
  ScrollText,
  Server,
  ServerCog,
  ShieldCheck,
  Stethoscope,
  Terminal,
} from "lucide-react";
import { CodeBlock, InfoPanel, LinkButton, PageHeader, Section } from "@/components/ui";
import { NodeInfoChecker } from "@/components/node-info-checker";
import { sources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Run a node",
  description:
    "Provision, install, operate, diagnose, and troubleshoot a Hypersnap node — preflight, bootstrap, firewall, health checks, and copy-paste templates.",
  alternates: {
    canonical: "/run-a-node",
  },
};

const PREFLIGHT_COMMAND = `lsb_release -a
nproc
free -h
lsblk -f
df -h
ip -brief addr`;

const INSTALL_COMMAND = `mkdir -p ~/hypersnap
cd ~/hypersnap
${sources.node.bootstrapCommand}`;

const CATCHUP_COMMAND = `cd ~/hypersnap
./hypersnap.sh logs
# In another terminal:
curl -s http://127.0.0.1:3381/v1/info | jq .`;

const DIAGNOSTICS_COMMAND = `cd ~/hypersnap 2>/dev/null || true
printf '\\n== host ==\\n'
hostnamectl 2>/dev/null || uname -a
printf '\\n== resources ==\\n'
nproc; free -h; df -h
printf '\\n== docker containers ==\\n'
docker ps -a --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}' 2>&1
printf '\\n== compose ps ==\\n'
(docker compose ps || docker-compose ps) 2>&1
printf '\\n== ports ==\\n'
ss -tulpen | grep -E '3381|3382|3383' || true
printf '\\n== info endpoint ==\\n'
curl -fsS --connect-timeout 5 http://127.0.0.1:3381/v1/info 2>&1 || true
printf '\\n== recent logs ==\\n'
(docker compose logs --tail 120 hypersnap || docker-compose logs --tail 120 hypersnap) 2>&1`;

const FRIEND_INSTALL_MESSAGE = `Please paste terminal output, not screenshots.

If this is a fresh Hypersnap install, use the bootstrap flow — not raw \`docker run\`:

mkdir -p ~/hypersnap
cd ~/hypersnap
${sources.node.bootstrapCommand}

It will ask you to acknowledge there are no current token rewards. That prompt is expected.`;

const FRIEND_DEBUG_MESSAGE = `Please run this and paste the full text output:

cd ~/hypersnap 2>/dev/null || true
docker ps -a
(docker compose ps || docker-compose ps) 2>&1
(docker compose logs --tail 120 hypersnap || docker-compose logs --tail 120 hypersnap) 2>&1
df -h
curl -s http://127.0.0.1:3381/v1/info || true`;

const TROUBLESHOOTING = [
  {
    title: "Container exits with code 1 after a manual docker run",
    open: true,
    body: (
      <p>
        Most common cause: starting the image without the generated <code>config.toml</code> or the
        right volume mounts. Stop creating new failed containers, read logs from the latest one, and
        switch to the bootstrap / Compose flow.
      </p>
    ),
  },
  {
    title: <><code className="font-mono text-cyan-100">docker ps</code> is empty</>,
    body: (
      <p>
        No running container. Run <code>docker ps -a</code> to see failed/stopped containers, then
        read logs from the newest failed one.
      </p>
    ),
  },
  {
    title: <><code className="font-mono text-cyan-100">/v1/info</code> refuses connection during the first sync</>,
    body: (
      <p>
        Often normal during snapshot bootstrap. Check the logs for snapshot chunk progress before
        declaring the node dead.
      </p>
    ),
  },
  {
    title: "Ports look closed from outside",
    body: (
      <p>
        Separate the layers: cloud firewall, host firewall, Docker port mapping, app readiness. If
        packets reach the server but the app returns RST, it&apos;s the app, not the firewall.
      </p>
    ),
  },
  {
    title: "Disk hits 100% during snapshot import",
    body: (
      <p>
        Don&apos;t blindly delete snapshot artifacts. Run <code>df -h</code> and{" "}
        <code>du -xhd1 ~/hypersnap</code> first. Prefer expanding storage over cleanup unless you
        can prove a staging directory is stale and unused.
      </p>
    ),
  },
];

export default function RunNodePage() {
  return (
    <>
      <PageHeader
        eyebrow="Operators"
        title="Run part of the network yourself."
        description="Every node makes the network a little more decentralized. This page is the operator field guide — how to provision, install, operate, diagnose, and troubleshoot a Hypersnap node, with copy-paste commands and clear checks at each step."
      />

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-amber-300/25 bg-amber-300/[0.06] p-5 text-sm leading-6 text-amber-50">
          <p>
            <span className="font-semibold">Reality check:</span> the install script asks operators
            to acknowledge that the network has not released a token and running a node currently
            doesn&apos;t earn tokens. Future incentive chatter is not a promise. Don&apos;t market
            this as guaranteed rewards.
          </p>
        </div>
      </div>

      <Section
        eyebrow="Provision"
        title="Pick a machine that can stay online."
        description="An early node operator just needs a stable VPS. Home installs can work, but NAT, sleep modes, dynamic IPs, and port forwarding add a lot of moving parts — go that route only if you're comfortable troubleshooting them."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <InfoPanel icon={Cloud} title="Cloud / VPS path (recommended)">
            <ul className="space-y-2 text-sm leading-6">
              <li className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" /><span>Ubuntu 24.04 LTS x64</span></li>
              <li className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" /><span>4 vCPU / 16 GB RAM minimum</span></li>
              <li className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" /><span>1.5 TB block storage minimum (1.6 TB gives breathing room)</span></li>
              <li className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" /><span>Public IPv4 address</span></li>
              <li className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" /><span>Cloud Firewall: SSH restricted, P2P / API ports open</span></li>
            </ul>
            <p className="mt-4 text-xs leading-5 text-slate-400">
              Shared CPU works if budget matters. Dedicated CPU is more reliable for long-running
              sync, but costs more.
            </p>
          </InfoPanel>
          <InfoPanel icon={Home} title="Home / local path">
            <ul className="space-y-2 text-sm leading-6 text-slate-300">
              <li>Keep the machine awake — no laptops closing mid-sync.</li>
              <li>Forward required ports from the router to the host.</li>
              <li>Use wired ethernet if possible.</li>
              <li>Expect Docker Desktop / WSL weirdness on consumer machines.</li>
              <li>Dynamic IP changes will break peer reachability.</li>
            </ul>
            <p className="mt-4 text-xs leading-5 text-slate-400">
              Great for learning. Less great if you want a reliable public-facing node.
            </p>
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
            <ul className="space-y-2 text-sm leading-6">
              {sources.node.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </InfoPanel>
          <InfoPanel icon={Network} title="Ports">
            <ul className="space-y-2 text-sm leading-6">
              {sources.node.ports.map((port) => (
                <li key={port}>{port}</li>
              ))}
            </ul>
          </InfoPanel>
          <InfoPanel icon={Gauge} title="Catch-up">
            <p className="text-sm leading-6">
              A new node downloads historical snapshots, then syncs until max heights rise and
              block delay approaches zero. Initial catch-up can take up to a couple of hours.
            </p>
          </InfoPanel>
        </div>
      </Section>

      <Section
        id="install"
        eyebrow="Install"
        title="Three steps. Do them in order."
        description="Run these from the target server. Verify resources first, then install, then watch catch-up. If you attached a large volume, make sure ~/hypersnap resolves onto that volume before bootstrapping."
      >
        <ol className="grid gap-5">
          <StepCard
            number={1}
            title="Preflight the server"
            description="Confirm OS, CPU, RAM, disk, and mount state. If disk is tiny here, stop and fix storage first."
          >
            <CodeBlock label="Preflight" command={PREFLIGHT_COMMAND} />
          </StepCard>
          <StepCard
            number={2}
            title="Install via Hypersnap bootstrap"
            description="The script installs dependencies, writes ~/hypersnap/hypersnap.sh, fetches Compose/config assets, and starts the managed Docker Compose flow."
          >
            <CodeBlock label="Bootstrap" command={INSTALL_COMMAND} />
            <div className="mt-3 flex flex-wrap items-start gap-2 rounded-md border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-slate-400">
              <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
              <span>
                You&apos;ll be asked to acknowledge there are no current token rewards. That prompt
                is expected. {sources.node.noRewardsNotice}
              </span>
            </div>
          </StepCard>
          <StepCard
            number={3}
            title="Watch catch-up"
            description="Initial snapshot catch-up can take a while. The local health endpoint may refuse connections until enough bootstrap state exists."
          >
            <CodeBlock label="Watch logs + health" command={CATCHUP_COMMAND} />
          </StepCard>
        </ol>
      </Section>

      <Section
        id="firewall"
        eyebrow="Network"
        title="Open the right ports — not the whole castle."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <InfoPanel icon={Lock} title="Cloud firewall (recommended)">
            <ul className="space-y-2 text-sm leading-6">
              <li>TCP 22 from your IP or Tailscale only</li>
              <li>TCP 3381–3383 from all IPv4/IPv6 (if running a public node)</li>
              <li>UDP 3381–3383 from all IPv4/IPv6 (if running a public node)</li>
              <li>Outbound: allow all</li>
            </ul>
          </InfoPanel>
          <InfoPanel icon={Server} title="What Compose actually publishes">
            <ul className="space-y-2 text-sm leading-6">
              <li>
                <code className="font-mono text-cyan-100">3381:3381/tcp</code>
              </li>
              <li>
                <code className="font-mono text-cyan-100">3382:3382/udp</code>
              </li>
              <li>
                <code className="font-mono text-cyan-100">3383:3383/tcp</code>
              </li>
            </ul>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              The README says ports 3381–3383 on TCP and UDP. The wider firewall rule is safer
              while upstream packaging is still moving.
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
        id="diagnostics"
        eyebrow="Diagnostics"
        title="Ask for terminal output, not screenshots."
        description="When something looks broken, this read-only diagnostic captures the state that explains 90% of failed installs: containers, logs, disk, ports, and the health endpoint."
      >
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <CodeBlock label="Read-only diagnostic" command={DIAGNOSTICS_COMMAND} />
          <NodeInfoChecker />
        </div>
      </Section>

      <Section
        id="troubleshoot"
        eyebrow="Troubleshooting"
        title="Common failures, with what they actually mean."
      >
        <div className="grid gap-3">
          {TROUBLESHOOTING.map((item, index) => (
            <details
              className="group rounded-lg border border-white/10 bg-white/[0.04] p-5 [&_summary::-webkit-details-marker]:hidden"
              key={index}
              open={item.open}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
                <span>{item.title}</span>
                <span
                  aria-hidden="true"
                  className="text-cyan-200 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 text-sm leading-6 text-slate-300">{item.body}</div>
            </details>
          ))}
        </div>
      </Section>

      <Section
        id="runbook"
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

      <Section
        id="helping"
        eyebrow="Helping a friend"
        title="Two messages worth keeping in your clipboard."
        description="When someone you know is stuck, send terminal output — not screenshots. These are pre-baked to ask for the right thing."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FriendCard
            icon={MessagesSquare}
            title="Install message"
            command={FRIEND_INSTALL_MESSAGE}
          />
          <FriendCard
            icon={Stethoscope}
            title="Debug message"
            command={FRIEND_DEBUG_MESSAGE}
          />
        </div>
      </Section>

      <Section
        eyebrow="Sources"
        title="Grounded links."
        description="Operator content here is adapted from upstream. Check these before betting time or money."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <SourceLink
            href="https://github.com/farcasterorg/hypersnap"
            label="farcasterorg/hypersnap"
            sub="Protocol implementation and bootstrap script source"
            icon={ScrollText}
          />
          <SourceLink
            href="https://raw.githubusercontent.com/farcasterorg/hypersnap/refs/heads/main/scripts/hypersnap-bootstrap.sh"
            label="hypersnap-bootstrap.sh"
            sub="The exact script the install command runs"
            icon={Cpu}
          />
          <SourceLink
            href="https://raw.githubusercontent.com/farcasterorg/hypersnap/refs/heads/main/docker-compose.mainnet.yml"
            label="docker-compose.mainnet.yml"
            sub="Current mainnet Compose file"
            icon={ShieldCheck}
          />
          <SourceLink
            href="https://gist.github.com/CassOnMars/cbb2007b2bcb713b81da827180d4ffb7"
            label="CassOnMars 'how to hypersnap' gist"
            sub="Operator notes from upstream contributors"
            icon={Heart}
          />
        </div>
        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-300">
          <p>
            Big chunks of this guide are adapted from{" "}
            <span className="font-medium text-white">Arca&apos;s Hypersnap Node Starter Kit</span>
            , an operator-friendly wrapper around the upstream bootstrap flow. Thanks to Arca / Cad
            for the field notes.
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-400">
            This page wraps upstream — it doesn&apos;t replace it. Upstream docs are still moving
            fast and mix Snapchain / Hypersnap language. When in doubt, run the linked source.
          </p>
        </div>
      </Section>

      <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-sm leading-6 text-slate-300">
          <p className="font-semibold text-white">Still stuck?</p>
          <p className="mt-2">
            Open an issue on the upstream repo with the diagnostic output above pasted in — every
            issue is public, and the more concrete output you share the faster someone can help.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <LinkButton href="https://github.com/farcasterorg/hypersnap/issues" external>
              Open an issue
            </LinkButton>
            <LinkButton href="/contribute" variant="secondary">
              How to contribute
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}

function StepCard({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/[0.08] font-mono text-base text-cyan-100">
          {number}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </li>
  );
}

type Icon = (props: { className?: string; "aria-hidden"?: boolean | "true" }) => React.ReactNode;

function FriendCard({
  icon: IconComponent,
  title,
  command,
}: {
  icon: Icon;
  title: string;
  command: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-3">
        <IconComponent aria-hidden="true" className="h-5 w-5 text-cyan-200" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="mt-4">
        <CodeBlock command={command} label="Send this" />
      </div>
    </div>
  );
}

function SourceLink({
  href,
  label,
  sub,
  icon: IconComponent,
}: {
  href: string;
  label: string;
  sub: string;
  icon: Icon;
}) {
  return (
    <a
      className="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/50 hover:bg-cyan-300/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]">
        <IconComponent aria-hidden="true" className="h-4 w-4 text-cyan-200" />
      </span>
      <span className="min-w-0">
        <span className="block break-words text-sm font-medium text-white group-hover:text-white">
          {label}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-400">{sub}</span>
      </span>
    </a>
  );
}
