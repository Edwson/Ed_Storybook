/**
 * PnL Cell — financial-data primitive
 *
 * One cell, four pieces of information:
 *   • the value itself (always tabular-nums)
 *   • directional glyph (▲ / ▼ / —) — never colour alone
 *   • absolute delta
 *   • percent delta in parentheses
 *
 * Color is paired with arrow + sign so the cell is readable for
 * deuteranopia users. WCAG 2.1 AA on every variant.
 *
 * @typedef {Object} PnLCellProps
 * @property {number} value
 * @property {number} [delta]              absolute change vs previous close / cost basis
 * @property {number} [deltaPct]           percent change (e.g., 0.0184 for +1.84%)
 * @property {string} [currency]           e.g. 'USD'
 * @property {boolean} [showCurrency]      prepend currency code
 * @property {boolean} [showSign]          prepend explicit + sign on positive
 * @property {'sm'|'md'|'lg'} [size]
 * @property {'auto'|'positive'|'negative'|'neutral'} [direction]
 *           When 'auto' (default), inferred from delta sign.
 * @property {boolean} [block]             wrap each piece on its own line
 */

import './pnl-cell.css';

/**
 * @param {PnLCellProps} props
 * @returns {HTMLElement}
 */
export function PnLCell({
  value = 0,
  delta = 0,
  deltaPct = 0,
  currency = '',
  showCurrency = false,
  showSign = true,
  size = 'md',
  direction = 'auto',
  block = false,
} = {}) {
  const dir = direction === 'auto'
    ? (delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral')
    : direction;

  const glyph = dir === 'positive' ? '▲'
              : dir === 'negative' ? '▼'
              : '—';

  const sign = dir === 'positive' && showSign ? '+' : '';

  const root = document.createElement('div');
  root.className = [
    'eds-pnl',
    `eds-pnl--${size}`,
    `eds-pnl--${dir}`,
    block ? 'eds-pnl--block' : '',
  ].filter(Boolean).join(' ');

  root.setAttribute(
    'aria-label',
    [
      `${formatNumber(value, 2)}${currency ? ' ' + currency : ''}`,
      delta !== 0 ? `change ${sign}${formatNumber(delta, 2)}` : 'no change',
      deltaPct !== 0 ? `${sign}${(deltaPct * 100).toFixed(2)} percent` : '',
    ].filter(Boolean).join(', '),
  );

  root.innerHTML = `
    <span class="eds-pnl__value">
      ${showCurrency && currency ? `<span class="eds-pnl__ccy">${currency}</span>` : ''}
      ${formatNumber(value, 2)}
    </span>
    ${dir !== 'neutral' || delta !== 0 ? `
      <span class="eds-pnl__delta" aria-hidden="true">
        <span class="eds-pnl__glyph">${glyph}</span>
        <span class="eds-pnl__delta-abs">${sign}${formatNumber(delta, 2)}</span>
        <span class="eds-pnl__delta-pct">(${sign}${(deltaPct * 100).toFixed(2)}%)</span>
      </span>
    ` : ''}
  `;

  return root;
}

function formatNumber(n, frac = 2) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: frac,
    maximumFractionDigits: frac,
  }).format(n);
}
