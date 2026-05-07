"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyCommand({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-cyan-300/50 hover:text-white"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
      title="Copy command"
      type="button"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-200" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">Copy command</span>
    </button>
  );
}
