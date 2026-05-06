/**
 * Foundations · Color
 *
 * Renders the design-system color palette directly from tokens. Every value
 * shown here is the same token the rest of the portfolio references — no
 * raw hex strings.
 */

import './color.css';

export default {
  title: 'Foundations/Color',
  parameters: {
    docs: {
      description: {
        component:
          'One accent (gold #c9a959). Three background layers. Four text levels. ' +
          'A pre-mixed accent opacity scale for token-first composition. ' +
          'Semantic colors for status, regime, financial directionality.',
      },
    },
  },
  tags: ['autodocs'],
};

const swatch = (label, varName, hint = '') => `
  <div class="eds-swatch">
    <div class="eds-swatch__chip" style="background: var(${varName});"></div>
    <div class="eds-swatch__body">
      <div class="eds-swatch__label">${label}</div>
      <code class="eds-swatch__var">${varName}</code>
      ${hint ? `<div class="eds-swatch__hint">${hint}</div>` : ''}
    </div>
  </div>
`;

const group = (title, swatches) => `
  <section class="eds-color-group">
    <h3 class="eds-color-group__title">${title}</h3>
    <div class="eds-color-group__grid">${swatches.join('')}</div>
  </section>
`;

export const FullPalette = {
  name: 'Full palette',
  render: () => `
    <div class="eds-color-page">
      ${group('Backgrounds — layered depth', [
        swatch('Void', '--bg-void', 'Page background'),
        swatch('Deep', '--bg-deep', 'Section background'),
        swatch('Surface', '--bg-surface', 'Card surface'),
        swatch('Elevated', '--bg-elevated', '3% white film over surface'),
      ])}
      ${group('Text — four-tier opacity hierarchy', [
        swatch('Primary', '--text-primary', '#fff · headings + key data'),
        swatch('Secondary', '--text-secondary', '72% white · body copy'),
        swatch('Tertiary', '--text-tertiary', '55% white · labels + meta'),
        swatch('Muted', '--text-muted', '28% white · timestamps + footnotes'),
      ])}
      ${group('Accent — used once per screen, no more', [
        swatch('Accent', '--accent', 'gold · institutional weight'),
        swatch('Subtle', '--accent-subtle', '12% — fill on hover/active'),
        swatch('Hover', '--accent-hover', '20% — interactive emphasis'),
      ])}
      ${group('Accent opacity scale (0.03 → 0.90)', [
        swatch('03', '--accent-03'),
        swatch('06', '--accent-06'),
        swatch('10', '--accent-10'),
        swatch('15', '--accent-15'),
        swatch('22', '--accent-22'),
        swatch('30', '--accent-30'),
        swatch('40', '--accent-40'),
        swatch('55', '--accent-55'),
        swatch('70', '--accent-70'),
        swatch('90', '--accent-90'),
      ])}
      ${group('Semantic — directional + status', [
        swatch('Success', '--success', 'Confirmation, settlement OK'),
        swatch('Danger', '--danger', 'Hard error, blocked action'),
        swatch('Positive (financial ▲)', '--color-positive', 'PnL up, gain'),
        swatch('Negative (financial ▼)', '--color-negative', 'PnL down, loss'),
        swatch('Teal', '--color-teal', 'Audit, evidence, neutral confirm'),
      ])}
      ${group('Borders', [
        swatch('Hairline', '--border', '6% white · default'),
        swatch('Hover', '--border-hover', '12% white · interactive states'),
      ])}
    </div>
  `,
};

export const AccentScale = {
  name: 'Accent opacity scale',
  parameters: {
    docs: {
      description: {
        story:
          'A pre-mixed scale of accent transparency. Use these instead of ' +
          'computing rgba() inline — keeps composition token-first and ' +
          'gives every variant a name.',
      },
    },
  },
  render: () => {
    const stops = [
      '03', '04', '05', '06', '07', '08', '10', '14', '15', '18',
      '22', '25', '28', '30', '35', '38', '40', '50', '55', '70', '80', '90',
    ];
    return `
      <div class="eds-accent-scale">
        ${stops.map((s) => `
          <div class="eds-accent-scale__row">
            <div class="eds-accent-scale__chip" style="background: var(--accent-${s});"></div>
            <code class="eds-accent-scale__var">--accent-${s}</code>
            <span class="eds-accent-scale__pct">${parseInt(s, 10)}%</span>
          </div>
        `).join('')}
      </div>
    `;
  },
};
