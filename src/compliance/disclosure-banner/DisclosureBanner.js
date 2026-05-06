/**
 * Disclosure Banner — compliance component
 *
 * Inline jurisdictional disclosure surface. Three severities map to a
 * three-band escalation pattern (compliant / disclosure-required /
 * blocked). Designed to satisfy ASIC RG 268 "meaningful engagement"
 * test rather than the modal pattern that fails it.
 *
 * @typedef {Object} DisclosureBannerProps
 * @property {'compliant'|'disclosure'|'blocked'} severity
 * @property {string} jurisdiction      e.g. 'EU MiFID II Art 27'
 * @property {string} title
 * @property {string} body
 * @property {string} [citation]        Regulatory citation, mono font
 * @property {string} [actionLabel]     Optional CTA label
 * @property {boolean} [dismissible]    Show close button
 * @property {boolean} [showIcon]
 * @property {(e: Event) => void} [onAction]
 * @property {(e: Event) => void} [onDismiss]
 */

import './disclosure-banner.css';

const ICON_BY_SEVERITY = {
  compliant: '✓',
  disclosure: '!',
  blocked: '×',
};

/**
 * @param {DisclosureBannerProps} props
 * @returns {HTMLDivElement}
 */
export function DisclosureBanner({
  severity = 'compliant',
  jurisdiction = '',
  title = '',
  body = '',
  citation = '',
  actionLabel = '',
  dismissible = false,
  showIcon = true,
  onAction,
  onDismiss,
} = {}) {
  const root = document.createElement('div');
  root.className = `eds-disclosure eds-disclosure--${severity}`;
  root.setAttribute('role', severity === 'blocked' ? 'alert' : 'status');
  root.setAttribute('aria-live', severity === 'blocked' ? 'assertive' : 'polite');

  root.innerHTML = `
    ${showIcon ? `
      <div class="eds-disclosure__icon" aria-hidden="true">
        ${ICON_BY_SEVERITY[severity] || '·'}
      </div>
    ` : ''}
    <div class="eds-disclosure__body">
      ${jurisdiction ? `
        <div class="eds-disclosure__juris">${jurisdiction}</div>
      ` : ''}
      ${title ? `<div class="eds-disclosure__title">${title}</div>` : ''}
      ${body ? `<p class="eds-disclosure__text">${body}</p>` : ''}
      ${citation ? `<code class="eds-disclosure__cite">${citation}</code>` : ''}
    </div>
    ${actionLabel ? `
      <button class="eds-disclosure__action" type="button" data-action>${actionLabel}</button>
    ` : ''}
    ${dismissible ? `
      <button class="eds-disclosure__dismiss" type="button" aria-label="Dismiss" data-dismiss>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
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
