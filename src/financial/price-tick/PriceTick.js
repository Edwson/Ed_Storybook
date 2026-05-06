/**
 * Price Tick — institutional live-price row primitive
 *
 * The atom of every watchlist, ticker bar, and execution surface.
 * Symbol + last + delta + percent + (optional) sparkline. Colour is
 * always paired with arrow + sign — direction is never colour-only.
 *
 * Live updates are *not* animated. Animating a price tick introduces
 * perceived latency that professionals notice; the value just changes.
 *
 * @typedef {Object} PriceTickProps
 * @property {string} symbol
 * @property {number} last
 * @property {number} [change]            Absolute change vs previous close
 * @property {number} [changePct]         Percent change as decimal (0.0184 = 1.84%)
 * @property {number[]} [sparkline]       Array of intraday closes for the spark
 * @property {string} [venue]             e.g. 'NYSE', 'NASDAQ'
 * @property {'sm'|'md'|'lg'} [size]
 * @property {boolean} [showVenue]
 * @property {boolean} [showSpark]
 * @property {(e: Event) => void} [onClick]
 */

import './price-tick.css';

/**
 * @param {PriceTickProps} props
 * @returns {HTMLElement}
 */
export function PriceTick({
  symbol = 'SPY',
  last = 0,
  change = 0,
  changePct = 0,
  sparkline = [],
  venue = '',
  size = 'md',
  showVenue = false,
  showSpark = true,
  onClick,
} = {}) {
  const dir = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  const glyph = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '—';
  const sign = dir === 'up' ? '+' : '';

  const tag = onClick ? 'button' : 'div';
  const root = document.createElement(tag);
  root.className = [
    'eds-tick',
    `eds-tick--${size}`,
    `eds-tick--${dir}`,
    onClick ? 'eds-tick--interactive' : '',
  ].filter(Boolean).join(' ');

  if (onClick) {
    root.type = 'button';
    root.addEventListener('click', onClick);
  }

  root.setAttribute('aria-label', [
    symbol,
    `last ${formatPrice(last)}`,
    change !== 0 ? `change ${sign}${formatPrice(change)} ${sign}${(changePct * 100).toFixed(2)} percent` : 'unchanged',
    venue ? `on ${venue}` : '',
  ].filter(Boolean).join(', '));

  root.innerHTML = `
    <span class="eds-tick__sym">
      <span class="eds-tick__symbol">${escapeHtml(symbol)}</span>
      ${showVenue && venue ? `<span class="eds-tick__venue">${escapeHtml(venue)}</span>` : ''}
    </span>
    ${showSpark && sparkline.length >= 2 ? renderSpark(sparkline, dir) : ''}
    <span class="eds-tick__last">${formatPrice(last)}</span>
    <span class="eds-tick__delta">
      <span class="eds-tick__glyph" aria-hidden="true">${glyph}</span>
      <span class="eds-tick__delta-abs">${sign}${formatPrice(change)}</span>
      <span class="eds-tick__delta-pct">${sign}${(changePct * 100).toFixed(2)}%</span>
    </span>
  `;

  return root;
}

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Render a tiny inline sparkline as a 60×16 SVG path. */
function renderSpark(points, dir) {
  if (points.length < 2) return '';
  const w = 60, h = 16, pad = 1;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = (max - min) || 1;

  const xStep = (w - pad * 2) / (points.length - 1);
  const path = points.map((p, i) => {
    const x = pad + i * xStep;
    const y = pad + (1 - (p - min) / range) * (h - pad * 2);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');

  return `
    <svg class="eds-tick__spark" viewBox="0 0 ${w} ${h}"
         width="${w}" height="${h}" aria-hidden="true">
      <path d="${path}" fill="none" stroke="currentColor"
            stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
