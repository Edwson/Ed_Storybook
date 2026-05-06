/**
 * Toggle — institutional on/off switch
 *
 * Distinct from Checkbox: a Toggle commits *immediately*, a Checkbox
 * commits on form submit. Use Toggle for binary settings that take
 * effect right away (e.g., live ticks · paper mode · auto-route).
 *
 * @typedef {Object} ToggleProps
 * @property {string} [id]
 * @property {string} label
 * @property {string} [onLabel]    Optional state-bound on label (e.g., 'Live')
 * @property {string} [offLabel]   Optional state-bound off label
 * @property {string} [helper]
 * @property {boolean} [checked]
 * @property {boolean} [disabled]
 * @property {'sm'|'md'} [size]
 * @property {(e: Event) => void} [onChange]
 */

import './toggle.css';

let _idCounter = 0;
const nextId = () => `eds-tg-${++_idCounter}`;

/**
 * @param {ToggleProps} props
 * @returns {HTMLLabelElement}
 */
export function Toggle({
  id,
  label = '',
  onLabel = '',
  offLabel = '',
  helper = '',
  checked = false,
  disabled = false,
  size = 'md',
  onChange,
} = {}) {
  const labelEl = document.createElement('label');
  const tgId = id || nextId();
  labelEl.className = [
    'eds-toggle',
    `eds-toggle--${size}`,
    disabled ? 'eds-toggle--disabled' : '',
  ].filter(Boolean).join(' ');
  labelEl.setAttribute('for', tgId);

  labelEl.innerHTML = `
    <span class="eds-toggle__body">
      <span class="eds-toggle__label">${label}</span>
      ${helper ? `<span class="eds-toggle__helper">${helper}</span>` : ''}
      ${(onLabel || offLabel) ? `
        <span class="eds-toggle__state-label" data-state-label>
          ${checked ? (onLabel || 'On') : (offLabel || 'Off')}
        </span>
      ` : ''}
    </span>
    <span class="eds-toggle__switch">
      <input type="checkbox"
             role="switch"
             id="${tgId}"
             class="eds-toggle__input"
             ${checked ? 'checked' : ''}
             ${disabled ? 'disabled' : ''} />
      <span class="eds-toggle__track" aria-hidden="true">
        <span class="eds-toggle__thumb"></span>
      </span>
    </span>
  `;

  const input = labelEl.querySelector('input');
  const stateLabel = labelEl.querySelector('[data-state-label]');
  if (stateLabel || onChange) {
    input.addEventListener('change', (e) => {
      if (stateLabel) {
        stateLabel.textContent = e.target.checked ? (onLabel || 'On') : (offLabel || 'Off');
      }
      if (onChange) onChange(e);
    });
  }
  return labelEl;
}
