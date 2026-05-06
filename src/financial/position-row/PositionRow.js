/**
 * Position Row — institutional positions table row
 *
 * The atom of every PORT-style positions table. 9 columns:
 *   Symbol / Side / Qty / Avg / Last / MV / Unreal / Realized / Total
 *
 * Reuses PnLCell for unrealized + total (small size, block layout).
 * Tabular-nums + fixed-px grid means dot positions align across rows
 * even when the integer width of $5M differs from $50.
 *
 * @typedef {Object} PositionRowProps
 * @property {string} symbol
 * @property {'long'|'short'} side
 * @property {number} qty
 * @property {number} avg                Average cost basis (per share)
 * @property {number} last               Last traded price
 * @property {number} [unrealized]       Override; otherwise computed (last - avg) × qty
 * @property {number} [unrealizedPct]    Override; otherwise computed
 * @property {number} [realized]         Realized P&L this period
 * @property {boolean} [interactive]
 * @property {(e: Event) => void} [onClick]
 */

import { PnLCell } from '../pnl-cell/PnLCell.js';
import './position-row.css';

/**
 * @param {PositionRowProps} props
 * @returns {HTMLElement}
 */
export function PositionRow({
  symbol = '',
  side = 'long',
  qty = 0,
  avg = 0,
  last = 0,
  unrealized,
  unrealizedPct,
  realized = 0,
  interactive = false,
  onClick,
} = {}) {
  // Derive market value + unrealized when not explicit.
  const sideMul = side === 'short' ? -1 : 1;
  const mv = last * qty * sideMul;
  const unreal = unrealized != null ? unrealized : (last - avg) * qty * sideMul;
  const unrealPct =
    unrealizedPct != null
      ? unrealizedPct
      : avg > 0
        ? ((last - avg) / avg) * sideMul
        : 0;
  const total = unreal + realized;
  const totalPct = avg * qty > 0 ? total / (avg * qty) : 0;

  const tag = onClick ? 'button' : 'div';
  const root = document.createElement(tag);
  root.className = [
    'eds-prow',
    `eds-prow--${side}`,
    interactive || onClick ? 'eds-prow--interactive' : '',
  ].filter(Boolean).join(' ');
  if (tag === 'button') root.type = 'button';
  root.setAttribute(
    'aria-label',
    `${side} ${qty} ${symbol}, market value ${formatMoney(mv)}, unrealized ${formatMoney(unreal)}`,
  );

  root.innerHTML = `
    <span class="eds-prow__sym">${escapeHtml(symbol)}</span>
    <span class="eds-prow__side eds-prow__side--${side}">
      <span class="eds-prow__glyph" aria-hidden="true">${side === 'long' ? 'L' : 'S'}</span>
      <span class="eds-prow__side-label">${side === 'long' ? 'LONG' : 'SHORT'}</span>
    </span>
    <span class="eds-prow__qty">${formatNum(qty, 0)}</span>
    <span class="eds-prow__avg">${formatNum(avg, 2)}</span>
    <span class="eds-prow__last">${formatNum(last, 2)}</span>
    <span class="eds-prow__mv">${formatMoney(mv)}</span>
    <span class="eds-prow__unreal" data-unreal></span>
    <span class="eds-prow__realized">${formatMoney(realized)}</span>
    <span class="eds-prow__total" data-total></span>
  `;

  // Mount PnLCell at sm size for unrealized + total.
  root.querySelector('[data-unreal]').appendChild(
    PnLCell({
      value: unreal,
      delta: unreal,
      deltaPct: unrealPct,
      size: 'sm',
      direction: unreal > 0 ? 'positive' : unreal < 0 ? 'negative' : 'neutral',
    }),
  );
  root.querySelector('[data-total]').appendChild(
    PnLCell({
      value: total,
      delta: total,
      deltaPct: totalPct,
      size: 'sm',
      direction: total > 0 ? 'positive' : total < 0 ? 'negative' : 'neutral',
    }),
  );

  if (onClick) root.addEventListener('click', onClick);
  return root;
}

function formatNum(n, frac) {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: frac,
    maximumFractionDigits: frac,
  }).format(n);
}

function formatMoney(n) {
  if (n == null || isNaN(n)) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
