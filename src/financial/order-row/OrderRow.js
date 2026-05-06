/**
 * Order Row — institutional blotter row
 *
 * The atom of every execution surface. 11 columns at default
 * width — Time / OrderID / Symbol / Side / Type / Qty / Limit /
 * Stop / TIF / Status / Fill — fixed-px grid so dot positions and
 * percent signs align across rows. Tabular-nums on every numeric.
 *
 * Side glyph (▲ BUY / ▼ SELL) pairs colour with direction so deuteranopia
 * users still parse the row at a glance. Status column reuses
 * FixStateChip in compact mode.
 *
 * Width budget (1100px desktop):
 *   80   60   80   60   60   60   80   80   60   116    140
 *   time id   sym  side type qty  lim  stop tif  status fill
 *
 * On viewports below 900px the row collapses to a stacked card —
 * this is the same pattern Bloomberg PORT / Stripe Dashboard use.
 *
 * @typedef {Object} OrderRowProps
 * @property {string} time             HH:MM:SS.mmm
 * @property {string} id               ClOrdID (truncated to last 6)
 * @property {string} symbol
 * @property {'buy'|'sell'} side
 * @property {'MKT'|'LMT'|'STP'|'STL'|'TWAP'|'VWAP'|'IOC'|'FOK'} [type]
 * @property {number} qty
 * @property {number} [limit]
 * @property {number} [stop]
 * @property {'DAY'|'GTC'|'IOC'|'FOK'|'GTD'} [tif]
 * @property {'pending-new'|'new'|'partial'|'filled'|'canceled'|'rejected'} status
 * @property {number} [filledQty]      For partial / filled rows
 * @property {number} [avgFillPx]      For partial / filled rows
 * @property {string} [rejectReason]   For rejected rows
 * @property {boolean} [interactive]   Hover lift
 * @property {(e: Event) => void} [onClick]
 */

import { FixStateChip } from '../../compliance/fix-state-chip/FixStateChip.js';
import './order-row.css';

const SIDE_GLYPH = { buy: '▲', sell: '▼' };

/**
 * @param {OrderRowProps} props
 * @returns {HTMLElement}
 */
export function OrderRow({
  time = '',
  id = '',
  symbol = '',
  side = 'buy',
  type = 'MKT',
  qty = 0,
  limit,
  stop,
  tif = 'DAY',
  status = 'new',
  filledQty,
  avgFillPx,
  rejectReason = '',
  interactive = false,
  onClick,
} = {}) {
  const tag = onClick ? 'button' : 'div';
  const root = document.createElement(tag);
  root.className = [
    'eds-orow',
    `eds-orow--${side}`,
    interactive || onClick ? 'eds-orow--interactive' : '',
    status === 'rejected' ? 'eds-orow--rejected' : '',
    status === 'filled' ? 'eds-orow--filled' : '',
  ].filter(Boolean).join(' ');
  if (tag === 'button') root.type = 'button';

  root.setAttribute(
    'aria-label',
    `${side.toUpperCase()} ${qty} ${symbol} ${type} order, ${status}`,
  );

  const fillCell = renderFillCell({ status, filledQty, qty, avgFillPx, rejectReason });

  root.innerHTML = `
    <span class="eds-orow__time">${escapeHtml(time)}</span>
    <span class="eds-orow__id" title="ClOrdID full">${escapeHtml(id)}</span>
    <span class="eds-orow__sym">${escapeHtml(symbol)}</span>
    <span class="eds-orow__side">
      <span class="eds-orow__glyph" aria-hidden="true">${SIDE_GLYPH[side] || ''}</span>
      <span class="eds-orow__side-label">${side.toUpperCase()}</span>
    </span>
    <span class="eds-orow__type">${escapeHtml(type)}</span>
    <span class="eds-orow__qty">${formatNum(qty, 0)}</span>
    <span class="eds-orow__limit">${limit != null ? formatNum(limit, 2) : '—'}</span>
    <span class="eds-orow__stop">${stop != null ? formatNum(stop, 2) : '—'}</span>
    <span class="eds-orow__tif">${escapeHtml(tif)}</span>
    <span class="eds-orow__status" data-status></span>
    <span class="eds-orow__fill">${fillCell}</span>
  `;

  // Mount FixStateChip into status cell.
  root
    .querySelector('[data-status]')
    .appendChild(FixStateChip({ status, compact: true }));

  if (onClick) root.addEventListener('click', onClick);
  return root;
}

function renderFillCell({ status, filledQty, qty, avgFillPx, rejectReason }) {
  if (status === 'rejected') {
    return `<span class="eds-orow__reject" title="${escapeAttr(rejectReason || 'rejected')}">${escapeHtml(rejectReason || 'see Text 58')}</span>`;
  }
  if (status === 'filled' || status === 'partial') {
    const fq = filledQty != null ? filledQty : qty;
    const px = avgFillPx != null ? avgFillPx : 0;
    const pct = qty > 0 ? Math.round((fq / qty) * 100) : 0;
    return `<span class="eds-orow__fill-num">${formatNum(fq, 0)} @ ${formatNum(px, 2)}</span><span class="eds-orow__fill-pct">${pct}%</span>`;
  }
  if (status === 'canceled') return `<span class="eds-orow__muted">cancelled</span>`;
  if (status === 'pending-new') return `<span class="eds-orow__muted">awaiting ack</span>`;
  return `<span class="eds-orow__muted">working</span>`;
}

function formatNum(n, frac) {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: frac,
    maximumFractionDigits: frac,
  }).format(n);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
