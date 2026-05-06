/**
 * Select — institutional dropdown primitive
 *
 * Native `<select>` underneath (best a11y baseline) wrapped in
 * institutional chrome that matches the Input field. Three sizes,
 * four states, prefix/suffix slot for unit/category labels.
 *
 * @typedef {Object} SelectOption
 * @property {string} value
 * @property {string} label
 * @property {string} [group]    Optional <optgroup> label
 * @property {boolean} [disabled]
 *
 * @typedef {Object} SelectProps
 * @property {string} [id]
 * @property {string} [label]
 * @property {SelectOption[]} options
 * @property {string} [value]
 * @property {string} [placeholder]
 * @property {'sm'|'md'|'lg'} [size]
 * @property {string} [helper]
 * @property {string} [error]
 * @property {boolean} [disabled]
 * @property {boolean} [required]
 */

import './select.css';

let _idCounter = 0;
const nextId = () => `eds-select-${++_idCounter}`;

/**
 * @param {SelectProps} props
 * @returns {HTMLDivElement}
 */
export function Select({
  id,
  label,
  options = [],
  value = '',
  placeholder = 'Select…',
  size = 'md',
  helper = '',
  error = '',
  disabled = false,
  required = false,
} = {}) {
  const wrap = document.createElement('div');
  const selectId = id || nextId();
  const helperId = `${selectId}-helper`;

  wrap.className = [
    'eds-select',
    `eds-select--${size}`,
    error ? 'eds-select--error' : '',
    disabled ? 'eds-select--disabled' : '',
  ].filter(Boolean).join(' ');

  // Group options by their `group` attribute (preserve insertion order).
  const grouped = new Map();
  options.forEach((opt) => {
    const g = opt.group || '';
    if (!grouped.has(g)) grouped.set(g, []);
    grouped.get(g).push(opt);
  });

  const renderOpt = (opt) => `
    <option value="${escapeAttr(opt.value)}"
            ${opt.value === value ? 'selected' : ''}
            ${opt.disabled ? 'disabled' : ''}>
      ${escapeHtml(opt.label)}
    </option>
  `;

  let optionsHtml = '';
  grouped.forEach((items, g) => {
    if (g) {
      optionsHtml += `<optgroup label="${escapeAttr(g)}">${items.map(renderOpt).join('')}</optgroup>`;
    } else {
      optionsHtml += items.map(renderOpt).join('');
    }
  });

  wrap.innerHTML = `
    ${label ? `
      <label class="eds-select__label" for="${selectId}">
        ${label}${required ? ' <span class="eds-select__req" aria-hidden="true">*</span>' : ''}
      </label>
    ` : ''}
    <div class="eds-select__control">
      <select id="${selectId}"
              class="eds-select__native"
              ${disabled ? 'disabled' : ''}
              ${required ? 'required aria-required="true"' : ''}
              ${(helper || error) ? `aria-describedby="${helperId}"` : ''}
              ${error ? 'aria-invalid="true"' : ''}>
        ${placeholder ? `<option value="" ${!value ? 'selected' : ''} disabled hidden>${escapeHtml(placeholder)}</option>` : ''}
        ${optionsHtml}
      </select>
      <span class="eds-select__chevron" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </span>
    </div>
    ${(helper || error) ? `
      <div class="eds-select__helper" id="${helperId}" ${error ? 'role="alert"' : ''}>
        ${error || helper}
      </div>
    ` : ''}
  `;

  return wrap;
}

function escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeHtml(s) {
  return String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
