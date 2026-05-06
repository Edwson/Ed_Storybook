/**
 * Foundations · Motion
 *
 * Motion means something changed. Duration is short — entrance 300–500ms,
 * micro-interactions 150–200ms. Live data does not animate (animating
 * a live price introduces perceived latency a professional notices).
 */

import './motion.css';

export default {
  title: 'Foundations/Motion',
  parameters: {
    docs: {
      description: {
        component:
          'Four duration tokens. Three easings. ' +
          'No animation on data — price ticks update instantly. ' +
          'Every keyframe is wrapped in `@media (prefers-reduced-motion: reduce)`.',
      },
    },
  },
  tags: ['autodocs'],
};

const DURATIONS = [
  { name: '--duration-fast', ms: 120, use: 'Hover state, focus ring, button color shift' },
  { name: '--duration-base', ms: 200, use: 'Toggle thumb, tab indicator, badge fill' },
  { name: '--duration-slow', ms: 320, use: 'Drawer slide, modal in, accordion expand' },
  { name: '--duration-page', ms: 500, use: 'Hero entrance, route change, blur-text' },
];

const EASINGS = [
  { name: '--ease', val: 'cubic-bezier(0.4, 0, 0.2, 1)', use: 'Default — material standard' },
  { name: '--ease-out', val: 'cubic-bezier(0, 0, 0.2, 1)', use: 'Entrance, reveal' },
  { name: '--ease-in', val: 'cubic-bezier(0.4, 0, 1, 1)', use: 'Exit, dismiss' },
];

export const DurationScale = {
  name: 'Duration tokens',
  render: () => `
    <div class="eds-motion-page">
      ${DURATIONS.map(({ name, ms, use }) => `
        <div class="eds-motion-row">
          <div class="eds-motion-row__head">
            <code class="eds-motion-row__var">${name}</code>
            <span class="eds-motion-row__ms">${ms}ms</span>
          </div>
          <div class="eds-motion-row__use">${use}</div>
          <button class="eds-motion-demo" style="--demo-dur: ${ms}ms;">Hover me</button>
        </div>
      `).join('')}
    </div>
  `,
};

export const Easings = {
  name: 'Easing curves',
  render: () => `
    <div class="eds-easing-grid">
      ${EASINGS.map(({ name, val, use }) => `
        <div class="eds-easing-card">
          <code class="eds-easing-card__var">${name}</code>
          <code class="eds-easing-card__val">${val}</code>
          <span class="eds-easing-card__use">${use}</span>
          <div class="eds-easing-track">
            <div class="eds-easing-dot" style="animation-timing-function: ${val};"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `,
};
