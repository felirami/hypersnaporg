"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ScrollHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-500",
        scrolled
          ? "border-white/[0.08] bg-[#030712]/80 shadow-[0_1px_0_rgba(56,189,248,0.08)] backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      {children}
    </header>
  );
}
