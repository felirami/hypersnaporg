## Security Fix: Add Explicit Timeouts to External Fetch Calls

**Context:** The journal `.jules/sentinel.md` specifically notes a rule for `fetch` calls:
"Security/Code Convention: All external `fetch` calls must include an explicit timeout (e.g., using `signal: AbortSignal.timeout(TIMEOUT_MS)`) to prevent server resource exhaustion and hanging requests, as the native fetch API lacks a default timeout."

**Vulnerability:**
1. `src/lib/network.ts`: `getNetworkStatus()` uses `fetch(INFO_ENDPOINT, ...)` but lacks a `signal` with a timeout. (Note: `checkNodeHealth()` correctly uses `signal: AbortSignal.timeout(NODE_PROBE_TIMEOUT_MS)`).
2. `src/lib/snap-market.ts`: `getSnapMarketData()` uses `fetch(SNAP.dexscreenerApiUrl, ...)` but lacks a `signal` with a timeout.

**Fix:**
I will add timeouts to all missing `fetch` calls.

**Plan:**
1. Modify `src/lib/network.ts` to add `signal: AbortSignal.timeout(NODE_PROBE_TIMEOUT_MS)` to the `getNetworkStatus` fetch call.
2. Modify `src/lib/snap-market.ts` to define a timeout (e.g., `const MARKET_PROBE_TIMEOUT_MS = 10_000;`) and add `signal: AbortSignal.timeout(MARKET_PROBE_TIMEOUT_MS)` to the `getSnapMarketData` fetch call.
3. Verify the fix using `pnpm lint` and `pnpm typecheck` or similar commands according to `package.json`.
4. Pre-commit check.
