export const SNAP_TOTAL_SUPPLY = 200_000_000_000;
export const SNAP_RETRO_ALLOCATION = 200_000_000;
export const SNAP_PHASE_ONE_OPENED = 33_000_000;

const DEFAULT_DEXSCREENER_API_URL =
  "https://api.dexscreener.com/latest/dex/pairs/ethereum/0x72a70a747a8390caf1aad3fb1de3564b55871f137539e498d30f02b1167742ea";

export const SNAP = {
  symbol: "SNAP",
  name: "Hypersnap",
  chain: "Ethereum",
  contract: "0x49B5a631F54927c0007232844f06FE18cbf69786",
  pairAddress: "0x72a70a747a8390caf1aad3fb1de3564b55871f137539e498d30f02b1167742ea",
  claimUrl: "https://hypria.app",
  dexscreenerUrl:
    "https://dexscreener.com/ethereum/0x72a70a747a8390caf1aad3fb1de3564b55871f137539e498d30f02b1167742ea",
  dexscreenerApiUrl: process.env.DEXSCREENER_PAIR_URL || DEFAULT_DEXSCREENER_API_URL,
  discussions: [
    {
      label: "FIP-19: Proof-of-Work Tokenomics",
      href: "https://github.com/orgs/farcasterorg/discussions/19",
      description: "Protocol discussion for contribution-weighted rewards and anti-sybil mechanics.",
    },
    {
      label: "FIP-21: Snap Compute",
      href: "https://github.com/orgs/farcasterorg/discussions/21",
      description: "Compute layer discussion referenced by the tokenomics rollout work.",
    },
    {
      label: "Hypersnap PR #13",
      href: "https://github.com/farcasterorg/hypersnap/pull/13",
      description: "Public implementation/spec PR linking tokenomics docs to the protocol work.",
    },
  ],
} as const;

export function correctedSnapFdv(priceUsd: number) {
  return priceUsd * SNAP_TOTAL_SUPPLY;
}
