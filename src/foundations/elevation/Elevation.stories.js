/**
 * Foundations · Elevation
 *
 * Four shadow tokens. Used sparingly — most institutional surfaces
 * lift via 1px border + bg shift, not shadow. Shadow earns its place
 * on modals, popovers, command palette panels, and floating cards
 * that physically need to read as "above" the underlying canvas.
 */

import './elevation.css';

export default {
  title: 'Foundations/Elevation',
  parameters: {
    docs: {
      description: {
        component:
          'Four shadow tokens. The dark theme uses pure-black shadow with ' +
          'subtle gold tint at higher elevations (matches the portfolio ' +
          'palette). Salt theme uses brown-tinted shadows. Use shadow ' +
          'sparingly — most surfaces lift via border + bg shift.',
      },
    },
  },
  tags: ['autodocs'],
};

const TOKENS = [
  {
    name: '--shadow-sm',
    val: '0 1px 2px rgba(0, 0, 0, 0.45)',
    use: 'Hairline lift — buttons, chips on hover',
  },
  {
    name: '--shadow-md',
    val: '0 4px 12px rgba(0, 0, 0, 0.45)',
    use: 'Cards on hover, inline pickers',
  },
  {
    name: '--shadow-lg',
    val: '0 12px 32px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(201, 169, 89, 0.10)',
    use: 'Floating panels, dropdowns, popovers',
  },
  {
    name: '--shadow-xl',
    val: '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(201, 169, 89, 0.15)',
    use: 'Modals, command palette, full overlays',
  },
];

export const Ladder = {
  name: 'Shadow ladder',
  render: () => `
    <div class="eds-elev-grid">
      ${TOKENS.map((t) => `
        <div class="eds-elev-card" style="box-shadow: ${t.val};">
          <code class="eds-elev-card__var">${t.name}</code>
          <code class="eds-elev-card__val">${t.val}</code>
          <span class="eds-elev-card__use">${t.use}</span>
        </div>
      `).join('')}
    </div>
  `,
};

export const SurfaceVsShadow = {
  name: 'Surface lift vs shadow',
  parameters: {
    docs: {
      description: {
        story:
          'Most institutional cards lift via **border + bg shift**, not ' +
          'shadow. Shadow is for things that physically need to float ' +
          '(modals, popovers). Shown side-by-side: card lifted via ' +
          'border-hover + elevated bg vs card lifted via shadow-md.',
      },
    },
  },
  render: () => `
    <div class="eds-elev-pair">
      <div class="eds-elev-pair__card eds-elev-pair__card--border">
        <div class="eds-elev-pair__label">Border + bg lift</div>
        <p>The default for cards, list rows, panels. No shadow.</p>
      </div>
      <div class="eds-elev-pair__card eds-elev-pair__card--shadow">
        <div class="eds-elev-pair__label">Shadow lift (--shadow-md)</div>
        <p>Reserved for elements that float above flow — popovers, dropdowns.</p>
      </div>
    </div>
  `,
};
