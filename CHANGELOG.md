# Changelog — Edwson Design System

All notable changes to the Storybook component library.

## v0.5.1 — 2026-05-06 · Theme switching · comprehensive docs override + root data-theme

Patch release fixing the residual dark-theme black-text bug reported on the deployed site. The keystone token + button fix in v0.5.0 fixed canvas stories, but **docs (autodocs) pages** were still rendering Storybook's internal classes with light-mode-only colours: TOC links `rgb(46,52,56)` invisible on dark, error displays black-on-dark, default `a/strong/td` falling back to Storybook defaults.

**Root cause**:
1. The `withThemeByDataAttribute` decorator only applies `data-theme` to the per-story wrapper element. Docs iframes — which compose multiple stories — never got `data-theme` on `<html>`, so the token cascade didn't flip.
2. Storybook's autodocs internal CSS (`.sbdocs *`, `.toc-link`, `.docblock-*`, `.sb-errordisplay`) ships with hard-coded light-mode colours that beat our `.sbdocs-wrapper` override on specificity for nested elements.

**Fix**:
1. **`.storybook/preview.js`** — added a `forceRootDataTheme` decorator that runs before every render and explicitly sets `document.documentElement.setAttribute('data-theme', themeAttr)`. Works for both canvas + docs iframes.
2. **`.storybook/storybook-brand.css`** — comprehensive Storybook autodocs override block: typography (`.sbdocs h1-h6 / p / li / strong / em`), links (`.sbdocs a` → accent), code (`.sbdocs code / pre` → mono on bg-elevated), tables (`.sbdocs table / th / td` → surface tinted), TOC rail (`.toc-link` → text-tertiary, `.is-active-link` → accent), docs blocks (`.docblock-source / -argstable / -arginfo`), error display (`.sb-errordisplay *` → text-primary on bg-void), tab list (`button[role=tab]`), and form chrome inside docs.

Now every text element inside the docs iframe inherits a token-flippable colour, and the data-theme attribute reaches `<html>` so all `var(--*)` references resolve correctly per active theme.

---

## v0.5.0 — 2026-05-06 · Institutional financial depth + showpiece Pattern

This batch was driven by a single criterion: **what does a Senior PD at a top-tier fintech (JPM / GS / Bloomberg) want to see in 60 seconds?** Six components + one showpiece pattern, all encoding real institutional workflows with regulatory citations.

**Patterns** (1 → 2 / 6) — *the showpiece*
- **Dashboard Grid** — Bloomberg-class trading-desk surface composing every financial primitive in the library: 4 KPI tiles (Card + PnLCell), Regime + VIX header strip (RegimeChip + VixChip), 8-row execution blotter (OrderRow + FixStateChip), 6-row positions table (PositionRow + PnLCell), pre-trade compliance footer (ThresholdBand). Ten distinct components, all referenced from their shipped source — change `--accent` and the entire dashboard re-skins. **First-glance test for the system.**

**Financial** (3 → 6 / 25)
- **Order Row** — 11-column institutional blotter row at fixed-px widths. Tabular-nums alignment across rows. Side colour paired with arrow + uppercase label. Five fill variants (working / pending-new / partial / filled / canceled / rejected) reuse FixStateChip. SEC Rule 17a-4 retention + FINRA OATS hooks called out in docs.
- **Position Row** — 9-column PORT-style positions table row. Long / short with side glyph (L / S). Reuses PnLCell at sm size for unrealized + total. Institutional money formatter (`$5.0M`, `$340K`, `$2.10`) so every row fits the same column width regardless of magnitude.
- **VIX Chip** — CBOE volatility regime indicator with 4 bands (calm < 15 / normal 15-20 / elevated 20-30 / crisis ≥ 30). VIX-up colours red (vol increase = bad for risk-on); VIX-down colours green. FINRA 4210(g) margin escalation context surfaced in tooltip on crisis-band.

**Compliance** (2 → 4 / 12)
- **FIX State Chip** — FIX 4.4 OrdStatus indicator (tag 39) with all 6 single-broker states (pending-new A / new 0 / partial 1 / filled 2 / canceled 4 / rejected 8). Code + label pairing. SEC Rule 17a-4 retention + FINRA OATS context.
- **Threshold Band** — pre-trade 3-tier escalation indicator. Maps a notional onto a jurisdictional threshold ladder (compliant / disclosure-required / blocked). Both threshold ticks visible on the bar so operators see *how close* they are to next escalation, not just current tier. MAS Notice 626 §8.3 / FINRA 4210(g) / 31 CFR 1010.311 anchors.

**Welcome / Editorial polish**
- Welcome MDX rewritten with sharper institutional positioning, status table, regulatory anchor index, and direct link to Dashboard Grid showpiece.
- New "Editorial stance" page articulates discipline: what gets shipped, what never gets shipped, the 60-second hire-conversation yard-stick.

**Total**: 30 stories shipped (7 foundations + 8 primitives + 3 components + 6 financial + 4 compliance + 2 patterns).

---

## v0.4.0 — 2026-05-06 · First Components/* batch + KYC Step + Avatar

**Components** (0 → 3 / 14)
- Card — universal surface primitive. Header (eyebrow + title) / body (HTML) / footer meta slots, all optional. `hoverable` lifts on hover; `elevated` switches from border to shadow. Auto-renders as `<a>` when `href` is set, `<button>` when `onClick` is set, `<div>` otherwise.
- Alert — 4 semantic variants (info / success / warning / danger) for generic notices. `role="alert"` + `aria-live="assertive"` on `danger`; `role="status"` + `aria-live="polite"` on the others. Optional dismiss button + action button. Distinct from Disclosure Banner (regulatory / jurisdictional).
- Tooltip — pure-CSS hover affordance with 4 placements (top / right / bottom / left). `aria-describedby` wires bubble to trigger; `tabindex=0` on trigger means keyboard users get the same reveal as mouse. No portal, no JS positioning library — works before Storybook hydration.

**Primitives** (7 → 8 / 12)
- Avatar — image / initials / icon fallback in priority order. 3 sizes (sm / md / lg). Circle (default) or squared (for system / org avatars). Optional status dot in bottom-right (4 colours: success / warn / danger / neutral). `role="img"` + `aria-label="<name>"` so screen readers announce identity.

**Compliance** (1 → 2 / 12)
- KYC Step — single step in a multi-step KYC / EDD flow. 4 statuses (pending / active / complete / blocked) drive bar colour + numeral glyph (✓ on complete, ! on blocked). Regulatory citation slot (e.g., `31 CFR 1010.230 · CIP`). Mirrors the pattern from the "Why KYC Drop-Off Spikes at EDD" field note that lifted EDD completion 35% → 70%.

**Total**: 24 stories shipped (7 foundations + 8 primitives + 3 components + 3 financial + 2 compliance + 1 pattern).

---

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
