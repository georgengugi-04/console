# Architecture

## Layout

```
src/
  app/            routes, metadata, sitemap/robots, OG image, global design tokens (globals.css)
  components/
    brand/        Logo (SVG symbol + wordmark; compact variant for mobile/favicon)
    intro/        IntroGate — one-time cinematic introduction
    transition/   TransitionProvider — branded page transitions for the App Router
    three/        HeroVisual (capability gate + poster) → HeroScene (R3F scene, lazy-loaded)
    motion/       SplitText, Reveal, Magnetic, SpotlightCard, TiltCard, shared easing/duration tokens
    sections/     page sections (Hero, ProtectionStory, Explorer, FounderSection, ResourceBrowser, …)
    forms/        QuoteForm, ContactForm, ClaimForm, Field, SubmitResult, useSubmit
    layout/       Header (+ mobile sheet), Footer
    ui/           Button, Placeholder, PhoneText
  content/        company (business facts + their status), products, founder, resources, site (nav, transition copy)
  lib/            validation (Zod, shared client+server), phone, abuse, rateLimit, deliver, handleSubmission,
                  introStore, transitionEligibility, explorer
tests/            Vitest suites
scripts/          browser-check.mjs, purge-submissions.mjs
```

## Single source of truth for facts

`src/content/company.ts` holds every business fact with a `status` (`supplied` / `needs-confirmation`) and a
`notSupplied` list. The UI renders only what is present, so an unsupplied fact (licence number, opening hours,
social profiles…) cannot appear by accident. `products.ts` has an `available` flag: **Business insurance is
`false`** (requested in the brief, absent from the supplied files) and is filtered out of every list, the explorer,
the quote form and the server schema.

## One-time introduction (`components/intro`, `lib/introStore.ts`)

- Eligible = no `console.intro.v1` in localStorage and no `console_intro=1` cookie. Seen is recorded when the
  intro is **displayed**, so refresh or quick navigation never replays it.
- A tiny inline `<head>` script sets `data-intro="pending"` before first paint (no flash for returning visitors).
- If storage is unavailable the intro is **skipped** rather than risk replaying on every page.
- `role="dialog"`, page content made `inert`, focus trapped between *Skip* and *Enter*, Escape skips,
  `?nointro=1` bypasses, reduced motion shows the final state immediately.
- Replay only on explicit request (footer button → clears the flag).

## Page transitions (`components/transition`, `lib/transitionEligibility.ts`)

The App Router has no router events, so one capture-phase click listener decides whether a click is a genuine
internal navigation (same origin, different route, primary click, no modifiers, no `download`/`_blank`/
`rel=external`, not `mailto:`/`tel:`/in-page anchor/file). It covers the screen with the contextual message,
calls `router.push`, and reveals when `usePathname()` changes (3 s failsafe; Escape dismisses). Back/Forward are
never intercepted. A re-entrancy guard ignores rapid repeat clicks. Reduced motion → native navigation, no overlay.
Messages live in `content/site.ts` (longest-prefix match).

## 3D hero (`components/three`)

- `HeroVisual` chooses between the scene and a static SVG poster using `useSyncExternalStore`: WebGL support,
  `saveData`, ≤2 CPU cores or ≤2 GB memory → poster. The poster is also what the server renders.
- `HeroScene` is a dynamic import (`ssr:false`): extruded bevelled shield with the swoosh, instanced pillar ring
  (the protective boundary), four orbiting objects (house, car, person, health cross), procedural lighting via
  `Lightformer` (no HDR download), cheap additive glow instead of a bloom pass.
- Pauses when scrolled off-screen, DPR capped (1.5 desktop / 1.25 mobile), pointer parallax only for mouse/pen,
  `frameloop="demand"` for reduced motion, geometry disposed on unmount, context loss → poster.
- Not used (deliberately): post-processing bloom and ambient occlusion — a pass each on every frame is a poor
  trade for the low-power Android phones this audience is likely to use.

## Forms and server pipeline (`lib/handleSubmission.ts`)

same-origin check → body-size cap → per-client rate limit (5 / 10 min, salted IP hash) → JSON parse →
Zod validation (the **same** schemas as the browser) → bot signals (honeypot, fill-time 2.5 s–24 h) →
delivery. Personal data is never logged. Kenyan numbers are normalised to `+254…` (mobile 07xx/01xx, landlines).

Delivery (`lib/deliver.ts`) is honest by construction:

1. `SUBMISSION_WEBHOOK_URL` set → POST; success is reported **only** on a 2xx answer.
2. else, outside production and only if `ALLOW_LOCAL_SUBMISSION_STORE=true` → local JSONL, reported as
   "development mode" (the UI says nothing was sent to CONSOLE).
3. else → HTTP 503 `not_configured`; the UI says enquiries aren't connected and offers email.

There is no path that shows "thank you" without a real delivery.
