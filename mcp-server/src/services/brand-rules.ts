/**
 * Brand discipline rules.
 *
 * These are the design constraints from the portfolio's CLAUDE.md and
 * the Storybook README — distilled to short, retrievable entries an LLM
 * can quote when reviewing or generating component code.
 *
 * Hardcoded rather than parsed because:
 *   1. They are stable across sessions (a rule is only added when the
 *      portfolio adopts a new convention, not every commit).
 *   2. Parsing CLAUDE.md (~400 KB) into a clean rule set is fragile.
 */

import type { BrandRule } from "../types.js";

export const BRAND_RULES: BrandRule[] = [
  {
    id: "no-inline-styles",
    title: "Zero inline styles",
    body:
      "All styling lives in scoped BEM CSS files. Inline `style=\"...\"` attributes are forbidden in components. " +
      "The single deliberate exception is CSS custom property injection (e.g., `style=\"--eds-conf: 82%\"`) — " +
      "this is data, not styling, and matches Stripe / Linear's pattern for parametrising visual primitives.",
    examples: [
      "OK   — <div class=\"eds-pnl eds-pnl--positive\"><span class=\"eds-pnl__value\">487.32</span></div>",
      "OK   — <span class=\"eds-tick__delta\" style=\"--eds-conf: 82%\">  // CSS variable injection",
      "BAD  — <div style=\"color: #c9a959; padding: 12px\">…</div>        // raw inline declarations",
    ],
    source: "Portfolio CLAUDE.md → 核心原則 #1; storybook-next/README.md → Conventions",
  },
  {
    id: "no-important",
    title: "Zero `!important`",
    body:
      "`!important` is forbidden everywhere in the design system except inside a " +
      "`@media (prefers-reduced-motion: reduce)` block, where overriding component-level animation values is the only correct way to honour the preference.",
    examples: [
      "OK — @media (prefers-reduced-motion: reduce) { .eds-btn { transition: none !important } }",
      "BAD — .eds-btn:hover { background: var(--accent) !important }",
    ],
    source: "Portfolio CLAUDE.md → 核心原則 #2",
  },
  {
    id: "token-first",
    title: "Token-first colours, spacing, type, motion",
    body:
      "Every colour, spacing value, font, duration, and easing must reference a token from `css/tokens.css`. " +
      "Hardcoded hex / px / ms values inside component CSS are forbidden — the only place raw values are " +
      "tolerated is inside the foundations stories that demonstrate the tokens themselves.",
    examples: [
      "OK   — color: var(--text-primary); padding: var(--space-3);",
      "BAD  — color: #fff; padding: 12px;",
    ],
    source: "Portfolio CLAUDE.md → 核心原則 #3",
  },
  {
    id: "bem-naming",
    title: "BEM naming, .eds- namespace",
    body:
      "Class names follow `.eds-{block}__{element}--{modifier}`. The `eds-` prefix " +
      "namespaces the design system away from the portfolio's own BEM (`.btn`, `.pb-*`, `.threads__*`). " +
      "Modifiers are state and variant only — never new layout primitives.",
    examples: [
      "OK   — .eds-btn, .eds-btn__icon, .eds-btn--primary, .eds-btn--lg",
      "BAD  — .button-primary-large  (kebab-style mash without BEM separators)",
      "BAD  — .btn__icon             (missing eds- prefix, collides with portfolio)",
    ],
    source: "Portfolio CLAUDE.md → 核心原則 #4",
  },
  {
    id: "mobile-first",
    title: "Mobile-first responsive",
    body:
      "Component CSS starts with the mobile layout. Larger breakpoints are added with `@media (min-width: …)` " +
      "queries, never `max-width`. The default cascade is therefore the mobile view; desktop and wide-screen are the additive layers.",
    examples: [
      "OK   — .eds-grid { grid-template-columns: 1fr } @media (min-width: 720px) { .eds-grid { grid-template-columns: 1fr 1fr } }",
      "BAD  — .eds-grid { grid-template-columns: 1fr 1fr } @media (max-width: 720px) { .eds-grid { grid-template-columns: 1fr } }",
    ],
    source: "Portfolio CLAUDE.md → 核心原則 #5",
  },
  {
    id: "wcag-aa-floor",
    title: "WCAG 2.1 AA is the floor",
    body:
      "Contrast ratios for body text must be ≥ 4.5:1 against the surface they sit on; large text ≥ 3:1. " +
      "Direction is never colour-only — financial up/down always pairs colour + arrow + sign + (where helpful) " +
      "an `aria-label` so deuteranopia and screen-reader users get the same signal.",
    examples: [
      "OK   — <span class=\"eds-pnl--positive\"><span aria-hidden>▲</span> +1.84%</span>",
      "BAD  — <span style=\"color:green\">+1.84%</span>",
    ],
    source: "storybook-next/README.md → Accessibility; Foundations/WCAG Contrast story",
  },
  {
    id: "voice-no-incumbent",
    title: "No incumbent product names on portfolio surfaces",
    body:
      "Component descriptions, story copy, and case-study text avoid naming Bloomberg, Refinitiv, Eikon, " +
      "Capital IQ, Tradeweb, FactSet, etc. as comparison anchors. Naming them invites the reader to compare against the incumbent and " +
      "frames the work as 'me too'. Articulate the user-need gap directly instead.",
    examples: [
      "OK   — \"Multi-jurisdiction trading desks face a recurring decision-flow gap…\"",
      "BAD  — \"Bloomberg's RGN is a news push feed, not a pre-trade decision surface…\"",
    ],
    source: "Portfolio CLAUDE.md → Voice convention #12",
  },
  {
    id: "voice-acy-footnote",
    title: "ACY appears as a footnote, not a hero leverage",
    body:
      "Case-study copy frames Ed's contribution as independent design thesis (gap observed → response designed). " +
      "ACY Securities experience is a single-paragraph footnote at the end of the rationale, not the lede. " +
      "This keeps surfaces looking like generalisable insight rather than single-employer dependence.",
    examples: [
      "OK   — \"…I read the regulation backward from audit readiness. Pattern verified during four years inside an ASIC-regulated broker.\"",
      "BAD  — \"Leveraging four years of ACY experience, I designed…\"",
    ],
    source: "Portfolio CLAUDE.md → Voice convention #13",
  },
  {
    id: "live-data-not-animated",
    title: "Live data does not animate",
    body:
      "Price ticks, P&L updates, latency counters update **instantly**. " +
      "Animating a value introduces perceived latency that professionals notice. " +
      "Animation is reserved for state changes (entrance, dismissal, mode toggle) and micro-interactions.",
    examples: [
      "OK   — element.textContent = newPrice;  // value swaps without transition",
      "BAD  — element.style.transition = 'all 200ms'; element.textContent = newPrice;",
    ],
    source: "Portfolio DESIGN.md → Motion Principles #4",
  },
  {
    id: "single-accent",
    title: "One accent colour per screen",
    body:
      "Gold (`--accent: #c9a959`) is the only accent. A second accent is almost always a symptom of unclear " +
      "hierarchy — when everything competes, nothing leads. Apply the gold to one interactive state, one data " +
      "highlight, and one CTA at most. Never decoratively.",
    examples: [
      "OK — primary CTA gold; everything else neutral. Hover lifts neutral → accent.",
      "BAD — gold border + gold heading + gold icon + gold CTA on the same card.",
    ],
    source: "Portfolio DESIGN.md → Colour System",
  },
];

export function findBrandRule(id: string): BrandRule | undefined {
  return BRAND_RULES.find((r) => r.id === id.toLowerCase().trim());
}

export function listBrandRuleIds(): string[] {
  return BRAND_RULES.map((r) => r.id);
}
