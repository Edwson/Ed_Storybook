/**
 * Card — universal surface primitive
 *
 * Card is the standard container for grouped content: case study tiles,
 * KPI panels, info blocks, dashboard cells. It carries no semantics —
 * the content inside does. Three slots (eyebrow / body / footer meta)
 * are optional; a Card with just one slot is still legitimate.
 *
 * Two appearance switches:
 *   - hoverable: lifts on hover (use for interactive cards / links)
 *   - elevated:  uses --shadow-md instead of border-only (use sparingly,
 *                most surfaces lift via border + bg shift, not shadow)
 *
 * Click handlers convert the root to <button>. Pass `href` to convert
 * to <a>. Otherwise it stays as <div>.
 *
 * @typedef {Object} CardProps
 * @property {string} [eyebrow]   Uppercase mono label above the title
 * @property {string} [title]     Display-font heading
 * @property {string} [body]      HTML body content (sanitized by caller)
 * @property {string} [meta]      Footer meta line (mono, tertiary)
 * @property {boolean} [hoverable]
 * @property {boolean} [elevated]
 * @property {string} [href]      If set, renders as <a target="_self">
 * @property {(e: Event) => void} [onClick]
 */

import './card.css';

/**
 * @param {CardProps} props
 * @returns {HTMLElement}
 */
export function Card({
  eyebrow = '',
  title = '',
  body = '',
  meta = '',
  hoverable = false,
  elevated = false,
  href,
  onClick,
} = {}) {
  const tag = href ? 'a' : onClick ? 'button' : 'div';
  const root = document.createElement(tag);
  root.className = [
    'eds-card',
    hoverable || onClick || href ? 'eds-card--hoverable' : '',
    elevated ? 'eds-card--elevated' : '',
  ].filter(Boolean).join(' ');

  if (tag === 'a') {
    root.setAttribute('href', href);
  }
  if (tag === 'button') {
    root.type = 'button';
  }

  root.innerHTML = `
    ${eyebrow ? `<div class="eds-card__eyebrow">${eyebrow}</div>` : ''}
    ${title ? `<div class="eds-card__title">${title}</div>` : ''}
    ${body ? `<div class="eds-card__body">${body}</div>` : ''}
    ${meta ? `<div class="eds-card__meta">${meta}</div>` : ''}
  `;

  if (onClick) {
    root.addEventListener('click', onClick);
  }
  return root;
}
