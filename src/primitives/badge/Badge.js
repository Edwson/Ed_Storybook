/**
 * Badge — institutional status pill
 *
 * Five semantic variants (neutral · accent · success · warning · danger)
 * × three sizes × optional dot, glyph, or count. Tabular-nums on count
 * variant so `12 / 25` style fragments align across rows.
 *
 * @typedef {Object} BadgeProps
 * @property {string} label
 * @property {'neutral'|'accent'|'success'|'warning'|'danger'|'info'} [variant]
 * @property {'subtle'|'solid'|'outline'} [appearance]
 * @property {'sm'|'md'|'lg'} [size]
 * @property {boolean} [dot]              Leading status dot (no glyph)
 * @property {string} [glyph]             Leading character / SVG (overrides dot)
 * @property {boolean} [uppercase]        Force uppercase + tracked label
 */

import './badge.css';

/**
 * @param {BadgeProps} props
 * @returns {HTMLSpanElement}
 */
export function Badge({
  label = '',
  variant = 'neutral',
  appearance = 'subtle',
  size = 'md',
  dot = false,
  glyph = '',
  uppercase = false,
} = {}) {
  const root = document.createElement('span');
  root.className = [
    'eds-badge',
    `eds-badge--${variant}`,
    `eds-badge--${appearance}`,
    `eds-badge--${size}`,
    uppercase ? 'eds-badge--uppercase' : '',
  ].filter(Boolean).join(' ');

  root.innerHTML = `
    ${glyph ? `<span class="eds-badge__glyph" aria-hidden="true">${glyph}</span>` :
      dot ? `<span class="eds-badge__dot" aria-hidden="true"></span>` : ''}
    <span class="eds-badge__label">${label}</span>
  `;
  return root;
}
