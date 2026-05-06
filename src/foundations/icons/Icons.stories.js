/**
 * Foundations · Icons
 *
 * 24×24 stroke icons. Inheriting currentColor so they pick up the
 * surrounding text color. Used everywhere a label needs reinforcement
 * — never as the sole carrier of meaning (always paired with text or
 * an accessible label).
 */

import { ICON_NAMES, iconHtml, icon } from './icons.js';
import './icons.css';

export default {
  title: 'Foundations/Icons',
  parameters: {
    docs: {
      description: {
        component:
          '24×24 viewBox, 2px stroke, `currentColor` — icons inherit ' +
          'color from the parent text, which is what makes them feel ' +
          'integrated rather than decorative. Stroke (not filled) to ' +
          'match the institutional voice.\n\n' +
          '**Rule:** never use an icon as the only carrier of meaning. ' +
          'Always pair with text, an `aria-label`, or a tooltip. The ' +
          'icon is shorthand, the label is the contract.',
      },
    },
  },
  tags: ['autodocs'],
};

export const Gallery = {
  name: 'All icons',
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-icon-gallery';
    ICON_NAMES.forEach((name) => {
      const cell = document.createElement('div');
      cell.className = 'eds-icon-cell';
      cell.innerHTML = `
        <div class="eds-icon-cell__icon">${iconHtml(name)}</div>
        <code class="eds-icon-cell__name">${name}</code>
      `;
      root.appendChild(cell);
    });
    return root;
  },
};

export const Sizes = {
  parameters: {
    docs: {
      description: {
        story:
          'Three pragmatic sizes — 16 (inline with body text), 20 ' +
          '(inside button + nav row), 24 (default, standalone).',
      },
    },
  },
  render: () => `
    <div class="eds-icon-sizes">
      <div class="eds-icon-cell">
        ${iconHtml('shield-check', { size: 16 })}
        <code>16px · inline</code>
      </div>
      <div class="eds-icon-cell">
        ${iconHtml('shield-check', { size: 20 })}
        <code>20px · button / row</code>
      </div>
      <div class="eds-icon-cell">
        ${iconHtml('shield-check', { size: 24 })}
        <code>24px · default</code>
      </div>
      <div class="eds-icon-cell">
        ${iconHtml('shield-check', { size: 32 })}
        <code>32px · KPI tile</code>
      </div>
    </div>
  `,
};

export const ColorInheritance = {
  parameters: {
    docs: {
      description: {
        story:
          'Icons read `currentColor` so they pick up the parent text ' +
          'color automatically. No color prop needed on the component.',
      },
    },
  },
  render: () => `
    <div class="eds-icon-color-grid">
      <span class="eds-icon-color eds-icon-color--primary">${iconHtml('check')} default</span>
      <span class="eds-icon-color eds-icon-color--accent">${iconHtml('shield')} accent</span>
      <span class="eds-icon-color eds-icon-color--success">${iconHtml('trending-up')} positive</span>
      <span class="eds-icon-color eds-icon-color--danger">${iconHtml('alert-circle')} alert</span>
      <span class="eds-icon-color eds-icon-color--muted">${iconHtml('clock')} muted</span>
    </div>
  `,
};

export const InContext = {
  name: 'In context · how icons compose',
  render: () => `
    <div class="eds-icon-context">
      <div class="eds-icon-context__row">
        ${iconHtml('shield-check', { size: 18 })}
        <span><strong>FINRA 2111 suitability</strong> — verified against client KYC profile.</span>
      </div>
      <div class="eds-icon-context__row">
        ${iconHtml('trending-up', { size: 18 })}
        <span><strong>+1.84% (+$1,840)</strong> — day P&L on SPY position.</span>
      </div>
      <div class="eds-icon-context__row">
        ${iconHtml('alert-circle', { size: 18 })}
        <span><strong>VIX ≥ 30</strong> — defensive default applied to portfolio.</span>
      </div>
      <div class="eds-icon-context__row">
        ${iconHtml('lock', { size: 18 })}
        <span><strong>Sealed at 14:32 UTC</strong> — Track A committed, hash retained.</span>
      </div>
    </div>
  `,
};
