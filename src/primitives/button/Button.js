/**
 * Button — institutional primitive
 *
 * Five variants, three sizes, three states. Token-driven, BEM, no inline
 * styles other than CSS custom property injection (which is not styling,
 * it's data — the same Stripe / Linear pattern).
 *
 * @typedef {Object} ButtonProps
 * @property {string} label
 * @property {'primary'|'secondary'|'ghost'|'danger'|'link'} [variant]
 * @property {'sm'|'md'|'lg'} [size]
 * @property {boolean} [disabled]
 * @property {boolean} [loading]
 * @property {boolean} [block]
 * @property {string} [iconLeft]   inline SVG string
 * @property {string} [iconRight]  inline SVG string
 * @property {(e: MouseEvent) => void} [onClick]
 */

import './button.css';

/**
 * Renders a Button DOM element.
 * @param {ButtonProps} props
 * @returns {HTMLButtonElement}
 */
export function Button({
  label = 'Button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  block = false,
  iconLeft = '',
  iconRight = '',
  onClick,
} = {}) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = [
    'eds-btn',
    `eds-btn--${variant}`,
    `eds-btn--${size}`,
    block ? 'eds-btn--block' : '',
    loading ? 'eds-btn--loading' : '',
  ].filter(Boolean).join(' ');

  if (disabled || loading) {
    btn.disabled = true;
    btn.setAttribute('aria-disabled', 'true');
  }
  if (loading) {
    btn.setAttribute('aria-busy', 'true');
  }

  btn.innerHTML = `
    ${iconLeft ? `<span class="eds-btn__icon">${iconLeft}</span>` : ''}
    <span class="eds-btn__label">${label}</span>
    ${iconRight ? `<span class="eds-btn__icon">${iconRight}</span>` : ''}
    ${loading ? '<span class="eds-btn__spinner" aria-hidden="true"></span>' : ''}
  `;

  if (onClick) {
    btn.addEventListener('click', onClick);
  }
  return btn;
}
