"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

export function CopyCommand({ value }: { value: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const copied = status === "copied";
  const failed = status === "failed";
  const statusMessage = copied ? "Command copied" : failed ? "Copy failed" : "Copy command";

  return (
    <button
      aria-label={statusMessage}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-cyan-300/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
      onClick={async () => {
        if (resetTimer.current) {
          window.clearTimeout(resetTimer.current);
        }

        try {
          await navigator.clipboard.writeText(value);
          setStatus("copied");
        } catch {
          setStatus("failed");
        }

        resetTimer.current = window.setTimeout(() => setStatus("idle"), 1600);
      }}
      title="Copy command"
      type="button"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-200" aria-hidden="true" />
      ) : (
        <Copy className={failed ? "h-4 w-4 text-rose-200" : "h-4 w-4"} aria-hidden="true" />
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </span>
    </button>
  );
}
