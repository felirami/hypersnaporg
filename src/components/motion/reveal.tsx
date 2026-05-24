"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// Reveal-on-scroll via IntersectionObserver. The hidden/transition styles live
// in globals.css behind `prefers-reduced-motion: no-preference`, so reduced-motion
// users (and the no-JS fallback path) always see content; JS only toggles
// `data-revealed` to trigger the transition.
function useInViewReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin: "-8% 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, revealed };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const { ref, revealed } = useInViewReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={className}
      data-reveal=""
      data-revealed={revealed ? "" : undefined}
      style={{ "--reveal-y": `${y}px`, "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, revealed } = useInViewReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={className} data-stagger="" data-revealed={revealed ? "" : undefined}>
      {children}
    </div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={["stagger-item", className].filter(Boolean).join(" ")}>{children}</div>;
}
