/**
 * Foundations · Typography
 *
 * Two fonts. Display (Cormorant Garamond) used sparingly — h1 / h2 only.
 * Body (Inter) for everything functional. JetBrains Mono for data,
 * tickers, code, and any value that benefits from tabular alignment.
 */

import './typography.css';

export default {
  title: 'Foundations/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Display font is institutional gravity, used at h1/h2 only. ' +
          'Body font is legibility-first. Mono is precision-first. ' +
          'Mixing the three is what reads as "considered" rather than decorative.',
      },
    },
  },
  tags: ['autodocs'],
};

export const TypeScale = {
  name: 'Type scale',
  render: () => `
    <div class="eds-type-page">
      <section class="eds-type-section">
        <div class="eds-type-section__label">Display · Cormorant Garamond</div>
        <h1 class="eds-type-display-1">Where restraint is the signal.</h1>
        <h2 class="eds-type-display-2">A trade ticket that survives an audit.</h2>
      </section>

      <section class="eds-type-section">
        <div class="eds-type-section__label">Body · Inter</div>
        <p class="eds-type-body-lg">
          Lead paragraph. Used at the top of long-form sections to set the frame.
          One sentence per idea. Inter at 1.125rem, line-height 1.6.
        </p>
        <p class="eds-type-body">
          Body copy. The default paragraph style for case studies and field notes.
          Inter at 1rem, line-height 1.65, secondary text color so the heading
          carries the visual weight.
        </p>
        <p class="eds-type-body-sm">
          Small body. Captions, callout footers, evidence lines beneath a stat.
          Inter at 0.85rem with the tertiary color.
        </p>
      </section>

      <section class="eds-type-section">
        <div class="eds-type-section__label">Mono · JetBrains Mono</div>
        <div class="eds-type-mono-row">
          <code class="eds-type-mono-md">SPY 487.32 <span class="eds-pos">▲ +1.84 (+0.38%)</span></code>
        </div>
        <div class="eds-type-mono-row">
          <code class="eds-type-mono-sm">FIX 35=8 · 39=2 · 150=F · 14=200 · 31=487.30</code>
        </div>
        <div class="eds-type-mono-row">
          <code class="eds-type-mono-xs">EYEBROW · CLAUSE · METADATA</code>
        </div>
      </section>

      <section class="eds-type-section">
        <div class="eds-type-section__label">Numerals — tabular by default for data</div>
        <pre class="eds-type-numerals">  $1,247,830.42
  $   34,920.18
  $      817.05
  $        2.93</pre>
      </section>
    </div>
  `,
};

export const PracticalCombinations = {
  name: 'Practical combinations',
  parameters: {
    docs: {
      description: {
        story:
          'How the three fonts combine in real surfaces — a card head, a ' +
          'data row, a callout, a hero. Worth more than a font scale chart.',
      },
    },
  },
  render: () => `
    <div class="eds-type-combos">
      <article class="eds-type-card">
        <div class="eds-type-card__eyebrow">CASE STUDY · 2024</div>
        <h2 class="eds-type-card__title">ACY Connect · institutional FIX onboarding</h2>
        <p class="eds-type-card__body">
          Twelve prime brokers onboarded against MiFID II Art 27 disclosure
          requirements. Same component library, three jurisdictional variants.
        </p>
        <div class="eds-type-card__meta">100K+ traders · 40+ jurisdictions · $2B daily</div>
      </article>

      <article class="eds-type-card">
        <div class="eds-type-card__eyebrow">FIELD NOTE · APR 2026</div>
        <h2 class="eds-type-card__title">Why FIX 4.4 latency dictates order entry form design</h2>
        <p class="eds-type-card__body">
          8–12ms round-trip is not the constraint to design around — it's the
          constraint that makes consumer safety patterns a latency tax.
        </p>
        <div class="eds-type-card__meta">8 min read · ASIC RG 268 · FINRA 4210</div>
      </article>
    </div>
  `,
};
