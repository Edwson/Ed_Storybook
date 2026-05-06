/**
 * Alert — inline 4-variant status block
 *
 * Different from Disclosure Banner (which is regulatory/jurisdictional).
 * Alert is a generic semantic notice: form errors, batch results,
 * non-blocking warnings. Four variants:
 *   info     — neutral information
 *   success  — confirmation of an action
 *   warning  — non-blocking caution (default for ambiguity)
 *   danger   — error, blocks progress until acknowledged
 *
 * `role="alert"` on danger; `role="status"` on the other three.
 *
 * @typedef {Object} AlertProps
 * @property {'info'|'success'|'warning'|'danger'} [variant]
 * @property {string} [title]
 * @property {string} body
 * @property {string} [actionLabel]
 * @property {boolean} [dismissible]
 * @property {(e: Event) => void} [onAction]
 * @property {(e: Event) => void} [onDismiss]
 */

import './alert.css';

const ICON_BY_VARIANT = {
  info:    'i',
  success: '✓',
  warning: '!',
  danger:  '×',
};

/**
 * @param {AlertProps} props
 * @returns {HTMLDivElement}
 */
export function Alert({
  variant = 'info',
  title = '',
  body = '',
  actionLabel = '',
  dismissible = false,
  onAction,
  onDismiss,
} = {}) {
  const root = document.createElement('div');
  root.className = `eds-alert eds-alert--${variant}`;
  root.setAttribute('role', variant === 'danger' ? 'alert' : 'status');
  root.setAttribute('aria-live', variant === 'danger' ? 'assertive' : 'polite');

  root.innerHTML = `
    <div class="eds-alert__icon" aria-hidden="true">${ICON_BY_VARIANT[variant] || 'i'}</div>
    <div class="eds-alert__body">
      ${title ? `<div class="eds-alert__title">${title}</div>` : ''}
      ${body ? `<div class="eds-alert__text">${body}</div>` : ''}
    </div>
    ${actionLabel ? `<button class="eds-alert__action" type="button" data-action>${actionLabel}</button>` : ''}
    ${dismissible ? `
      <button class="eds-alert__dismiss" type="button" aria-label="Dismiss" data-dismiss>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    ` : ''}
  `;

  if (onAction) {
    root.querySelector('[data-action]')?.addEventListener('click', onAction);
  }
  if (onDismiss) {
    root.querySelector('[data-dismiss]')?.addEventListener('click', (e) => {
      onDismiss(e);
      root.remove();
    });
  }
  return root;
}
