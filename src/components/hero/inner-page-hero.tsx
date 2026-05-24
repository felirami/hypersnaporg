import { Badge, LinkButton } from "@/components/ui";

type InnerPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  accent?: "cyan" | "amber";
  actions?: Array<{ href: string; label: string; external?: boolean; variant?: "primary" | "secondary" }>;
  aside?: React.ReactNode;
};

export function InnerPageHero({
  eyebrow,
  title,
  description,
  accent = "cyan",
  actions,
  aside,
}: InnerPageHeroProps) {
  const glow =
    accent === "amber"
      ? "bg-[radial-gradient(ellipse_70%_50%_at_80%_0%,rgba(251,191,36,0.08),transparent_50%),radial-gradient(ellipse_50%_40%_at_10%_20%,rgba(56,189,248,0.06),transparent_40%)]"
      : "bg-[radial-gradient(ellipse_70%_50%_at_80%_0%,rgba(56,189,248,0.1),transparent_50%),radial-gradient(ellipse_50%_40%_at_10%_20%,rgba(139,92,246,0.06),transparent_40%)]";

  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
      <div className={`absolute inset-0 ${glow}`} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#030712_100%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-28">
        <div>
          <div className="fade-in-up">
            <Badge>{eyebrow}</Badge>
          </div>
          <h1
            className="fade-in-up mt-8 max-w-3xl text-balance text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em]"
            style={{ animationDelay: "0.08s" }}
          >
            <span className="text-gradient-hero">{title}</span>
          </h1>
          <p
            className="fade-in-up mt-6 max-w-xl text-pretty text-lg leading-8 text-slate-400"
            style={{ animationDelay: "0.16s" }}
          >
            {description}
          </p>
          {actions?.length ? (
            <div className="fade-in-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "0.24s" }}>
              {actions.map((action) => (
                <LinkButton
                  href={action.href}
                  key={action.href}
                  variant={action.variant ?? "primary"}
                  external={action.external}
                >
                  {action.label}
                </LinkButton>
              ))}
            </div>
          ) : null}
        </div>
        {aside ? (
          <div className="fade-in-up flex flex-col justify-center" style={{ animationDelay: "0.2s" }}>
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}
