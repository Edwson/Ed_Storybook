/**
 * Foundations · WCAG contrast ladder
 *
 * Every text-on-background pair in the system, with computed contrast
 * ratio against the surface it sits on. AA needs 4.5:1 for body text,
 * 3:1 for large text. AAA is 7:1 / 4.5:1.
 */

import './wcag.css';

export default {
  title: 'Foundations/WCAG Contrast',
  parameters: {
    docs: {
      description: {
        component:
          'WCAG 2.1 AA is the floor. Every pair shown here was computed ' +
          'against the surface it sits on, not against pure black or white. ' +
          'The point of this story is that "accessible" can be a number, ' +
          'not a claim.',
      },
    },
  },
  tags: ['autodocs'],
};

// Pre-computed contrast values against --bg-void (#060810).
// Re-run via tools/contrast-check.js before adding new pairs.
const PAIRS = [
  { fg: '--text-primary',   bg: '--bg-void',    ratio: 19.2, level: 'AAA',       use: 'Headings, key data values' },
  { fg: '--text-secondary', bg: '--bg-void',    ratio: 13.8, level: 'AAA',       use: 'Body copy, paragraph text' },
  { fg: '--text-tertiary',  bg: '--bg-void',    ratio:  9.4, level: 'AAA',       use: 'Labels, meta, eyebrows' },
  { fg: '--text-muted',     bg: '--bg-void',    ratio:  4.6, level: 'AA',        use: 'Timestamps, footnotes (large only)' },
  { fg: '--accent',         bg: '--bg-void',    ratio:  9.1, level: 'AAA',       use: 'Accent text, gold values' },
  { fg: '--color-positive', bg: '--bg-void',    ratio:  4.8, level: 'AA',        use: 'Financial ▲ positive PnL' },
  { fg: '--color-negative', bg: '--bg-void',    ratio:  5.1, level: 'AA',        use: 'Financial ▼ negative PnL' },
  { fg: '--text-primary',   bg: '--bg-surface', ratio: 17.4, level: 'AAA',       use: 'Card content (primary)' },
  { fg: '--text-secondary', bg: '--bg-surface', ratio: 12.5, level: 'AAA',       use: 'Card content (body)' },
];

const fmtRatio = (r) => r.toFixed(1) + ':1';

export const Ladder = {
  name: 'Contrast ladder',
  render: () => `
    <table class="eds-wcag-table">
      <thead>
        <tr>
          <th>Sample</th>
          <th>Foreground</th>
          <th>Background</th>
          <th>Ratio</th>
          <th>Level</th>
          <th>Use</th>
        </tr>
      </thead>
      <tbody>
        ${PAIRS.map((p) => `
          <tr>
            <td>
              <div class="eds-wcag-sample"
                   style="background: var(${p.bg}); color: var(${p.fg});">
                Aa institutional
              </div>
            </td>
            <td><code>${p.fg}</code></td>
            <td><code>${p.bg}</code></td>
            <td class="eds-wcag-ratio">${fmtRatio(p.ratio)}</td>
            <td>
              <span class="eds-wcag-level eds-wcag-level--${p.level.toLowerCase()}">${p.level}</span>
            </td>
            <td class="eds-wcag-use">${p.use}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `,
};

export const FailureModesAvoided = {
  name: 'Failure modes we avoid',
  parameters: {
    docs: {
      description: {
        story:
          'Three patterns that show up in finance UI and quietly fail ' +
          'WCAG AA. Each is shown with the value-add fix beside it.',
      },
    },
  },
  render: () => `
    <div class="eds-wcag-fail-grid">
      <article class="eds-wcag-fail">
        <div class="eds-wcag-fail__label">Color-only directionality</div>
        <div class="eds-wcag-fail__pair">
          <div class="eds-wcag-fail__bad">+1.84%</div>
          <div class="eds-wcag-fail__good"><span aria-hidden="true">▲</span> +1.84%</div>
        </div>
        <p>Red/green only fails for ~5% of male traders. Always pair direction with an arrow + sign.</p>
      </article>

      <article class="eds-wcag-fail">
        <div class="eds-wcag-fail__label">Subtle status without label</div>
        <div class="eds-wcag-fail__pair">
          <div class="eds-wcag-fail__bad"><span class="eds-dot eds-dot--ok"></span></div>
          <div class="eds-wcag-fail__good"><span class="eds-dot eds-dot--ok"></span> Cleared · T+1</div>
        </div>
        <p>A green dot alone is not a status. Status = dot + label + (when relevant) a timestamp.</p>
      </article>

      <article class="eds-wcag-fail">
        <div class="eds-wcag-fail__label">Low-contrast meta</div>
        <div class="eds-wcag-fail__pair">
          <div class="eds-wcag-fail__bad" style="color: rgba(255,255,255,0.18);">Last refreshed 2h ago</div>
          <div class="eds-wcag-fail__good" style="color: var(--text-tertiary);">Last refreshed 2h ago</div>
        </div>
        <p>"Light grey" meta text is the most common AA fail. Use --text-tertiary minimum, never below.</p>
      </article>
    </div>
  `,
};
