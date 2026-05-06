/**
 * Radio Group — institutional primitive
 *
 * Renders a group of native `<input type="radio">` elements wrapped in
 * styled labels. Native under the hood = best a11y, free keyboard
 * navigation (←/→/↑/↓ within group, Tab between groups).
 *
 * Use Radio when *exactly one* of N options must be chosen. Use
 * Checkbox group when zero or more can be chosen. Use Select when
 * options exceed ~5 (Radio gets visually heavy).
 *
 * @typedef {Object} RadioOption
 * @property {string} value
 * @property {string} label
 * @property {string} [helper]      Per-option helper text
 * @property {boolean} [disabled]
 *
 * @typedef {Object} RadioGroupProps
 * @property {string} name                    Required (HTML radio grouping)
 * @property {string} [legend]                Group label (rendered as <legend>)
 * @property {RadioOption[]} options
 * @property {string} [value]                 Selected value
 * @property {'vertical'|'horizontal'} [orientation]
 * @property {boolean} [disabled]             Disable entire group
 * @property {string} [helper]                Group helper text
 * @property {string} [error]                 Group error text
 * @property {(e: Event) => void} [onChange]
 */

import './radio.css';

let _idCounter = 0;
const nextId = () => `eds-rg-${++_idCounter}`;

/**
 * @param {RadioGroupProps} props
 * @returns {HTMLFieldSetElement}
 */
export function RadioGroup({
  name = '',
  legend = '',
  options = [],
  value = '',
  orientation = 'vertical',
  disabled = false,
  helper = '',
  error = '',
  onChange,
} = {}) {
  if (!name) name = nextId();
  const helperId = `${name}-helper`;

  const fs = document.createElement('fieldset');
  fs.className = [
    'eds-radio-group',
    `eds-radio-group--${orientation}`,
    error ? 'eds-radio-group--error' : '',
    disabled ? 'eds-radio-group--disabled' : '',
  ].filter(Boolean).join(' ');
  if (disabled) fs.disabled = true;
  if (helper || error) fs.setAttribute('aria-describedby', helperId);

  const legendHtml = legend
    ? `<legend class="eds-radio-group__legend">${legend}</legend>`
    : '';

  const optsHtml = options.map((opt, i) => {
    const id = `${name}-${i}`;
    const checked = opt.value === value;
    return `
      <label class="eds-radio ${opt.disabled ? 'eds-radio--disabled' : ''}" for="${id}">
        <input type="radio"
               class="eds-radio__input"
               id="${id}"
               name="${name}"
               value="${escapeAttr(opt.value)}"
               ${checked ? 'checked' : ''}
               ${opt.disabled ? 'disabled' : ''} />
        <span class="eds-radio__indicator" aria-hidden="true">
          <span class="eds-radio__dot"></span>
        </span>
        <span class="eds-radio__body">
          <span class="eds-radio__label">${escapeHtml(opt.label)}</span>
          ${opt.helper ? `<span class="eds-radio__helper">${escapeHtml(opt.helper)}</span>` : ''}
        </span>
      </label>
    `;
  }).join('');

  fs.innerHTML = `
    ${legendHtml}
    <div class="eds-radio-group__list">
      ${optsHtml}
    </div>
    ${(helper || error) ? `
      <div class="eds-radio-group__helper" id="${helperId}" ${error ? 'role="alert"' : ''}>
        ${error || helper}
      </div>
    ` : ''}
  `;

  if (onChange) {
    fs.addEventListener('change', onChange);
  }
  return fs;
}

function escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeHtml(s) {
  return String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
