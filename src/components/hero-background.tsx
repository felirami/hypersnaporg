"use client";

import { NetworkMeshCanvas } from "@/components/shader/network-mesh-canvas";
import { HeroSignalField } from "@/components/hero-signal-field";

export function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[#030712]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(56,189,248,0.08),transparent_50%),radial-gradient(ellipse_60%_50%_at_20%_80%,rgba(139,92,246,0.06),transparent_50%)]"
      />
      <NetworkMeshCanvas />
      <HeroSignalField />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.97)_0%,rgba(3,7,18,0.88)_45%,rgba(3,7,18,0.25)_100%),linear-gradient(180deg,transparent_0%,#030712_100%)]" />
    </>
  );
}
