"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Eraser, Search } from "lucide-react";

type Tone = "good" | "warn" | "bad" | "idle";

type Classification = {
  tone: Tone;
  text: string;
};

function deepFind(value: unknown, names: string[], found: Record<string, unknown> = {}) {
  if (!value || typeof value !== "object") return found;
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const normal = key.toLowerCase();
    if (names.includes(normal) && found[normal] === undefined) {
      found[normal] = child;
    }
    if (child && typeof child === "object") {
      deepFind(child, names, found);
    }
  }
  return found;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string" && value.trim() !== "") {
    const cleaned = value.replace(/[, _]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function classifyInfo(raw: string): Classification {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown parse error.";
    return {
      tone: "bad",
      text: `Couldn't parse JSON: ${message}. Paste raw JSON from /v1/info — not a screenshot or shell prompt.`,
    };
  }

  const found = deepFind(parsed, [
    "blockdelay",
    "maxheight",
    "height",
    "numshards",
    "version",
    "peerid",
    "shardid",
  ]);
  const blockDelay = asNumber(found.blockdelay);
  const maxHeight = asNumber(found.maxheight);
  const height = asNumber(found.height);
  const version = found.version ? String(found.version) : undefined;

  const bits: string[] = [];
  if (version) bits.push(`version: ${version}`);
  if (maxHeight !== undefined) bits.push(`maxHeight: ${maxHeight.toLocaleString()}`);
  if (height !== undefined) bits.push(`height: ${height.toLocaleString()}`);
  if (blockDelay !== undefined) bits.push(`blockDelay: ${blockDelay.toLocaleString()}`);

  if (blockDelay !== undefined) {
    if (blockDelay <= 20) {
      return {
        tone: "good",
        text: `Looks close to synced. ${bits.join(" · ")}`,
      };
    }
    if (blockDelay <= 5000) {
      return {
        tone: "warn",
        text: `Catching up. Watch blockDelay decrease toward zero. ${bits.join(" · ")}`,
      };
    }
    return {
      tone: "warn",
      text: `Far behind or still importing snapshot. Keep watching logs and confirm disk has space. ${bits.join(" · ")}`,
    };
  }

  if (bits.length) {
    return {
      tone: "warn",
      text: `Parsed JSON, but didn't find blockDelay. Useful fields found: ${bits.join(" · ")}`,
    };
  }

  return {
    tone: "warn",
    text: "Parsed JSON, but didn't recognize the usual /v1/info fields. The upstream schema may have changed.",
  };
}

const TONE_STYLES: Record<Tone, { wrapper: string; label: string }> = {
  good: {
    wrapper: "border-emerald-300/30 bg-emerald-300/[0.08] text-emerald-50",
    label: "border-emerald-300/40 bg-emerald-300/15 text-emerald-100",
  },
  warn: {
    wrapper: "border-amber-300/30 bg-amber-300/[0.07] text-amber-50",
    label: "border-amber-300/40 bg-amber-300/15 text-amber-100",
  },
  bad: {
    wrapper: "border-rose-300/30 bg-rose-300/[0.06] text-rose-100",
    label: "border-rose-300/40 bg-rose-300/15 text-rose-100",
  },
  idle: {
    wrapper: "border-white/10 bg-white/[0.04] text-slate-300",
    label: "border-white/12 bg-white/[0.06] text-slate-200",
  },
};

const TONE_LABEL: Record<Tone, string> = {
  good: "Looks healthy",
  warn: "Watch closely",
  bad: "Couldn't read it",
  idle: "Idle",
};

export function NodeInfoChecker() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Classification>({
    tone: "idle",
    text: "Paste JSON from /v1/info above and hit Analyze. Nothing leaves your browser.",
  });

  const styles = TONE_STYLES[result.tone];

  return (
    <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.04] p-5">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Paste /v1/info, get a sanity check</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Quick local classifier for the node info JSON. Nothing is uploaded — it runs in your
            browser.
          </p>
        </div>
        <label className="block text-xs font-medium uppercase tracking-[0.12em] text-cyan-100" htmlFor="node-info-input">
          /v1/info JSON
        </label>
        <textarea
          aria-label="Paste /v1/info JSON"
          className="min-h-32 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 font-mono text-sm leading-6 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          id="node-info-input"
          onChange={(event) => setValue(event.target.value)}
          placeholder='Paste the output of: curl -s http://127.0.0.1:3381/v1/info | jq .'
          spellCheck={false}
          value={value}
        />
        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100"
            onClick={() => {
              const trimmed = value.trim();
              if (!trimmed) {
                setResult({
                  tone: "warn",
                  text: "Paste the JSON output first, then hit Analyze.",
                });
                return;
              }
              setResult(classifyInfo(trimmed));
            }}
            type="button"
          >
            <Search aria-hidden="true" className="h-4 w-4" />
            Analyze
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            onClick={() => {
              setValue("");
              setResult({
                tone: "idle",
                text: "Paste JSON from /v1/info above and hit Analyze. Nothing leaves your browser.",
              });
            }}
            type="button"
          >
            <Eraser aria-hidden="true" className="h-4 w-4" />
            Clear
          </button>
        </div>
        <div
          aria-live="polite"
          className={`rounded-md border px-4 py-3 text-sm leading-6 ${styles.wrapper}`}
          role="status"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] ${styles.label}`}
            >
              {result.tone === "good" ? (
                <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
              ) : result.tone === "bad" ? (
                <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
              ) : null}
              {TONE_LABEL[result.tone]}
            </span>
          </div>
          <p className="mt-2 text-sm text-current">{result.text}</p>
        </div>
      </div>
    </div>
  );
}
