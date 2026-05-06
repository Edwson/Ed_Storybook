/**
 * FIX State Chip — OrdStatus indicator (FIX 4.4)
 *
 * Renders the FIX 4.4 OrdStatus (tag 39) as a chip with both the
 * single-character code (mono) and the human-readable label. The
 * chip integrates as the status column inside Order Row.
 *
 * Six states are exposed here. The full FIX spec defines more
 * (DoneForDay, Stopped, Suspended, Calculated, Expired, AcceptedForBidding,
 * PendingReplace) but these six cover ~99% of single-broker flow.
 *
 *   pending-new  (A)  — order received, not yet ack'd by venue
 *   new          (0)  — accepted by venue, working in book
 *   partial      (1)  — partially filled (LeavesQty > 0)
 *   filled       (2)  — fully filled (LeavesQty = 0)
 *   canceled     (4)  — cancelled by client or venue
 *   rejected     (8)  — rejected with Text (tag 58) reason
 *
 * Reg / spec context:
 *   - FIX 4.4 protocol spec — OrdStatus tag 39
 *   - SEC 17a-4 — execution records must retain OrdStatus transitions
 *   - FINRA 7440 — OATS reporting hooks off OrdStatus
 *
 * @typedef {'pending-new'|'new'|'partial'|'filled'|'canceled'|'rejected'} FixStatus
 *
 * @typedef {Object} FixStateChipProps
 * @property {FixStatus} status
 * @property {boolean} [showCode]    Show single-char OrdStatus code in front
 * @property {boolean} [compact]     Smaller padding for use inside table rows
 * @property {string} [tooltip]      Optional override for the title attr
 */

import './fix-state-chip.css';

const META = {
  'pending-new': { code: 'A', label: 'Pending New', tone: 'warn',    tooltip: 'OrdStatus A · order received, awaiting venue ack' },
  'new':         { code: '0', label: 'New',         tone: 'info',    tooltip: 'OrdStatus 0 · accepted by venue, working in book' },
  'partial':     { code: '1', label: 'Partial',     tone: 'accent',  tooltip: 'OrdStatus 1 · partially filled, LeavesQty > 0' },
  'filled':      { code: '2', label: 'Filled',      tone: 'success', tooltip: 'OrdStatus 2 · fully filled, LeavesQty = 0' },
  'canceled':    { code: '4', label: 'Canceled',    tone: 'neutral', tooltip: 'OrdStatus 4 · cancelled by client or venue' },
  'rejected':    { code: '8', label: 'Rejected',    tone: 'danger',  tooltip: 'OrdStatus 8 · rejected, see Text (tag 58) for reason' },
};

/**
 * @param {FixStateChipProps} props
 * @returns {HTMLSpanElement}
 */
export function FixStateChip({
  status = 'new',
  showCode = true,
  compact = false,
  tooltip,
} = {}) {
  const meta = META[status] || META.new;
  const root = document.createElement('span');
  root.className = [
    'eds-fix-state',
    `eds-fix-state--${meta.tone}`,
    compact ? 'eds-fix-state--compact' : '',
  ].filter(Boolean).join(' ');
  root.setAttribute('title', tooltip || meta.tooltip);
  root.setAttribute('aria-label', `${meta.label} (FIX OrdStatus ${meta.code})`);

  root.innerHTML = `
    ${showCode ? `<span class="eds-fix-state__code" aria-hidden="true">${meta.code}</span>` : ''}
    <span class="eds-fix-state__label">${meta.label}</span>
  `;
  return root;
}
