const heroSignals = [
  { label: "Live node", value: "haatz.quilibrium.com", className: "right-10 top-16" },
  { label: "Source code", value: "github.com/farcasterorg", className: "right-36 top-56" },
  { label: "Sync cadence", value: "daily review PRs", className: "right-6 top-[24rem]" },
];

export function HeroSignalField() {
  return (
    <div aria-hidden="true" className="absolute inset-0 hidden overflow-hidden lg:block">
      {heroSignals.map((signal) => (
        <div
          className={`glass-panel absolute ${signal.className} rounded-xl px-4 py-3`}
          key={signal.label}
        >
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.14em] text-slate-500">
            {signal.label}
          </p>
          <p className="mt-1 font-mono text-sm text-cyan-100/90">{signal.value}</p>
        </div>
      ))}

      <div className="pulse-live absolute right-72 top-32 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.8)]" />
      <div className="pulse-live absolute right-20 top-[22rem] h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.7)] [animation-delay:0.8s]" />
      <div className="pulse-live absolute right-[28rem] top-80 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.7)] [animation-delay:1.4s]" />
    </div>
  );
}
