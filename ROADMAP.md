# ROADMAP — Edwson Design System

> 8-phase migration plan covering all 149 components from
> `design-system-showcase.html`. Each phase ships a discrete batch of
> stories that share a category and conventions.

---

## Phase 0 — Scaffold (✅ shipped v0.1)

Storybook 9 HTML workspace, theme + density decorators, brand chrome,
welcome MDX. See [`README.md`](./README.md).

## Phase 1 — Foundations (7 / 8 shipped)

| Status | Story |
| --- | --- |
| ✅ | Color (palette + accent opacity scale) |
| ✅ | Typography (display / body / mono / numerals) |
| ✅ | Spacing (8px scale + radius scale) |
| ✅ | Motion (durations + easings) |
| ✅ | WCAG Contrast (ladder + failure modes) |
| ✅ | Elevation (4-step shadow ladder + surface-vs-shadow guidance) |
| ✅ | Icons (24×24 stroke set, 36 icons covering arrows / status / finance / compliance / UI) |
| ⏳ | Iconography rules (when to use icon vs label) |

## Phase 2 — Primitives (7 / 12 shipped)

| Status | Story | Source |
| --- | --- | --- |
| ✅ | Button | primary/secondary/ghost/danger/link × 3 sizes × 3 states |
| ✅ | Input | text/number/email/search + prefix/suffix + helper/error |
| ✅ | Select | native `<select>` with `<optgroup>` for venue groupings |
| ✅ | Checkbox | checked/unchecked/indeterminate, helper text slot |
| ✅ | Toggle | `role="switch"`, optional state-bound on/off label |
| ✅ | Badge | 6 variants × 3 appearances × 3 sizes, dot/glyph/uppercase |
| ✅ | Radio | `<fieldset><legend>` group, vertical/horizontal, per-option helper |
| ⏳ | Slider / Range | extract from `design-system-showcase` |
| ⏳ | Chip / Pill | extract |
| ⏳ | Avatar | extract |
| ⏳ | Tag | extract |
| ⏳ | Icon Button | new |

## Phase 3 — Components (0 / 14)

All extracted from `design-system-showcase.html`:

| Story |
| --- |
| Card |
| Alert (semantic 4-variant) |
| Toast |
| Tooltip |
| Popover |
| Modal / Dialog |
| Drawer |
| Accordion |
| Pagination |
| Breadcrumb |
| Tabs |
| Stepper |
| Empty State |
| Skeleton / Loading |

## Phase 4 — Financial (3 / 25)

| Status | Story | Notes |
| --- | --- | --- |
| ✅ | PnL Cell | new — direction-aware glyph + WCAG-pass colors |
| ✅ | Price Tick | symbol + last + delta + sparkline; watchlist row primitive |
| ✅ | Regime Chip | 5-state HMM classifier (crash/bear/neutral/bull/euphoria) + confidence bar |
| ⏳ | Order Row (blotter row) | extract |
| ⏳ | Position Row | extract |
| ⏳ | Watchlist Row | extract |
| ⏳ | Depth Bar | extract |
| ⏳ | Heat Meter | extract |
| ⏳ | Spark | extract |
| ⏳ | VIX Chip | extract |
| ⏳ | Yield Curve (mini) | extract |
| ⏳ | Order Ticket | extract |
| ⏳ | Trade History row | extract |
| ⏳ | Time & Sales tape | extract |
| ⏳ | Volume Bar | extract |
| ⏳ | Market Hours indicator | extract |
| ⏳ | Latency Pill | extract |
| ⏳ | Allocation Bar | extract |
| ⏳ | Greeks readout | extract |
| ⏳ | Margin Meter | extract |
| ⏳ | Risk Util gauge | extract |
| ⏳ | Stress Δ row | new |
| ⏳ | Correlation Heat (cell) | extract |
| ⏳ | Bid/Ask spread chip | extract |
| ⏳ | Currency Selector | extract |

## Phase 5 — Compliance (1 / 12)

| Status | Story | Notes |
| --- | --- | --- |
| ✅ | Disclosure Banner | new — 3 severities |
| ⏳ | KYC Step (progressive disclosure) | extract |
| ⏳ | Threshold Band (3-tier) | extract — RG 268 |
| ⏳ | FIX State Chip | extract — OrdStatus 4-state |
| ⏳ | SAR Row | extract |
| ⏳ | Best-Ex evidence card | extract |
| ⏳ | Audit Trail row | extract — SEC 17a-4 |
| ⏳ | Reg Citation tag | extract |
| ⏳ | Verification Status | extract |
| ⏳ | Consent Receipt card | extract |
| ⏳ | Margin Call dialog | extract |
| ⏳ | Risk-Score readout | extract |

## Phase 6 — AML (0 / 10)

All from the AML Compliance section added 2026-04-19:

| Story |
| --- |
| Sanctions Screening row |
| PEP & Adverse Media monitor card |
| Transaction Risk Score gauge |
| SAR / STR Filing card |
| UBO Ownership Graph (SVG) |
| Ongoing Monitoring queue row |
| Jurisdiction Risk Heatmap |
| CDD Refresh Ticker |
| Typology Library tile |
| Regulatory Change Feed entry |

## Phase 7 — B2B SaaS (0 / 10)

All from the B2B SaaS Platform section added 2026-04-19:

| Story |
| --- |
| Contract Lifecycle (Kanban) card |
| Usage-Based Pricing tier |
| Customer Health Score gauge |
| Enterprise Provisioning step |
| Quota & Rate Limit chart |
| Incident Command priority pill |
| Audit Evidence Export tile |
| Partner Deal Registration card |
| ARR Waterfall row |
| SSO / SCIM Admin row |

## Phase 8 — Patterns (1 / 6)

| Status | Story | Source |
| --- | --- | --- |
| ✅ | Command Palette | new — TradeX_Platform v0.3 model |
| ⏳ | Dashboard Grid (KPI tiles) | extract |
| ⏳ | Kanban Board | extract |
| ⏳ | Data Table (sortable, filterable) | extract |
| ⏳ | Form Layout (multi-step) | extract |
| ⏳ | Filter Bar (chip set) | extract |

---

## Migration mechanics

Each component follows the same recipe:

1. **Find the demo** in `design-system-showcase.html`.
2. **Extract markup** to a vanilla render function in `src/<section>/<component>/<Component>.js`.
3. **Extract scoped styles** to `<component>.css` with `.eds-` prefix and BEM.
4. **Identify props** — variant, size, state, content slots.
5. **Write `.stories.js`** with `args`, `argTypes`, `tags: ['autodocs']`,
   plus at least one use-case story.
6. **Verify** in dev server, run a11y addon, check both themes.
7. **Update `ROADMAP.md`** ✅ status + this README's progress table.

Estimated effort per component: **30 minutes** (most), **60 minutes**
(complex composites like Order Ticket, Yield Curve, UBO Graph).

## Total

149 components × ~30–60 min ≈ **75–150 hours** to v1.0.
At 4–6 hr/day, that is 3–5 working weeks of focused work, batched by phase.

---

*Maintained by Ed Chen · ed@edwson.com · [edwson.com](https://edwson.com)*
