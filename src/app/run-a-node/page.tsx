import type { Metadata } from "next";
import {
  AlertTriangle,
  Banknote,
  BookOpen,
  CalendarClock,
  CircleCheck,
  Clock,
  Cloud,
  Compass,
  Cpu,
  Gauge,
  HardDrive,
  Heart,
  Home,
  KeyRound,
  Lock,
  MessagesSquare,
  Network,
  RefreshCw,
  ScrollText,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Wifi,
} from "lucide-react";
import { Badge, CodeBlock, InfoPanel, LinkButton, PageHeader, WarningPanel } from "@/components/ui";
import { NodeInfoChecker } from "@/components/node-info-checker";
import { RunNodeToc } from "@/components/run-node-toc";
import { sources } from "@/lib/sources";
import type { ComponentType, ReactNode, SVGProps } from "react";

export const metadata: Metadata = {
  title: "Run a node",
  description:
    "Provision, install, operate, diagnose, and harden a Hypersnap node — preflight, bootstrap, firewall, upgrades, hardening, health checks, and copy-paste templates.",
  alternates: {
    canonical: "/run-a-node",
  },
};

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

// ---- COMMANDS -----------------------------------------------------------

const PREFLIGHT_COMMAND = `lsb_release -a
nproc
free -h
lsblk -f
df -h
ip -brief addr`;

const INSTALL_COMMAND = `mkdir -p ~/hypersnap
cd ~/hypersnap
${sources.node.bootstrapCommand}`;

const TOOLKIT_INSTALL_COMMAND = `curl -fsSL https://hypersnap.org/install.sh | bash`;

const TOOLKIT_DOCTOR_COMMAND = `hypersnap doctor
hypersnap share`;

const CATCHUP_COMMAND = `cd ~/hypersnap
./hypersnap.sh logs
# In another terminal:
curl -s http://127.0.0.1:3381/v1/info | jq .`;

const CONFIRM_COMMAND = `cd ~/hypersnap
docker compose ps
curl -s http://127.0.0.1:3381/v1/info | jq '{version, peer_id, shardInfos: [.shardInfos[] | {shardId, maxHeight, blockDelay}]}'`;

const UPGRADE_COMMAND = `cd ~/hypersnap
./hypersnap.sh upgrade
docker compose ps
curl -s http://127.0.0.1:3381/v1/info | jq '.version'`;

const SSH_HARDENING_COMMAND = `# 1. Generate a key locally if you don't have one (run on your laptop)
ssh-keygen -t ed25519 -C "hypersnap-operator"

# 2. Copy it to the server
ssh-copy-id <user>@<server-ip>

# 3. On the server, disable password + root SSH
sudo sed -i \\
  -e 's/^#\\?PasswordAuthentication.*/PasswordAuthentication no/' \\
  -e 's/^#\\?PermitRootLogin.*/PermitRootLogin prohibit-password/' \\
  /etc/ssh/sshd_config
sudo systemctl reload ssh`;

const AUTO_UPDATES_COMMAND = `sudo apt update
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades`;

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

// ---- TROUBLESHOOTING ----------------------------------------------------

const TROUBLESHOOTING: Array<{ title: ReactNode; open?: boolean; body: ReactNode }> = [
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
        declaring the node dead. The endpoint usually wakes up within the first hour.
      </p>
    ),
  },
  {
    title: "Ports look closed from outside",
    body: (
      <p>
        Separate the layers: cloud firewall, host firewall (UFW), Docker port mapping, app
        readiness. If packets reach the server but the app returns RST, it&apos;s the app, not the
        firewall. <code>sudo ss -tulpen | grep 3381</code> on the host tells you whether the
        process is actually listening.
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
  {
    title: "blockDelay isn't going down",
    body: (
      <>
        <p>
          A few possibilities. Check them in order:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Is the node actually receiving peer traffic? <code>docker compose logs</code> should mention peers / gossip.</li>
          <li>Are the firewall rules letting peers in on UDP 3382?</li>
          <li>Is the server&apos;s clock synced? Drift breaks block validation. <code>timedatectl</code> should report active NTP.</li>
          <li>Is disk full or near full? <code>df -h</code>.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Node restarts in a loop",
    body: (
      <p>
        Read the logs from the latest exit:{" "}
        <code>docker compose logs --tail 200 hypersnap</code>. Look for the first error before the
        crash, not the last line. The most common causes are missing volumes, corrupted state from
        a hard kill mid-write, or a release version mismatch after a partial upgrade — try{" "}
        <code>./hypersnap.sh down &amp;&amp; ./hypersnap.sh upgrade</code>.
      </p>
    ),
  },
  {
    title: "Out of memory or OOM-kills",
    body: (
      <p>
        Hypersnap wants 16 GB of real RAM. If your VPS swap is doing the heavy lifting, sync will
        crawl and the kernel may OOM-kill the container. Check{" "}
        <code>dmesg | grep -i kill</code> and <code>free -h</code>. If you&apos;re close to the
        limit, resize the VPS rather than tuning Docker memory limits.
      </p>
    ),
  },
];

// ---- GLOSSARY -----------------------------------------------------------

const GLOSSARY: Array<{ term: string; definition: ReactNode }> = [
  {
    term: "Bootstrap",
    definition: "The one-command install that sets up Docker Compose, generates config, and starts the node. The right entry point for new operators.",
  },
  {
    term: "Snapshot",
    definition: "A pre-baked chunk of historical chain data the node downloads on first start so it doesn't have to replay everything from genesis.",
  },
  {
    term: "Sync / catch-up",
    definition: "The phase where the node imports the snapshot and then follows the latest peer activity until it's current. Usually a couple of hours on a fresh install.",
  },
  {
    term: "blockDelay",
    definition: "How far behind the live tip the node is, in blocks. Closer to zero = closer to synced. Healthy steady-state is roughly under 20.",
  },
  {
    term: "Shard",
    definition: "A horizontal partition of the network's data. Hypersnap runs across multiple shards; the node tracks them all.",
  },
  {
    term: "Peer / gossip",
    definition: "Other nodes your node talks to. They share new messages over a gossip protocol on UDP — that's why UDP 3382 needs to be open.",
  },
  {
    term: "FID",
    definition: "Farcaster ID. The numeric account identifier that owns posts, follows, and signed messages.",
  },
  {
    term: "Compose",
    definition: "Docker Compose, the multi-container orchestrator. The bootstrap script generates a docker-compose.yml that wraps the node, its config, and its persistent volumes.",
  },
  {
    term: "RocksDB",
    definition: "The embedded key-value store the node uses for local state. It lives under ~/hypersnap and is the main reason you need lots of disk.",
  },
  {
    term: "Stable / nightly channel",
    definition: "Stable is the released, tested build. Nightly is the latest commit on main. Run stable in production; use nightly only if you're testing.",
  },
];

// ---- LOCAL UI HELPERS ---------------------------------------------------

function GuideSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 py-16 first:pt-4 lg:py-20">
      <div className="mb-10 max-w-2xl">
        <Badge>{eyebrow}</Badge>
        <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-slate-400 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
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
  children: ReactNode;
}) {
  return (
    <li className="glass-panel rounded-2xl p-6 sm:p-7">
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
    <div className="glass-panel rounded-2xl p-5">
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
      className="group flex items-start gap-3 glass-panel rounded-2xl p-4 transition hover:border-cyan-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
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

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2 text-sm leading-6">
      <CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
      <span>{children}</span>
    </li>
  );
}

// ---- PAGE ---------------------------------------------------------------

export default function RunNodePage() {
  return (
    <>
      <PageHeader
        eyebrow="Operators"
        title="Run part of the network yourself."
        description="Every node makes the network a little more decentralized. This page walks through the whole loop — why it matters, what to expect, how to install, and how to keep it running. You don't have to be an expert; you do need a server you can keep online."
      />

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <WarningPanel>
          <p>
            <span className="font-semibold text-amber-200">Reality check:</span> the install script asks operators
            to acknowledge that the network has not released a token and running a node currently
            doesn&apos;t earn tokens. Future incentive chatter is not a promise. Don&apos;t treat
            this as guaranteed rewards.
          </p>
        </WarningPanel>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0">
            {/* WHY ----------------------------------------------------- */}
            <GuideSection
              id="why"
              eyebrow="Why run a node"
              title="It's the most direct way to make the network real."
              description="A decentralized network is decentralized only if many independent people run a piece of it. Today, that piece is you."
            >
              <div className="grid gap-5 md:grid-cols-3">
                <InfoPanel icon={Network} title="More nodes = more independence">
                  <p>
                    Every additional operator means the network depends a little less on any single
                    party staying online or staying friendly. That&apos;s the whole point.
                  </p>
                </InfoPanel>
                <InfoPanel icon={Compass} title="Learn the protocol from the inside">
                  <p>
                    Reading the docs is one thing. Watching catch-up logs scroll, querying{" "}
                    <code className="font-mono text-cyan-100">/v1/info</code>, debugging your own
                    peer connectivity — that&apos;s where the protocol becomes real.
                  </p>
                </InfoPanel>
                <InfoPanel icon={Sparkles} title="Be ready as it grows">
                  <p>
                    Operators who&apos;ve been running for a while will have set up monitoring,
                    upgrade habits, and a sense of what normal looks like. That&apos;s an
                    accumulated skill — start now and you&apos;ll be ahead later.
                  </p>
                </InfoPanel>
              </div>
            </GuideSection>

            {/* WHAT TO EXPECT ------------------------------------------ */}
            <GuideSection
              id="expect"
              eyebrow="What to expect"
              title="Cost, time, and effort, in concrete numbers."
              description="No magic, no hand-waving. Here's roughly what a beginner-grade node costs and how much attention it needs."
            >
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <InfoPanel icon={Banknote} title="Monthly cost">
                  <p>
                    A 4 vCPU / 16 GB VPS plus 1.5 TB block storage runs roughly{" "}
                    <span className="font-semibold text-white">$80–$110/month</span> at common
                    cloud providers. Spare home hardware can be free, with the trade-offs noted in
                    Provision.
                  </p>
                </InfoPanel>
                <InfoPanel icon={Clock} title="Initial sync">
                  <p>
                    Catch-up from snapshots usually takes a few hours over a healthy connection. The
                    HTTP endpoint may refuse connections during the first stretch — that&apos;s
                    normal.
                  </p>
                </InfoPanel>
                <InfoPanel icon={Wifi} title="Bandwidth">
                  <p>
                    Plan for low-hundreds of GB transferred during initial sync, then steady ongoing
                    peer traffic. A standard cloud monthly transfer allowance is fine.
                  </p>
                </InfoPanel>
                <InfoPanel icon={CalendarClock} title="Ongoing effort">
                  <p>
                    Once it&apos;s synced: glance at logs and disk a couple of times a week. Run an
                    upgrade every few weeks when releases ship. Total: minutes, not hours.
                  </p>
                </InfoPanel>
              </div>
              <p className="mt-6 text-xs leading-5 text-slate-400">
                Numbers are rough — your real cost depends on the provider and chain growth over
                time. They&apos;re here so you can plan, not to lock you into anyone&apos;s pricing.
              </p>
            </GuideSection>

            {/* PROVISION ----------------------------------------------- */}
            <GuideSection
              id="provision"
              eyebrow="Provision"
              title="Pick a machine that can stay online."
              description="An early node operator just needs a stable VPS. Home installs can work, but NAT, sleep modes, dynamic IPs, and port forwarding add a lot of moving parts — go that route only if you're comfortable troubleshooting them."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InfoPanel icon={Cloud} title="Cloud / VPS path (recommended)">
                  <ul className="space-y-2 text-sm leading-6">
                    <ChecklistItem>Ubuntu 24.04 LTS x64</ChecklistItem>
                    <ChecklistItem>4 vCPU / 16 GB RAM minimum</ChecklistItem>
                    <ChecklistItem>1.5 TB block storage minimum (1.6 TB gives breathing room)</ChecklistItem>
                    <ChecklistItem>Public IPv4 address</ChecklistItem>
                    <ChecklistItem>Cloud Firewall: SSH restricted, P2P / API ports open</ChecklistItem>
                  </ul>
                  <p className="mt-4 text-xs leading-5 text-slate-400">
                    Shared CPU works if budget matters. Dedicated CPU is more reliable for
                    long-running sync, but costs more.
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
            </GuideSection>

            {/* REQUIREMENTS -------------------------------------------- */}
            <GuideSection
              id="requirements"
              eyebrow="Requirements"
              title="What you'll actually need."
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
                    block delay approaches zero.
                  </p>
                </InfoPanel>
              </div>
            </GuideSection>

            {/* INSTALL ------------------------------------------------- */}
            <GuideSection
              id="install"
              eyebrow="Install"
              title="Three steps, in order."
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
                      You&apos;ll be asked to acknowledge there are no current token rewards.
                      That prompt is expected. {sources.node.noRewardsNotice}
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
            </GuideSection>

            {/* CONFIRM ------------------------------------------------- */}
            <GuideSection
              id="confirm"
              eyebrow="Confirm it's working"
              title="A short post-install checklist."
              description="Bootstrap finishes long before catch-up does. Use this checklist a few hours after starting to confirm the node is genuinely healthy and not just running."
            >
              <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="glass-panel rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white">Three things to check</h3>
                  <ul className="mt-4 space-y-3">
                    <ChecklistItem>
                      <span>
                        <span className="font-medium text-white">Container is up:</span>{" "}
                        <code className="font-mono text-cyan-100">docker compose ps</code> shows{" "}
                        <code className="font-mono text-cyan-100">hypersnap</code> with status{" "}
                        <code className="font-mono text-cyan-100">running</code>, not{" "}
                        <code className="font-mono text-cyan-100">restarting</code>.
                      </span>
                    </ChecklistItem>
                    <ChecklistItem>
                      <span>
                        <span className="font-medium text-white">/v1/info responds:</span> on the
                        host,{" "}
                        <code className="font-mono text-cyan-100">curl http://127.0.0.1:3381/v1/info</code>{" "}
                        returns JSON (not Connection refused).
                      </span>
                    </ChecklistItem>
                    <ChecklistItem>
                      <span>
                        <span className="font-medium text-white">blockDelay is decreasing:</span>{" "}
                        check it twice, fifteen minutes apart. The number should go down. If
                        it&apos;s flat, something is blocking peer traffic.
                      </span>
                    </ChecklistItem>
                  </ul>
                  <p className="mt-4 text-xs leading-5 text-slate-400">
                    Healthy steady-state is roughly blockDelay under 20. Anything between 20 and a
                    few thousand means catching up; bigger numbers mean either a fresh install or
                    something blocking the catch-up.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-cyan-100">
                    Quick health snapshot
                  </p>
                  <div className="mt-3">
                    <CodeBlock label="One-liner" command={CONFIRM_COMMAND} />
                  </div>
                </div>
              </div>
            </GuideSection>

            {/* FIREWALL ------------------------------------------------ */}
            <GuideSection
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
            </GuideSection>

            {/* OPERATIONS ---------------------------------------------- */}
            <GuideSection
              id="operations"
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
            </GuideSection>

            {/* UPGRADES ------------------------------------------------ */}
            <GuideSection
              id="upgrades"
              eyebrow="Upgrades"
              title="Stay on a recent build, without surprises."
              description="The protocol moves; nodes need to follow. The bundled script keeps upgrades simple."
            >
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <InfoPanel icon={RefreshCw} title="Use the stable channel">
                  <p>
                    Stable is what most operators should run. It&apos;s released, versioned, and
                    won&apos;t pull untested code. Nightly tracks the latest commit and is for
                    contributors testing changes — not for a production node.
                  </p>
                </InfoPanel>
                <InfoPanel icon={Settings} title="One-command upgrade">
                  <p>
                    The bundled script pulls the new image, restarts the container, and keeps the
                    same volumes (so your synced state survives the upgrade).
                  </p>
                </InfoPanel>
                <InfoPanel icon={CircleCheck} title="Verify after">
                  <p>
                    Confirm the new version landed and the node still answers{" "}
                    <code className="font-mono text-cyan-100">/v1/info</code>. If it doesn&apos;t,
                    check logs immediately — don&apos;t leave a partially-upgraded node running
                    overnight.
                  </p>
                </InfoPanel>
              </div>
              <div className="mt-6">
                <CodeBlock label="Upgrade and verify" command={UPGRADE_COMMAND} />
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-400">
                If an upgrade introduces a hard schema change, the node may need to re-sync from a
                fresh snapshot. Watch the release notes when bumping a major version.
              </p>
            </GuideSection>

            {/* HARDENING ----------------------------------------------- */}
            <GuideSection
              id="hardening"
              eyebrow="Hardening"
              title="Lock down the server itself."
              description="The node is one process on a Linux server, and the server is the bigger attack surface. These are the defaults you'd want anywhere — they take ten minutes."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InfoPanel icon={KeyRound} title="SSH: keys only, no root">
                  <p className="mb-4">
                    Disable password login. Disable direct root SSH. Use a key-only login for a
                    sudo-capable user.
                  </p>
                  <CodeBlock label="SSH hardening" command={SSH_HARDENING_COMMAND} />
                </InfoPanel>
                <InfoPanel icon={ShieldCheck} title="Automatic security updates">
                  <p className="mb-4">
                    Enable unattended security updates so OS patches land without you manually
                    running <code className="font-mono text-cyan-100">apt upgrade</code> on
                    schedule.
                  </p>
                  <CodeBlock label="Auto-updates" command={AUTO_UPDATES_COMMAND} />
                </InfoPanel>
              </div>
              <div className="mt-6 glass-panel rounded-2xl p-5 text-sm leading-7 text-slate-400">
                <p className="font-semibold text-white">Worth considering</p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <span className="font-medium text-white">Tailscale or WireGuard</span> for SSH.
                    Then your cloud firewall can lock TCP 22 to that private network only — even if
                    a key leaks, the surface is much smaller.
                  </li>
                  <li>
                    <span className="font-medium text-white">fail2ban</span> as a cheap layer
                    against brute-force scanners hitting public services.
                  </li>
                  <li>
                    <span className="font-medium text-white">Off-server log shipping</span> if you
                    care about post-mortem detail. Even a daily{" "}
                    <code className="font-mono text-cyan-100">journalctl</code> snapshot to a
                    second host is better than nothing.
                  </li>
                </ul>
              </div>
            </GuideSection>

            {/* DIAGNOSTICS --------------------------------------------- */}
            <GuideSection
              id="toolkit"
              eyebrow="Operator toolkit"
              title="Install the helper once, then stop debugging by screenshot."
              description="The open-source hypersnap command wraps the common operator checks into copy-pasteable diagnostics and sanitized support reports. It does not replace upstream; it makes upstream easier to run."
            >
              <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                <InfoPanel icon={Stethoscope} title="One command to diagnose">
                  <p className="mb-4">
                    Install the helper from this site, then run the doctor whenever a node is acting
                    weird. The report checks Docker, Compose, containers, ports, disk, memory,
                    logs, and the local info endpoint.
                  </p>
                  <CodeBlock label="Install helper" command={TOOLKIT_INSTALL_COMMAND} />
                </InfoPanel>
                <InfoPanel icon={ShieldCheck} title="Share a sanitized report">
                  <p className="mb-4">
                    <code className="font-mono text-cyan-100">hypersnap share</code> writes a local
                    report designed for GitHub issues, Discord, or Farcaster support threads. Review
                    it before posting publicly.
                  </p>
                  <CodeBlock label="Doctor + report" command={TOOLKIT_DOCTOR_COMMAND} />
                  <div className="mt-4 flex flex-wrap gap-3">
                    <LinkButton href="https://github.com/arcabotai/hypersnap" variant="secondary" external>
                      Toolkit source
                    </LinkButton>
                  </div>
                </InfoPanel>
              </div>
            </GuideSection>

            <GuideSection
              id="diagnostics"
              eyebrow="Diagnostics"
              title="Ask for terminal output, not screenshots."
              description="If the helper is not installed yet, this read-only fallback captures the state that explains 90% of failed installs: containers, logs, disk, ports, and the health endpoint."
            >
              <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <CodeBlock label="Read-only diagnostic" command={DIAGNOSTICS_COMMAND} />
                <NodeInfoChecker />
              </div>
            </GuideSection>

            {/* TROUBLESHOOTING ---------------------------------------- */}
            <GuideSection
              id="troubleshoot"
              eyebrow="Troubleshooting"
              title="Common failures, with what they actually mean."
            >
              <div className="grid gap-3">
                {TROUBLESHOOTING.map((item, index) => (
                  <details
                    className="group glass-panel rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden"
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
            </GuideSection>

            {/* HELPING ------------------------------------------------- */}
            <GuideSection
              id="helping"
              eyebrow="Helping a friend"
              title="Two messages worth keeping in your clipboard."
              description="When someone you know is stuck, send terminal output — not screenshots. These ask for the right thing and save a round-trip."
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
            </GuideSection>

            {/* GLOSSARY ------------------------------------------------ */}
            <GuideSection
              id="glossary"
              eyebrow="Glossary"
              title="Plain-English definitions for the words above."
              description="If you're new to running infrastructure, here's what a few of these terms actually mean."
            >
              <dl className="grid gap-4 md:grid-cols-2">
                {GLOSSARY.map((entry) => (
                  <div
                    key={entry.term}
                    className="glass-panel rounded-2xl p-4"
                  >
                    <dt className="text-sm font-semibold text-white">{entry.term}</dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-300">{entry.definition}</dd>
                  </div>
                ))}
              </dl>
            </GuideSection>

            {/* SOURCES ------------------------------------------------- */}
            <GuideSection
              id="sources"
              eyebrow="Sources"
              title="Grounded links and credit."
              description="Most of the operator content here is adapted from upstream. Check these before betting time or money."
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
                <SourceLink
                  href="https://github.com/arcabotai/hypersnap"
                  label="arcabotai/hypersnap"
                  sub="Operator toolkit: hypersnap doctor, share reports, and install helper"
                  icon={Stethoscope}
                />
                <SourceLink
                  href="/docs"
                  label="Hypersnap docs hub"
                  sub="Concepts, API reference, and AI-agent guides — mirrored on-site"
                  icon={BookOpen}
                />
                <SourceLink
                  href="/contribute"
                  label="Ways to contribute"
                  sub="Code, docs, design, ideas, running a node"
                  icon={Users}
                />
              </div>
              <div className="mt-6 glass-panel rounded-2xl p-5 text-sm leading-7 text-slate-400">
                <p>
                  Big chunks of this guide are adapted from{" "}
                  <span className="font-medium text-white">Arca&apos;s Hypersnap Node Starter Kit</span>
                  , an operator-friendly wrapper around the upstream bootstrap flow. Thanks to Arca
                  / Cad for the field notes.
                </p>
                <p className="mt-3 text-xs leading-5 text-slate-400">
                  This page wraps upstream — it doesn&apos;t replace it. Upstream docs are still
                  moving fast and mix Snapchain / Hypersnap language. When in doubt, run the linked
                  source.
                </p>
              </div>
            </GuideSection>

            {/* STILL STUCK --------------------------------------------- */}
            <section className="pb-16 pt-4">
              <div className="glass-panel rounded-2xl border-cyan-400/15 bg-cyan-400/[0.04] p-6 text-sm leading-7 text-slate-300">
                <p className="font-semibold text-white">Still stuck?</p>
                <p className="mt-2">
                  Open an issue on the upstream repo with the diagnostic output above pasted in —
                  every issue is public, and the more concrete output you share the faster someone
                  can help.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <LinkButton href="https://github.com/farcasterorg/hypersnap/issues" external>
                    Open an issue
                  </LinkButton>
                  <LinkButton href="/contribute" variant="secondary">
                    How to contribute
                  </LinkButton>
                  <LinkButton href="/docs" variant="secondary">
                    Read the docs
                  </LinkButton>
                </div>
              </div>
            </section>
          </div>
          <RunNodeToc />
        </div>
      </div>
    </>
  );
}
