/**
 * Toast — transient notification.
 *
 * Surface for confirmations (Order #4521 submitted), alerts (FIX session
 * disconnected), state changes (Disclosure rendered to client). Never
 * blocks workflow, always dismissable. Auto-dismisses by default;
 * danger variant stays until user dismisses (institutional convention —
 * a kill-switch trip should not vanish before the trader sees it).
 *
 * @typedef {Object} ToastProps
 * @property {string} title
 * @property {string} [message]
 * @property {'info'|'success'|'warning'|'danger'} [variant]
 * @property {string} [icon]                    Override default glyph
 * @property {Array<{label:string, onClick:Function}>} [actions]
 * @property {boolean} [dismissable]
 * @property {(e: MouseEvent) => void} [onDismiss]
 * @property {string} [role]                    'status' (info) or 'alert' (danger)
 */

import './toast.css';

const ICONS = {
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="0.5" fill="currentColor"/></svg>',
  success: '<svg viewBox="0 0 24 24"><polyline points="5 12 10 17 19 7"/></svg>',
  warning: '<svg viewBox="0 0 24 24"><path d="M12 4 L22 20 L2 20 Z"/><line x1="12" y1="10" x2="12" y2="14"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>',
  danger: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>',
};

/**
 * @param {ToastProps} props
 * @returns {HTMLDivElement}
 */
export function Toast({
  title = '',
  message = '',
  variant = 'info',
  icon = '',
  actions = [],
  dismissable = true,
  onDismiss = null,
  role = '',
} = {}) {
  const root = document.createElement('div');
  root.className = `eds-toast eds-toast--${variant}`;

  // Variant-default ARIA role: alert for danger/warning (assertive),
  // status for info/success (polite).
  const computedRole = role || (variant === 'danger' || variant === 'warning' ? 'alert' : 'status');
  root.setAttribute('role', computedRole);
  root.setAttribute('aria-live', computedRole === 'alert' ? 'assertive' : 'polite');

  const iconHtml = icon || ICONS[variant] || ICONS.info;
  let html = `<span class="eds-toast__icon" aria-hidden="true">${iconHtml}</span>`;
  html += `<div class="eds-toast__body">`;
  html += `<span class="eds-toast__title">${title}</span>`;
  if (message) html += `<span class="eds-toast__message">${message}</span>`;
  if (actions && actions.length) {
    html += `<div class="eds-toast__actions">`;
    actions.forEach((a, i) => {
      html += `<button type="button" class="eds-toast__action" data-action-idx="${i}">${a.label}</button>`;
    });
    html += `</div>`;
  }
  html += `</div>`;
  if (dismissable) {
    html += `<button type="button" class="eds-toast__close" aria-label="Dismiss notification">×</button>`;
  }
  root.innerHTML = html;

  // Wire action handlers.
  root.querySelectorAll('.eds-toast__action').forEach((btn) => {
    const idx = Number(btn.dataset.actionIdx);
    if (actions[idx] && actions[idx].onClick) {
      btn.addEventListener('click', actions[idx].onClick);
    }
  });

  // Wire dismiss.
  if (dismissable) {
    const closeBtn = root.querySelector('.eds-toast__close');
    closeBtn.addEventListener('click', (e) => {
      if (onDismiss) onDismiss(e);
      else root.remove();
    });
  }

  return root;
}

/**
 * Mount a positioned stack container if you want to wire toasts up
 * to a real notification queue. Returns an element you can append toasts to.
 *
 * @param {'top-right'|'top-left'|'bottom-right'|'bottom-left'} [position]
 * @returns {HTMLDivElement}
 */
export function ToastStack(position = 'top-right') {
  const stack = document.createElement('div');
  stack.className = `eds-toast-stack eds-toast-stack--${position}`;
  return stack;
}
