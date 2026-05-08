/**
 * Progress — linear progress bar with semantic variants and rich label modes.
 *
 * Used for KYC step progress, risk utilisation, regime confidence, capacity
 * meters, file-upload state. Tabular-nums on the readout. Indeterminate mode
 * runs an aria-friendly stripe loop for unknown-duration work (e.g. waiting
 * on a FIX session ack).
 *
 * @typedef {Object} ProgressProps
 * @property {number} [value]                   default 0
 * @property {number} [max]                     default 100
 * @property {'default'|'success'|'warning'|'danger'|'info'} [variant]
 * @property {'sm'|'md'|'lg'} [size]            default 'md'
 * @property {boolean} [striped]                static stripe overlay
 * @property {boolean} [animated]               animate the stripes
 * @property {boolean} [indeterminate]          unknown duration
 * @property {boolean} [showValue]              render value text
 * @property {'inside'|'outside-right'|'outside-left'|'top'} [valuePosition]
 * @property {string} [label]                   leading description
 * @property {string} [valueFormat]             '%' | 'fraction' | custom: e.g. '/' or 'of'
 * @property {string} [helperText]              muted line below
 * @property {string} [ariaLabel]
 */

import './progress.css';

export function Progress({
  value = 0,
  max = 100,
  variant = 'default',
  size = 'md',
  striped = false,
  animated = false,
  indeterminate = false,
  showValue = true,
  valuePosition = 'outside-right',
  label = '',
  valueFormat = '%',
  helperText = '',
  ariaLabel = '',
} = {}) {
  const root = document.createElement('div');
  root.className = [
    'eds-progress',
    `eds-progress--${size}`,
    `eds-progress--${variant}`,
    striped ? 'eds-progress--striped' : '',
    animated ? 'eds-progress--animated' : '',
    indeterminate ? 'eds-progress--indeterminate' : '',
  ].filter(Boolean).join(' ');

  const v = Math.max(0, Math.min(value, max));
  const pct = max === 0 ? 0 : (v / max) * 100;
  const labelText = formatValue(v, max, valueFormat);

  const headBits = [];
  if (label) headBits.push(`<span class="eds-progress__label">${label}</span>`);
  if (showValue && (valuePosition === 'top' || valuePosition === 'outside-right' || valuePosition === 'outside-left')) {
    headBits.push(`<span class="eds-progress__value">${labelText}</span>`);
  }

  const head = headBits.length
    ? `<div class="eds-progress__head eds-progress__head--${valuePosition}">${headBits.join('')}</div>`
    : '';

  const inside =
    showValue && valuePosition === 'inside' && !indeterminate
      ? `<span class="eds-progress__value-inside">${labelText}</span>`
      : '';

  root.innerHTML = `
    ${head}
    <div class="eds-progress__track"
         role="progressbar"
         aria-valuemin="0"
         aria-valuemax="${max}"
         aria-valuenow="${indeterminate ? '' : v}"
         aria-label="${ariaLabel || label || 'progress'}"
         ${indeterminate ? 'aria-busy="true"' : ''}>
      <div class="eds-progress__fill" style="--progress-pp:${indeterminate ? 30 : pct}%">${inside}</div>
    </div>
    ${helperText ? `<div class="eds-progress__helper">${helperText}</div>` : ''}
  `;

  return root;
}

function formatValue(v, max, fmt) {
  if (fmt === '%') {
    if (max === 0) return '0%';
    return `${Math.round((v / max) * 100)}%`;
  }
  if (fmt === 'fraction') return `${v} / ${max}`;
  if (typeof fmt === 'string') return `${v} ${fmt} ${max}`;
  return `${v}`;
}
