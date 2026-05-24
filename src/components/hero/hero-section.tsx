import { HeroBackground } from "@/components/hero-background";
import { Badge, LinkButton } from "@/components/ui";

const heroStats = [
  { label: "Protocol", value: "Farcaster-compatible" },
  { label: "Governance", value: "Community-owned" },
  { label: "Status", value: "Live on mainnet" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
      <HeroBackground />

      <div className="relative mx-auto flex min-h-[88svh] w-full max-w-6xl flex-col justify-center px-6 py-24 sm:px-8 sm:py-28 lg:min-h-[92svh] lg:px-10 lg:py-32">
        <div className="fade-in-up">
          <Badge>Decentralized protocol · Open source · No single owner</Badge>
        </div>

        <h1
          className="fade-in-up mt-10 max-w-4xl text-balance text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.03em]"
          style={{ animationDelay: "0.08s" }}
        >
          <span className="text-gradient-hero">Hypersnap</span>
        </h1>

        <p
          className="fade-in-up mt-8 max-w-2xl text-pretty text-xl font-medium leading-snug text-white/90 sm:text-2xl sm:leading-tight"
          style={{ animationDelay: "0.16s" }}
        >
          A decentralized social network — actually decentralized.
        </p>

        <p
          className="fade-in-up mt-6 max-w-xl text-pretty text-base leading-7 text-slate-400 sm:text-lg sm:leading-8"
          style={{ animationDelay: "0.24s" }}
        >
          The evolution of Farcaster. Same posts, follows, and identities — but every node is run
          by someone different, anywhere in the world.
        </p>

        <div
          className="fade-in-up mt-12 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "0.32s" }}
        >
          <LinkButton href="/about">What is Hypersnap?</LinkButton>
          <LinkButton href="/run-a-node" variant="secondary">
            Run a node
          </LinkButton>
          <LinkButton href="/contribute" variant="secondary">
            Help build it
          </LinkButton>
        </div>

        <div
          className="fade-in-up mt-20 flex flex-wrap gap-8 border-t border-white/[0.06] pt-10"
          style={{ animationDelay: "0.4s" }}
        >
          {heroStats.map((item) => (
            <div key={item.label} className="min-w-[8rem]">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-1.5 font-mono text-sm text-cyan-100/90">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="scroll-bob flex flex-col items-center gap-2 text-slate-500">
          <span className="text-[0.6rem] uppercase tracking-[0.2em]">Scroll</span>
          <span className="h-8 w-px bg-gradient-to-b from-cyan-400/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
