## 2025-06-03 - Next.js Security Headers Enhancement
**Vulnerability:** Missing default HTTP security headers.
**Learning:** Next.js doesn't enforce strict security headers (like X-Frame-Options, Strict-Transport-Security, Permissions-Policy) by default in next.config.ts, which can leave applications exposed to clickjacking and MIME-type sniffing.
**Prevention:** Always define an async headers() block in next.config.ts applying standard security headers to all routes `/(.*)`.

## 2025-06-04 - Markdown Sanitization Before Injection
**Vulnerability:** XSS risk due to `dangerouslySetInnerHTML` injecting unsanitized HTML parsed from external Markdown.
**Learning:** In a static generation context (like `scripts/sync-sources.mjs` converting Markdown to HTML), any missing sanitization step can lead to cross-site scripting when that HTML is blindly injected via `dangerouslySetInnerHTML` in React components (`src/app/docs/[...slug]/page.tsx`).
**Prevention:** Always include a robust HTML sanitizer (e.g., `rehype-sanitize`) in the Markdown-to-HTML processing pipeline before generating files or databases consumed by React components.

## 2025-06-05 - JSON-LD Script Injection
**Vulnerability:** XSS risk via unsanitized `<` characters in `JSON.stringify` output injected into `<script type="application/ld+json">`.
**Learning:** `JSON.stringify()` does not automatically escape `<` as `\u003c`. If dynamic or unsanitized content is serialized into a `<script>` tag via `dangerouslySetInnerHTML`, an attacker can include `</script>` to break out of the context and inject malicious scripts.
**Prevention:** Always replace `<` with `\u003c` when injecting JSON output into script tags, e.g., `JSON.stringify(data).replace(/</g, '\\u003c')`.

## 2025-06-06 - Missing Fetch Timeouts
**Vulnerability:** Resource exhaustion risk due to missing timeouts in external API `fetch` calls.
**Learning:** The native `fetch` API does not have a default timeout. If an external API hangs or takes a long time to respond, it can tie up server resources, potentially leading to a Denial of Service (DoS) condition, especially in Server-Side Rendered (SSR) contexts like Next.js or background synchronization scripts.
**Prevention:** Always use `AbortSignal.timeout(TIMEOUT_MS)` in the `signal` option of `fetch` calls to ensure requests fail securely after a reasonable duration rather than hanging indefinitely.
