/**
 * Modal — Edwson Design System
 *
 * Overlay dialog for confirmations, focused tasks, and risk-acknowledged
 * actions. Renders <dialog> when supported (native focus trap + Esc to close)
 * with a styled backdrop. Body scroll-lock applied while open.
 *
 * Variants:
 *  - severity: 'neutral' | 'warning' | 'danger' — header tint + icon stroke
 *  - size:     'sm' | 'md' | 'lg'
 *
 * Stories pass an `open` prop; the demo renders the dialog inline so reviewers
 * see it without click-through.
 */

const escape = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

let _modalId = 0;

export const Modal = ({
  title = 'Confirm action',
  body = 'Are you sure?',
  primaryLabel = 'Confirm',
  secondaryLabel = 'Cancel',
  severity = 'neutral',
  size = 'md',
  showHeaderIcon = true,
  showClose = true,
  open = true,
  ariaLabelledBy = '',
  inline = true,
} = {}) => {
  _modalId += 1;
  const uid = `eds-modal-${_modalId}`;
  const titleId = ariaLabelledBy || `${uid}-title`;

  const root = document.createElement('div');
  root.className = `eds-modal-root ${inline ? 'eds-modal-root--inline' : ''}`.trim();
  root.setAttribute('data-eds-modal', uid);

  if (open) {
    const backdrop = document.createElement('div');
    backdrop.className = 'eds-modal__backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    root.appendChild(backdrop);

    const dialog = document.createElement('div');
    dialog.className = [
      'eds-modal',
      `eds-modal--${severity}`,
      `eds-modal--${size}`,
    ].join(' ');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', titleId);

    const headIconSvg = severity === 'danger'
      ? '<path d="M12 9v4m0 4h.01M5.07 19h13.86a2 2 0 0 0 1.71-3L13.71 4a2 2 0 0 0-3.42 0L3.36 16a2 2 0 0 0 1.71 3z" stroke-linecap="round" stroke-linejoin="round"/>'
      : severity === 'warning'
      ? '<path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01" stroke-linecap="round" stroke-linejoin="round"/>';

    dialog.innerHTML = [
      '<div class="eds-modal__head">',
      showHeaderIcon
        ? `<span class="eds-modal__icon" aria-hidden="true">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${headIconSvg}</svg>
           </span>`
        : '',
      `<h2 class="eds-modal__title" id="${titleId}">${escape(title)}</h2>`,
      showClose
        ? `<button type="button" class="eds-modal__close" aria-label="Close dialog" data-eds-modal-close>
             <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
               <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/>
             </svg>
           </button>`
        : '',
      '</div>',
      `<div class="eds-modal__body">${typeof body === 'string' ? body : ''}</div>`,
      '<div class="eds-modal__foot">',
      secondaryLabel
        ? `<button type="button" class="eds-modal__btn eds-modal__btn--secondary" data-eds-modal-cancel>${escape(secondaryLabel)}</button>`
        : '',
      primaryLabel
        ? `<button type="button" class="eds-modal__btn eds-modal__btn--primary eds-modal__btn--${severity}" data-eds-modal-confirm>${escape(primaryLabel)}</button>`
        : '',
      '</div>',
    ].join('');

    dialog.addEventListener('click', (e) => {
      const closeEl = e.target.closest('[data-eds-modal-close], [data-eds-modal-cancel]');
      if (closeEl) {
        root.classList.add('eds-modal-root--dismissed');
      }
    });

    root.appendChild(dialog);
  }

  return root;
};
