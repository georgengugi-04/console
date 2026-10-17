# Handover — what CONSOLE still needs to provide or decide

The site was built so that **nothing unconfirmed is presented as fact**. These are the open items, most important first.

## Blocks launch
| # | Item | Why / what happens today |
|---|---|---|
| 1 | **Enquiry receiver** (`SUBMISSION_WEBHOOK_URL`) | Without it the forms answer "online enquiries aren't connected yet" and point visitors to email. No enquiry reaches CONSOLE. See `DEPLOYMENT.md`. |
| 2 | **Correct phone number** | Supplied "+254 12701222" is a digit short. Shown as text, not a tap-to-call link. Update `content/company.ts` and set `status: "supplied"`. |
| 3 | **Licence / regulatory details** | Not supplied. Footer shows a clearly labelled placeholder. Insurance agencies are normally expected to display this. |
| 4 | **Privacy notice sign-off** | `/privacy` is a draft describing exactly what this site does. Needs approval from CONSOLE and a legal adviser, plus data-protection registration details if applicable, and a confirmed retention period (180 days is a proposal). |
| 5 | **Production domain** | Set `NEXT_PUBLIC_SITE_URL`; the example value is a placeholder. |

## Confirm before publishing
- **Email address** `mainamalcolm@consoleinsurance.com` — founder is Malcolm *Njoroge*; is "Maina" a middle name, or the wrong address?
- **Is Business insurance offered?** It was requested in the brief but is in no source file, so it is switched off (`available: false` in `content/products.ts`). Flip the flag to show it everywhere (explorer, quote form, server schema need `business` added to `productChoices` in `lib/validation.ts` as well).
- **Is Life insurance offered?** Treated as yes because the legacy copy names it.
- **Underwriters / insurer partners** — none named anywhere; add if CONSOLE wants them shown.
- **Response-time promise** — the "what happens next" lists say a team member will contact the visitor; they give **no timeframe**. Add one only if the team will honour it.
- **Opening hours, social profiles, exact street address** — omitted. A map pin needs a confirmed location.

## Content to replace
- **Founder photograph** — currently a labelled placeholder silhouette. The bio uses only the supplied facts
  (BCom, Dedan Kimathi University of Technology, 2020; short insurance course 2024; with Old Mutual since 2025). No titles,
  certifications or achievements were added. The site does **not** claim CONSOLE is affiliated with Old Mutual.
- **Resources** — six explainers, all labelled **Draft** in the UI. They are general, non-authoritative, and make no
  legal or regulatory claims. Replace or review them, then set `status: "reviewed"` in `content/resources.ts`.
- **Claims page** — gives general "what to have ready" guidance and an enquiry form only. Add CONSOLE's real process,
  documents and contacts when confirmed. There is deliberately no claim tracker.
- **Product copy** — definitional only: no prices, limits, benefits or insurer names (none supplied).

## Technical follow-ups (not blockers)
- Add a global rate limit (Redis/Upstash) and optionally a CAPTCHA if the forms are targeted — `DEPLOYMENT.md`.
- Strict nonce-based CSP if required by a security review — `DEPLOYMENT.md`.
- Fonts are the Latin subset; add the `latin-ext` files if non-Latin text is ever needed.
- **ReactBits**: the interactive patterns (split-text reveal, magnetic buttons, spotlight/tilt cards, scroll reveals) were
  reimplemented with Motion in the project's own style. No ReactBits source code was copied. A secondary source describes
  its licence as "MIT + Commons Clause"; I could not open reactbits.dev from the build environment to confirm. If you later
  copy actual components, check the licence on their site first.
- `npm audit` reports 5 high findings, all in the **dev-only lint toolchain** (`braces` via `eslint-config-next`); production
  dependencies have 0 findings.
- Test the 3D hero on a few real phones. It was verified in a real browser, but only with software rendering (see `VERIFICATION.md`).
