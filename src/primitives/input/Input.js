/**
 * Input — institutional form primitive
 *
 * Three sizes, four states (default · focus · error · disabled),
 * support for prefix / suffix slots (currency, ticker, unit), helper
 * text, and a counter for character limits.
 *
 * @typedef {Object} InputProps
 * @property {string} [id]
 * @property {string} [label]
 * @property {string} [value]
 * @property {string} [placeholder]
 * @property {string} [type]            HTML input type
 * @property {'sm'|'md'|'lg'} [size]
 * @property {string} [prefix]          Leading slot (e.g., '$', 'USD')
 * @property {string} [suffix]          Trailing slot (e.g., 'shares', 'bps')
 * @property {string} [helper]          Helper / hint text
 * @property {string} [error]           Error text (overrides helper)
 * @property {boolean} [disabled]
 * @property {boolean} [readonly]
 * @property {boolean} [required]
 * @property {number} [maxLength]
 */

import './input.css';

let _idCounter = 0;
const nextId = () => `eds-input-${++_idCounter}`;

/**
 * @param {InputProps} props
 * @returns {HTMLDivElement}
 */
export function Input({
  id,
  label,
  value = '',
  placeholder = '',
  type = 'text',
  size = 'md',
  prefix = '',
  suffix = '',
  helper = '',
  error = '',
  disabled = false,
  readonly = false,
  required = false,
  maxLength,
} = {}) {
  const wrap = document.createElement('div');
  const inputId = id || nextId();
  const helperId = `${inputId}-helper`;

  wrap.className = [
    'eds-field',
    `eds-field--${size}`,
    error ? 'eds-field--error' : '',
    disabled ? 'eds-field--disabled' : '',
  ].filter(Boolean).join(' ');

  wrap.innerHTML = `
    ${label ? `
      <label class="eds-field__label" for="${inputId}">
        ${label}${required ? ' <span class="eds-field__req" aria-hidden="true">*</span>' : ''}
      </label>
    ` : ''}
    <div class="eds-field__control">
      ${prefix ? `<span class="eds-field__affix eds-field__affix--prefix">${prefix}</span>` : ''}
      <input
        class="eds-field__input"
        id="${inputId}"
        type="${type}"
        value="${escapeAttr(value)}"
        placeholder="${escapeAttr(placeholder)}"
        ${disabled ? 'disabled' : ''}
        ${readonly ? 'readonly' : ''}
        ${required ? 'required aria-required="true"' : ''}
        ${maxLength != null ? `maxlength="${maxLength}"` : ''}
        ${(helper || error) ? `aria-describedby="${helperId}"` : ''}
        ${error ? 'aria-invalid="true"' : ''}
      />
      ${suffix ? `<span class="eds-field__affix eds-field__affix--suffix">${suffix}</span>` : ''}
    </div>
    ${(helper || error) ? `
      <div class="eds-field__helper" id="${helperId}" ${error ? 'role="alert"' : ''}>
        ${error || helper}
      </div>
    ` : ''}
  `;

  return wrap;
}

function escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
