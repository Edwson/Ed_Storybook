/**
 * KYC Step — single step in a multi-step KYC / EDD flow
 *
 * Each step is one of:
 *   pending  — not yet reachable; visually muted
 *   active   — current step, highlighted with accent ring
 *   complete — done, checkmark, time-stamped
 *   blocked  — failed validation or compliance gate; needs action
 *
 * Step number, title, helper text, optional regulatory citation, and
 * optional action button (e.g., "Upload passport"). Use as a row inside
 * a Stepper or as standalone progress indicators in onboarding flows.
 *
 * Real anchor: this is the same shape used in the field note
 * "Why KYC Drop-Off Spikes at EDD" — every step shows progress
 * + the regulation it satisfies, so users see the *why*.
 *
 * @typedef {'pending'|'active'|'complete'|'blocked'} KycStatus
 *
 * @typedef {Object} KycStepProps
 * @property {number} index               1-indexed step number
 * @property {KycStatus} [status]
 * @property {string} title
 * @property {string} [helper]
 * @property {string} [citation]          E.g. "31 CFR 1010.230 · UBO"
 * @property {string} [completedAt]       Human-readable timestamp
 * @property {string} [actionLabel]
 * @property {(e: Event) => void} [onAction]
 */

import './kyc-step.css';

const STATUS_LABEL = {
  pending: 'Pending',
  active: 'In progress',
  complete: 'Complete',
  blocked: 'Action required',
};

/**
 * @param {KycStepProps} props
 * @returns {HTMLElement}
 */
export function KycStep({
  index = 1,
  status = 'pending',
  title = '',
  helper = '',
  citation = '',
  completedAt = '',
  actionLabel = '',
  onAction,
} = {}) {
  const root = document.createElement('div');
  root.className = `eds-kyc eds-kyc--${status}`;
  root.setAttribute('role', 'group');
  root.setAttribute('aria-label', `Step ${index} · ${title} · ${STATUS_LABEL[status] || ''}`);

  let glyph = String(index);
  if (status === 'complete') glyph = '✓';
  else if (status === 'blocked') glyph = '!';

  root.innerHTML = `
    <div class="eds-kyc__num" aria-hidden="true">${glyph}</div>
    <div class="eds-kyc__body">
      <div class="eds-kyc__head">
        <span class="eds-kyc__title">${title}</span>
        <span class="eds-kyc__status">${STATUS_LABEL[status] || ''}${completedAt ? ` · ${completedAt}` : ''}</span>
      </div>
      ${helper ? `<div class="eds-kyc__helper">${helper}</div>` : ''}
      ${citation ? `<code class="eds-kyc__cite">${citation}</code>` : ''}
    </div>
    ${actionLabel && status !== 'complete' ? `
      <button class="eds-kyc__action" type="button" data-action>${actionLabel}</button>
    ` : ''}
  `;

  if (onAction) {
    root.querySelector('[data-action]')?.addEventListener('click', onAction);
  }
  return root;
}
