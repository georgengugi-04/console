# Verification record

Measured on the final code. Environment: Linux sandbox, Node 22, headless Chromium (software-rendered WebGL via
SwiftShader), 2 CPU cores.

## Static checks
| Check | Result |
|---|---|
| `tsc --noEmit` (strict) | pass, 0 errors |
| `eslint .` (Next core-web-vitals + TypeScript + React-hooks/compiler rules) | pass, 0 errors, 0 warnings |
| `vitest run` | **87 / 87 tests**, 9 files |
| `next build` | success, 24 static pages generated |
| `npm audit --omit=dev` | 0 vulnerabilities (5 high in dev-only lint tooling) |

What the tests cover: Kenyan phone parsing (incl. the supplied invalid number), all Zod schemas, rate limiter
(window slide, per-key), abuse signals (honeypot, fill-time, origin, IP hashing), intro persistence (first visit,
cookie mirror, reset, head script, `?nointro`), transition eligibility (12 cases) and messages, explorer ranking and
catalogue honesty (Business hidden, no prices), the three API routes end-to-end (503 when unconfigured, delivered only
on webhook 2xx, 502 on webhook failure, dev store only outside production, 422/400/403/413/429), and the quote journey
as a component (blocking steps, preserved values, consent, honest failure, no duplicate submit on double-click).

## Browser journey — `npm run check:browser` — 37 / 37 checks
Intro shows once, Enter/Skip/Escape work, no replay on refresh/navigation, replay only from the footer; contextual
transition message appears; Back/Forward correct; rapid clicks settle on one route; 9 desktop pages return 200 with a
single `h1`; quote submit shows the honest "not connected" state in a production build; **no horizontal overflow at
390 px** on 8 pages; mobile menu (`aria-expanded`); reduced-motion gives immediate Enter and native navigation;
no console or network errors. WebGL canvas mounts on a capable-device profile.

## Lighthouse (mobile emulation, simulated throttling, production build)
| Page | Perf | A11y | Best-practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| / | 98 | 100 | 100 | 100 | 2.2 s | 0 | 140 ms |
| /about | 93 | 100 | 100 | 100 | 3.0 s | 0 | 120 ms |
| /products | 90 | 100 | 100 | 100 | 2.8 s | 0 | 280 ms |
| /products/motor | 80 | 100 | 100 | 100 | 3.7 s | 0 | 400 ms |
| /claims | 87 | 100 | 100 | 100 | 3.4 s | 0 | 270 ms |
| /resources | 94 | 100 | 100 | 100 | 2.7 s | 0 | 170 ms |
| /contact | 86 | 100 | 100 | 100 | 2.5 s | 0 | 460 ms |
| /quote | 87 | 100 | 100 | 100 | 2.0 s | 0 | 490 ms |

Issues found and fixed during verification: layout shift from font swap (0.169 → 0), non-descriptive "Learn more"
links, logo link accessible name, `/quote` rendered dynamically (now static), blocked-`eval` CSP issue from Zod's JIT,
mobile horizontal overflow on `/products` and `/contact`, the poster shield rendered in the wrong place, hero
composition, and a footer-intro Escape/close timing assumption in the test.

## Limits of this verification — please read
- **Lighthouse ran with ≤2 cores, so the hero was the static poster, not the 3D scene.** Real-device performance of the
  3D scene is *not measured*. With software WebGL the scene starved the main thread in this sandbox (clicks took >10 s);
  a real GPU should not, but verify on 2–3 mid-range Android phones.
- Scores come from simulated throttling on a shared sandbox and vary run to run by several points.
- No assistive-technology testing (screen reader) was done; accessibility claims rest on Lighthouse/axe-style checks,
  semantic structure, focus management and keyboard operation tested in the browser script.
- Safari/Firefox were not tested (Chromium only).
- Form delivery was tested against a mocked webhook, not a real receiver.
