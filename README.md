# Edwson Design System — Storybook

[![Build & Deploy](https://github.com/Edwson/Ed_Storybook/actions/workflows/deploy.yml/badge.svg)](https://github.com/Edwson/Ed_Storybook/actions/workflows/deploy.yml)
[![Storybook](https://img.shields.io/badge/Storybook-9.1-FF4785?logo=storybook&logoColor=white)](https://edwson.github.io/Ed_Storybook/)
[![License: MIT](https://img.shields.io/badge/License-MIT-c9a959.svg)](LICENSE)

> The working component library behind [edwson.com](https://edwson.com).
> [`design-system-showcase.html`](https://edwson.com/design-system-showcase.html)
> is the marketing surface; **this Storybook is the source of truth**.

**Live:** [edwson.github.io/Ed_Storybook](https://edwson.github.io/Ed_Storybook/)
*(deploys automatically on push to `main` via GitHub Actions)*

---

## What this is

A vanilla-JS / HTML-first component library, served via **Storybook 9**
with the [`@storybook/html-vite`](https://storybook.js.org/docs/get-started/frameworks/html-vite)
renderer. No React, no JSX, no framework lock-in. Each component exports a
render function that returns a string of HTML or a DOM node.

The library reuses the portfolio's design tokens directly from
[`/css/tokens.css`](../css/tokens.css) — there is no fork. A change to a
token in the portfolio cascades into every Storybook component.

## Why a brand fork is allowed here

The portfolio's standing rule is **zero build toolchain**. Storybook
breaks that rule: it ships a Vite dev server, a manager UI, an addon
ecosystem, and a build step. This is a deliberate exception, the same
way `design-system-showcase.html` is allowed to fork the brand.

Reasons:

1. **A real component library has props, args, controls, and states.**
   A static HTML page can demonstrate them. It cannot let a reviewer
   change the value, observe the result, copy the snippet, and read the
   a11y report. Storybook is the lowest-friction way to ship those four
   capabilities together.
2. **Industry expectation.** Senior product designers at top-tier fintech
   are expected to understand component infrastructure. Bypassing
   Storybook would be a missed signal.
3. **Bounded scope.** The build artifact lives at `/storybook-next/` only;
   the rest of the portfolio remains zero-build vanilla JS.

## Getting started

```bash
# from this directory
nvm use                          # node 20.11.1
npm install
npm run storybook                # → http://localhost:6006
npm run build-storybook          # → ./storybook-static (deploy artifact)
```

> **Note:** the dev server fetches Google Fonts (Cormorant Garamond,
> Inter, JetBrains Mono) — same as the rest of the portfolio. Offline
> usage requires self-hosting; deferred for v0.2.

## Architecture

```
storybook-next/
├── .storybook/
│   ├── main.js                  ← stories glob, addons, framework
│   ├── preview.js               ← decorators, theme toggle, tokens import
│   ├── manager.js               ← Storybook UI chrome (Edwson brand)
│   ├── tokens.css               ← @import portfolio tokens
│   ├── fonts.css                ← Google Fonts
│   └── storybook-brand.css      ← preview canvas styles
│
├── src/
│   ├── welcome/Welcome.mdx
│   ├── foundations/             ← color · typography · spacing · motion · wcag
│   ├── primitives/              ← button · input · …
│   ├── components/              ← cards · alerts · accordions · …
│   ├── financial/               ← pnl-cell · order-row · …
│   ├── compliance/              ← disclosure-banner · kyc-step · …
│   ├── aml/                     ← sanctions · pep · ubo-graph · …
│   ├── b2b/                     ← clm · pricing · sso-admin · …
│   └── patterns/                ← command-palette · dashboard-grid · …
│
├── package.json                 ← Storybook 9 + Vite + addons
├── vite.config.js               ← shared aliases (@eds, @tokens)
├── ROADMAP.md                   ← 8-phase migration plan
└── README.md                    ← this file
```

## Conventions

### File layout per component

```
src/<section>/<component>/
├── <Component>.js               ← render fn, JSDoc props
├── <component>.css              ← scoped BEM with .eds- prefix
└── <Component>.stories.js       ← CSF 3 stories with full args/argTypes
```

### Class naming

- `eds-` prefix everywhere — namespaced to avoid colliding with portfolio
  BEM (`.btn`, `.nav__*`, `.pb-*`, etc.).
- BEM: `.eds-btn__icon`, `.eds-btn--primary`.
- Variants and states as modifiers, never attribute selectors.

### Tokens

- Every color, spacing, type, motion value comes from `tokens.css`.
- No hardcoded hex except inside the foundations stories (which are
  *displaying* the tokens).

### CSS rules

Same as the rest of the portfolio:

- Zero inline styles in components (CSS custom property injection like
  `style="--demo-dur: 200ms"` is allowed — it's data, not styling).
- Zero `!important` outside `prefers-reduced-motion`.
- Mobile-first.
- Token-driven.

### Stories

- CSF 3 (`export const Foo = { args: ... }`) — not CSF 2.
- `args` for every meaningful prop.
- `argTypes` for control panel ergonomics + `table.category` grouping.
- Top-level `tags: ['autodocs']` so every component renders a docs page.
- At least one **use-case story** per component (real composition,
  e.g. `Use case · order ticket footer`).

### Theming

Two themes wired via `addon-themes`:

- **Institutional Dark** (default) — matches portfolio.
- **Salt Light** — matches Xanthos / Christie's / Double-Blind cream.

Toggle from the toolbar. Components that need theme-specific overrides
use `[data-theme='salt'] .eds-foo { … }` selectors at the bottom of
their CSS file.

### Density

A **Comfortable / Compact** toggle from the toolbar. Components read
`--density` aware tokens (`--eds-row-h`, `--eds-pad-y`) when present.

### Accessibility

- WCAG 2.1 AA is the floor. The `addon-a11y` runs on every story.
- `role` + `aria-*` wired on every interactive component.
- `prefers-reduced-motion` respected on every keyframe.
- Direction is never colour-only — pair with arrow + sign.

## Deployment

**Production:** GitHub Pages — auto-deployed on every push to `main`.

The workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
runs `npm ci` + `storybook build` + publishes to Pages. The site URL is
[https://edwson.github.io/Ed_Storybook/](https://edwson.github.io/Ed_Storybook/).

**One-time repo setup** (already done if the badge above is green):

1. Repo → **Settings → Pages** → Source: **GitHub Actions**.
2. Repo → **Settings → Actions → Workflow permissions**:
   *Read and write permissions*.
3. Push to `main`. The Action runs.

**Custom domain (optional, future):** if a custom domain is desired
later (`storybook.edwson.com`), add a `CNAME` file under `public/`
with the domain and configure DNS at the registrar. The workflow
already wires `.nojekyll` to keep Pages from filtering Storybook's
underscore-prefixed assets.

## Current status

**v0.3 — 7 foundations + 7 primitives + 3 financial + 1 compliance + 1 pattern = 19 stories shipped.**
See [`ROADMAP.md`](./ROADMAP.md) for the migration plan covering all 149 components.

| Section | v0.3 | Notes |
| --- | --- | --- |
| Foundations | 7 / 8 | Color · Typography · Spacing · Motion · WCAG · Elevation · **Icons** (24×24 stroke set, 36 icons). Iconography rules pending. |
| Primitives | 7 / 12 | Button · Input · Select · Checkbox · Toggle · Badge · **Radio**. Slider · Chip · Avatar · Tag · IconButton pending. |
| Components | 0 / 14 | All pending |
| Financial | 3 / 25 | PnL Cell · **Regime Chip** · **Price Tick** shipped |
| Compliance | 1 / 12 | Disclosure Banner shipped |
| AML | 0 / 10 | All pending |
| B2B SaaS | 0 / 10 | All pending |
| Patterns | 1 / 6 | Command Palette shipped |

---

## Contact

Maintained by Ed Chen · ed@edwson.com · [edwson.com](https://edwson.com)
