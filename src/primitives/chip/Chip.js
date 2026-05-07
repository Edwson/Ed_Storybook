/**
 * Chip — interactive selectable / removable element.
 *
 * Used for filter pills, tag inputs, faceted search, watchlist symbols.
 * Differs from Badge: chip is a CONTROL (selectable, dismissable),
 * badge is a DISPLAY indicator (status only, not interactive).
 *
 * @typedef {Object} ChipProps
 * @property {string} label
 * @property {boolean} [selected]            Selected (toggle / filter active)
 * @property {boolean} [disabled]
 * @property {boolean} [removable]           Show dismiss button
 * @property {string} [icon]                 Leading glyph / SVG string
 * @property {number|string} [count]         Trailing numeric badge
 * @property {'sm'|'md'|'lg'} [size]
 * @property {(e: MouseEvent) => void} [onClick]
 * @property {(e: MouseEvent) => void} [onRemove]
 * @property {string} [ariaLabel]
 */

import './chip.css';

/**
 * @param {ChipProps} props
 * @returns {HTMLButtonElement | HTMLSpanElement}
 */
export function Chip({
  label = '',
  selected = false,
  disabled = false,
  removable = false,
  icon = '',
  count = null,
  size = 'md',
  onClick = null,
  onRemove = null,
  ariaLabel = '',
} = {}) {
  // Use <button> when interactive, <span> when purely display-as-tag.
  const isInteractive = !!onClick || !removable;
  const tag = isInteractive && !removable ? 'button' : 'span';
  const root = document.createElement(tag);

  root.className = [
    'eds-chip',
    `eds-chip--${size}`,
    selected ? 'eds-chip--selected' : '',
  ].filter(Boolean).join(' ');

  if (tag === 'button') {
    root.type = 'button';
    if (onClick) root.addEventListener('click', onClick);
  }
  if (disabled) root.setAttribute('aria-disabled', 'true');
  if (selected) root.setAttribute('aria-pressed', 'true');
  if (ariaLabel) root.setAttribute('aria-label', ariaLabel);

  let html = '';
  if (icon) html += `<span class="eds-chip__icon" aria-hidden="true">${icon}</span>`;
  html += `<span class="eds-chip__label">${label}</span>`;
  if (count !== null && count !== '') {
    html += `<span class="eds-chip__count" aria-label="${count} items">${count}</span>`;
  }
  if (removable) {
    html += `<button type="button" class="eds-chip__close" aria-label="Remove ${label}">×</button>`;
  }
  root.innerHTML = html;

  if (removable) {
    const closeBtn = root.querySelector('.eds-chip__close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (disabled) return;
      if (onRemove) onRemove(e);
      else root.remove();
    });
  }

  return root;
}
