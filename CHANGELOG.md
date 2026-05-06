# Changelog — Edwson Design System

All notable changes to the Storybook component library.

## v0.3.0 — 2026-05-06 · Icon set + Radio + 2 financial primitives

**Foundations** (6 → 7 / 8)
- Icons — 24×24 stroke set, 36 icons covering arrows (7) · status / signal (9) · finance / data (7) · compliance / audit (8) · UI essentials (5). `icon(name, opts)` returns SVG node, `iconHtml(name, opts)` returns HTML string, `ICON_NAMES` exports the sorted registry. All inherit `currentColor` so they pick up parent text color.

**Primitives** (6 → 7 / 12)
- Radio — `<fieldset><legend>` group with native `<input type="radio">`. Vertical / horizontal orientation. Per-option helper text. Free ←/↑/→/↓ keyboard navigation within group, Tab between groups. Closes the form-input cluster: Button + Input + Select + Checkbox + Toggle + Radio + Badge.

**Financial** (1 → 3 / 25)
- Regime Chip — 5-state HMM classifier (Crash / Bear / Neutral / Bull / Euphoria) with optional confidence bar. Mirrors the TradeX_Platform regime classifier exactly. Glyph + colour + uppercase label, never colour alone.
- Price Tick — symbol + last + delta + sparkline atom. The atom of every watchlist, ticker strip, and execution surface. Tabular-nums + fixed grid columns mean dot positions and percent signs align across rows. Live updates deliberately *not* animated (animating a price tick introduces perceived latency professionals notice).

**Total**: 19 stories shipped (7 foundations + 7 primitives + 3 financial + 1 compliance + 1 pattern).

---

## v0.2.0 — 2026-05-06 · GitHub deploy + 4 more primitives + Elevation foundation

**GitHub integration**
- MIT `LICENSE`.
- `.github/workflows/deploy.yml` — builds Storybook on every push to `main` and publishes to GitHub Pages. Site URL: [edwson.github.io/Ed_Storybook](https://edwson.github.io/Ed_Storybook/).
- README badges: build status, Storybook version, license.
- `vite.config.js` reads `STORYBOOK_BASE` / `GITHUB_ACTIONS` / `CI` env to set `/Ed_Storybook/` base path on Pages without breaking local `npm run storybook`.

**Foundations** (5 → 6 / 8)
- Elevation (4-step shadow ladder + surface-vs-shadow guidance — when to use border + bg lift instead of shadow).

**Primitives** (2 → 6 / 12)
- Select — native `<select>` with `<optgroup>` for venue / jurisdiction groupings; helper text + error message wired to `aria-describedby`.
- Checkbox — checked / unchecked / indeterminate states; full label + helper inside the same hit area.
- Toggle — `role="switch"`, optional state-bound label that swaps on flip ("Streaming" ↔ "Paused").
- Badge — 6 semantic variants (neutral / accent / success / warning / danger / info) × 3 appearances (subtle / solid / outline) × 3 sizes; optional dot, glyph, uppercase mode for case-study tier markers.

**Total**: 15 stories shipped (6 foundations + 6 primitives + 1 financial + 1 compliance + 1 pattern).

---

## v0.1.0 — 2026-05-06 · Scaffold + 5 reference components

**Scaffold**
- Storybook 9 HTML workspace under `storybook-next/`.
- `@storybook/html-vite` framework, `addon-docs`, `addon-a11y`, `addon-themes`.
- Theme decorator: Institutional Dark (default) + Salt Light. Density toggle: Comfortable + Compact.
- Custom manager theme (`storybook/theming`) — Edwson brand chrome with gold accent and Cormorant + Inter + JetBrains Mono.
- `tokens.css` re-imports the portfolio's `/css/tokens.css` so there is no fork.

**Foundations** (5 / 8)
- Color (palette + accent opacity scale)
- Typography (display / body / mono / numerals + practical combinations)
- Spacing (8px scale + radius scale)
- Motion (duration + easing tokens with live demo)
- WCAG Contrast (ladder + failure modes)

**Reference components** (5)
- Primitives — Button (5 variants × 3 sizes × 3 states), Input (3 sizes × 4 states × prefix/suffix slots).
- Financial — PnL Cell (positive / negative / neutral, sized for blotter / KPI / row).
- Compliance — Disclosure Banner (compliant / disclosure / blocked).
- Patterns — Command Palette (TradeX terminal model, ⌘K, ↑↓ Enter Esc).

**Docs**
- `README.md` — architecture, conventions, deployment options.
- `ROADMAP.md` — 8-phase migration plan listing all 149 components from `design-system-showcase.html`.
- `src/welcome/Welcome.mdx` — Storybook landing page.

**Out of scope (deferred)**
- Foundations: Elevation, Icons, Iconography rules.
- Components, AML, B2B SaaS sections — pending migration in batches.
- Real LLM call / actual deployment pipeline.
- Self-hosted fonts (currently via Google Fonts CDN).
