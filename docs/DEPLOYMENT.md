# Deployment

## Requirements
Node ≥ 20.9. Works on any Node host (Vercel, a VPS/container with `next start`, etc.).

## Environment variables (`.env.example` has the template — it contains no secrets)

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin (metadata, sitemap, OG image URLs). **The example value is a placeholder.** |
| `SUBMISSION_WEBHOOK_URL` | **yes in production** | Where validated enquiries are POSTed as JSON `{ reference, type, receivedAt, data }`. Without it the API answers 503 and the site says online enquiries aren't connected. |
| `SUBMISSION_WEBHOOK_TOKEN` | recommended | Sent as `Authorization: Bearer …` |
| `IP_HASH_SALT` | yes | Long random string; IPs are HMAC-hashed with it before use as rate-limit keys / in logs |
| `ALLOW_LOCAL_SUBMISSION_STORE` | no | `true` only on a private staging server; ignored in production |
| `SUBMISSION_RETENTION_DAYS` | no | Shown on the privacy page (default 180); `npm run purge:dev-store` applies it to the local dev file |

**What must be connected before launch:** a receiver for `SUBMISSION_WEBHOOK_URL` (CRM, n8n/Make/Zapier flow,
or a small mail relay). Until then no enquiry reaches the company.

## Build & run
```bash
npm ci
npm run verify
npm start            # or deploy to your host
```

## Security headers
Set in `next.config.ts`: CSP (`default-src 'self'`, no `eval`, `frame-ancestors 'none'`, `object-src 'none'`),
HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP. The CSP allows
`'unsafe-inline'` scripts because Next.js's hydration bootstrap and the tiny intro flag script are inline. If your
security review requires a strict nonce-based CSP, move the policy into a `proxy.ts` that issues a per-request
nonce (note: that makes pages dynamically rendered). Zod runs with `jitless: true` so the no-`eval` policy holds.

## Rate limiting
`lib/rateLimit.ts` is an in-process sliding window — correct for one Node process. On serverless/multi-instance
hosting each instance counts separately, so limits are per-instance. For a global limit swap the `Map` for
Redis/Upstash (the interface is two lines). Add edge rate-limiting / a CAPTCHA (e.g. Cloudflare Turnstile) if the
forms attract abuse; the honeypot and fill-time checks only stop naive bots.

## Data retention
The app stores nothing itself in production — enquiries are forwarded to the webhook receiver. Retention of
forwarded data is therefore governed by that system. The privacy page states a 180-day default; **that is a
proposal the company must confirm and then enforce in the receiving system.**

## Domain / SEO
Set `NEXT_PUBLIC_SITE_URL`, deploy, then submit `/sitemap.xml`. `robots.txt` and the sitemap are generated.
Structured data (`InsuranceAgency`) contains only supplied facts and deliberately omits the phone number.
