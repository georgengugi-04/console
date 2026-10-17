# CONSOLE INSURANCE — website

A from-scratch Next.js build of the CONSOLE INSURANCE site: custom 3D shield hero, one-time brand intro,
branded page transitions, a guided insurance explorer, quote / contact / claims-enquiry flows with real
validation and honest submission states, a founder profile, and a resources section.

> **Read `docs/HANDOVER.md` first.** It lists what the company still has to confirm before launch
> (phone number, licence details, underwriters, founder photo, …). Nothing in the site invents those facts.

## Stack (pinned, verified to install and build together)

| Area | Package | Version |
|---|---|---|
| Framework | next (App Router, Turbopack) | 16.4.2 |
| UI | react / react-dom | 19.3.1 |
| Language | typescript (strict) | 5.9.3 |
| Styling | tailwindcss + @tailwindcss/postcss (design tokens in `src/app/globals.css`) | 4.3.3 |
| 3D | three · @react-three/fiber · @react-three/drei | 0.186.1 · 9.8.2 · 10.7.9 |
| Motion | motion (Motion.dev) | 14.3.0 |
| Vector animation | @lottiefiles/dotlottie-react (self-hosted wasm) | 0.20.0 |
| Forms | react-hook-form · @hookform/resolvers · zod | 7.90.0 · 5.9.1 · 4.6.7 |
| Icons | lucide-react | 1.58.0 |
| Tests | vitest · @testing-library/* · jsdom | 5.0.5 |
| Browser check | playwright-core | 1.64.1 |

Fonts (Unbounded + Manrope, Latin subset) are self-hosted via `next/font/local` — no third-party requests.

## Run it

```bash
npm install
cp .env.example .env.local        # fill in values — see docs/DEPLOYMENT.md
npm run dev                       # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run verify` | typecheck → lint → unit/component tests → production build |
| `npm test` | 87 tests (validation, phone, rate limit, abuse signals, intro persistence, transition rules, explorer, API routes, quote journey) |
| `npm run check:browser` | Playwright journey against a running production build (needs `CHROMIUM_PATH`) |
| `npm run purge:dev-store` | applies the retention window to the local dev enquiry file |

Skip the intro while developing with `?nointro=1`.

## Pages

`/` · `/about` · `/products` · `/products/[life|health|motor|property]` · `/quote` · `/claims` ·
`/resources` · `/resources/[slug]` · `/contact` · `/privacy` · API: `/api/quote`, `/api/contact`, `/api/claims`.

## More

- `docs/ARCHITECTURE.md` — structure, the intro/transition/3D design decisions, form pipeline
- `docs/DEPLOYMENT.md` — environment variables, hosting, security headers, rate-limit caveats
- `docs/CONTENT-AUDIT.md` — what `koo.zip` contained, what was reused, what was not
- `docs/HANDOVER.md` — decisions and information still needed from CONSOLE
- `docs/VERIFICATION.md` — the measured results (tests, browser checks, Lighthouse) and their limits
