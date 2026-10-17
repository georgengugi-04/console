# Design system — colour and theming

Forest green, warm ivory, soft charcoal, muted stone, restrained sage. One semantic token set in
`src/app/globals.css` (`@theme static`), dark overrides under `:root[data-theme="dark"]`. Tailwind's default
palette is switched off (`--color-*: initial`), so a stray `bg-blue-500` produces nothing — and
`tests/designSystem.test.ts` fails the build if legacy blue tokens/hexes come back.

| Token (class) | Light | Dark |
|---|---|---|
| page `bg-page` | #F7F6F2 | #141B18 |
| surface `bg-surface` | #FFFFFF | #1C2520 |
| sunken `bg-sunken` | #EFEEE8 | #101613 |
| raised `bg-raised` | #FFFFFF | #25312A |
| text `text-fg` / `fg-2` / `fg-muted` | #202923 / #4F5A52 / #626B64 | #F2F4EF / #B8C2B9 / #9AA79C |
| brand `bg-brand` `text-brand` (+`brand-fg`, `brand-hover`) | #234B40 (#FFF, #193B32) | #A7C4AF (#18221C, #BAD3C1) |
| accent (decorative only) | #A7B7A7 | #7E9D89 |
| line / line-strong | #E1E2DA / #C9CEC4 | #354139 / #49574D |
| field-line (control borders, ≥3:1) | #7F897F | #6E7F73 |
| ok / warn / danger | #28734E / #8A5F19 / #B42332 | #7CCBA0 / #E0B15C / #F29AA3 |

Refinements to the brief: secondary text split into `fg-2` (body copy, darker) and `fg-muted` (the brief's #626B64);
warn darkened from #91651C to clear 4.5:1 on the stone surface; control borders use `field-line` because the brief's
#C9CEC4 is only ~1.6:1 against white (WCAG 1.4.11 needs 3:1) — it is kept for decorative card edges.

## Theme mechanism
`src/lib/theme.ts` + `ThemeToggle`. Order: stored choice (`localStorage console.theme`) → OS `prefers-color-scheme` → light.
An inline head script sets `data-theme`, `color-scheme` and `<meta name=theme-color>` before first paint. The toggle
renders both icons and CSS picks one from `data-theme` (no flash); `aria-pressed` exposes state. No dependency added.

## Logo and 3D
The on-site logo mark, intro, transition motif, favicon and OG card are recoloured green via tokens (`--color-mark-*`,
`--color-swoosh-*`). The supplied PNG logo has a blue swoosh: if the brand must keep blue, change only those four tokens.
Hero scene colours per theme live in `src/components/three/scenePalette.ts` (geometry and animation untouched).

## Imagery
Section imagery is `<Scene name="…">` (src/components/art/Scene.tsx): original illustrated scenery (land, hills, home, road, family, health) drawn with the theme tokens, used as page-hero backdrops, the CTA band, product-page pictures and home sections. To use real photos, add files to `public/images` and map them in `src/content/imagery.ts` (only photos CONSOLE owns or is licensed to use).

## Verifying
`npm run verify` (types, lint, tests incl. token contrast), then with a running build `npm run check:theme` and `npm run check:browser`.
