"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Badge, LinkButton } from "@/components/ui";

const ease = [0.22, 1, 0.36, 1] as const;

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
  const reduceMotion = useReducedMotion();
  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease },
        };

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
          <motion.div {...fade(0)}>
            <Badge>{eyebrow}</Badge>
          </motion.div>
          <motion.h1
            className="mt-8 max-w-3xl text-balance text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em]"
            {...fade(0.08)}
          >
            <span className="text-gradient-hero">{title}</span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-pretty text-lg leading-8 text-slate-400"
            {...fade(0.16)}
          >
            {description}
          </motion.p>
          {actions?.length ? (
            <motion.div className="mt-10 flex flex-wrap gap-3" {...fade(0.24)}>
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
            </motion.div>
          ) : null}
        </div>
        {aside ? (
          <motion.div className="flex flex-col justify-center" {...fade(0.2)}>
            {aside}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
