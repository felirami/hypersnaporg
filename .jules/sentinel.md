## 2025-06-03 - Next.js Security Headers Enhancement
**Vulnerability:** Missing default HTTP security headers.
**Learning:** Next.js doesn't enforce strict security headers (like X-Frame-Options, Strict-Transport-Security, Permissions-Policy) by default in next.config.ts, which can leave applications exposed to clickjacking and MIME-type sniffing.
**Prevention:** Always define an async headers() block in next.config.ts applying standard security headers to all routes `/(.*)`.
