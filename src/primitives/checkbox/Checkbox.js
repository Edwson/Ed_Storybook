/**
 * Checkbox — institutional primitive
 *
 * Native `<input type="checkbox">` with custom indicator drawn via CSS.
 * Supports indeterminate state (used in tree/table master rows). Label
 * is part of the same hit area for usability + keyboard.
 *
 * @typedef {Object} CheckboxProps
 * @property {string} [id]
 * @property {string} label
 * @property {string} [helper]      Helper text below the label
 * @property {boolean} [checked]
 * @property {boolean} [indeterminate]
 * @property {boolean} [disabled]
 * @property {string} [name]
 * @property {string} [value]
 * @property {(e: Event) => void} [onChange]
 */

import './checkbox.css';

let _idCounter = 0;
const nextId = () => `eds-cb-${++_idCounter}`;

/**
 * @param {CheckboxProps} props
 * @returns {HTMLLabelElement}
 */
export function Checkbox({
  id,
  label = '',
  helper = '',
  checked = false,
  indeterminate = false,
  disabled = false,
  name = '',
  value = '',
  onChange,
} = {}) {
  const labelEl = document.createElement('label');
  const cbId = id || nextId();
  labelEl.className = `eds-checkbox ${disabled ? 'eds-checkbox--disabled' : ''}`;
  labelEl.setAttribute('for', cbId);

  labelEl.innerHTML = `
    <input type="checkbox"
           id="${cbId}"
           class="eds-checkbox__input"
           ${checked ? 'checked' : ''}
           ${disabled ? 'disabled' : ''}
           ${name ? `name="${name}"` : ''}
           ${value ? `value="${value}"` : ''} />
    <span class="eds-checkbox__indicator" aria-hidden="true">
      <svg class="eds-checkbox__check" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12l5 5L20 7"/>
      </svg>
      <svg class="eds-checkbox__dash" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <path d="M6 12h12"/>
      </svg>
    </span>
    <span class="eds-checkbox__body">
      <span class="eds-checkbox__label">${label}</span>
      ${helper ? `<span class="eds-checkbox__helper">${helper}</span>` : ''}
    </span>
  `;

  const input = labelEl.querySelector('input');
  if (indeterminate) input.indeterminate = true;
  if (onChange) input.addEventListener('change', onChange);
  return labelEl;
}
