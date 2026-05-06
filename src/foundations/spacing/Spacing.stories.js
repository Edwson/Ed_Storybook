/**
 * Foundations · Spacing
 *
 * 8px grid throughout. Tokens follow --space-N convention. Hardcoded
 * pixel values are not allowed in component CSS — a single token change
 * cascades correctly across the system.
 */

import './spacing.css';

export default {
  title: 'Foundations/Spacing',
  parameters: {
    docs: {
      description: {
        component:
          '8-pixel grid. 12 tokens — 4px (--space-1) through 128px ' +
          '(--space-12). Use these instead of arbitrary values. ' +
          'No hardcoded margins or paddings anywhere in component CSS.',
      },
    },
  },
  tags: ['autodocs'],
};

const TOKENS = [
  { name: '--space-1', px: 4 },
  { name: '--space-2', px: 8 },
  { name: '--space-3', px: 12 },
  { name: '--space-4', px: 16 },
  { name: '--space-5', px: 24 },
  { name: '--space-6', px: 32 },
  { name: '--space-7', px: 40 },
  { name: '--space-8', px: 48 },
  { name: '--space-9', px: 64 },
  { name: '--space-10', px: 80 },
  { name: '--space-11', px: 96 },
  { name: '--space-12', px: 128 },
];

export const Scale = {
  name: '8px scale',
  render: () => `
    <div class="eds-spacing-scale">
      ${TOKENS.map(({ name, px }) => `
        <div class="eds-spacing-row">
          <code class="eds-spacing-row__var">${name}</code>
          <div class="eds-spacing-row__bar" style="width: ${px}px;"></div>
          <span class="eds-spacing-row__px">${px}px</span>
        </div>
      `).join('')}
    </div>
  `,
};

export const RadiusScale = {
  name: 'Border radius',
  parameters: {
    docs: {
      description: {
        story:
          'Three radius tokens. Deliberately small. Rounded corners read as ' +
          '"consumer app" — institutional surfaces stay sharp.',
      },
    },
  },
  render: () => `
    <div class="eds-radius-grid">
      <div class="eds-radius-card" style="border-radius: var(--radius-s);">
        <code>--radius-s · 4px</code>
        <span>Badges, tags, inputs</span>
      </div>
      <div class="eds-radius-card" style="border-radius: var(--radius-m);">
        <code>--radius-m · 8px</code>
        <span>Buttons, chips</span>
      </div>
      <div class="eds-radius-card" style="border-radius: var(--radius-l);">
        <code>--radius-l · 12px</code>
        <span>Cards, panels, modals</span>
      </div>
    </div>
  `,
};
