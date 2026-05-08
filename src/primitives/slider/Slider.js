/**
 * Slider — institutional range input with marks, value display, and prefix/suffix.
 *
 * Used for allocation sliders, threshold tuning, density controls, risk
 * appetite picker. Tabular-nums on value readouts so 1.25% lines up with
 * 12.50% perfectly.
 *
 * @typedef {Object} SliderProps
 * @property {number} [min]                    default 0
 * @property {number} [max]                    default 100
 * @property {number} [step]                   default 1
 * @property {number} [value]                  default min
 * @property {boolean|number[]} [marks]        true → step-aligned ticks; array → custom positions
 * @property {'none'|'inline'|'tooltip'} [showValue]  default 'inline'
 * @property {'sm'|'md'|'lg'} [size]           default 'md'
 * @property {boolean} [disabled]
 * @property {string} [label]                  rendered above the track
 * @property {string} [helperText]             muted hint below
 * @property {string} [errorMessage]           red message — sets aria-invalid
 * @property {string} [prefix]                 e.g. '$' rendered before value
 * @property {string} [suffix]                 e.g. '%' rendered after value
 * @property {(v:number)=>void} [onChange]
 */

import './slider.css';

let _id = 0;

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value = null,
  marks = false,
  showValue = 'inline',
  size = 'md',
  disabled = false,
  label = '',
  helperText = '',
  errorMessage = '',
  prefix = '',
  suffix = '',
  onChange = null,
} = {}) {
  const v = value === null || value === undefined ? min : value;
  const id = `eds-slider-${++_id}`;
  const root = document.createElement('div');
  root.className = [
    'eds-slider',
    `eds-slider--${size}`,
    disabled ? 'eds-slider--disabled' : '',
    errorMessage ? 'eds-slider--error' : '',
  ].filter(Boolean).join(' ');

  // Header row: label + value readout
  const headParts = [];
  if (label) headParts.push(`<label class="eds-slider__label" for="${id}">${label}</label>`);
  if (showValue === 'inline') {
    headParts.push(
      `<span class="eds-slider__readout">` +
      (prefix ? `<span class="eds-slider__affix">${prefix}</span>` : '') +
      `<span class="eds-slider__value" data-slider-value>${v}</span>` +
      (suffix ? `<span class="eds-slider__affix">${suffix}</span>` : '') +
      `</span>`
    );
  }
  if (headParts.length) {
    root.innerHTML = `<div class="eds-slider__head">${headParts.join('')}</div>`;
  }

  // Track + native input
  const trackWrap = document.createElement('div');
  trackWrap.className = 'eds-slider__track-wrap';
  trackWrap.innerHTML = `
    <div class="eds-slider__track" aria-hidden="true">
      <div class="eds-slider__fill" data-slider-fill style="--slider-pp:${pct(v, min, max)}%"></div>
    </div>
  `;

  // Marks
  if (marks) {
    const positions = Array.isArray(marks)
      ? marks
      : stepMarks(min, max, step, 5);
    const marksEl = document.createElement('div');
    marksEl.className = 'eds-slider__marks';
    marksEl.setAttribute('aria-hidden', 'true');
    positions.forEach((p) => {
      const mp = pct(p, min, max);
      const mark = document.createElement('span');
      mark.className = 'eds-slider__mark';
      mark.style.left = `${mp}%`;
      mark.innerHTML = `<span class="eds-slider__mark-tick"></span><span class="eds-slider__mark-label">${p}</span>`;
      marksEl.appendChild(mark);
    });
    trackWrap.appendChild(marksEl);
  }

  const input = document.createElement('input');
  input.type = 'range';
  input.id = id;
  input.className = 'eds-slider__input';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(v);
  if (disabled) input.disabled = true;
  if (errorMessage) input.setAttribute('aria-invalid', 'true');
  if (helperText || errorMessage) input.setAttribute('aria-describedby', `${id}-msg`);
  trackWrap.appendChild(input);

  // Tooltip readout
  if (showValue === 'tooltip') {
    const tip = document.createElement('span');
    tip.className = 'eds-slider__tip';
    tip.setAttribute('data-slider-tip', '');
    tip.style.left = `${pct(v, min, max)}%`;
    tip.textContent = `${prefix}${v}${suffix}`;
    trackWrap.appendChild(tip);
  }

  root.appendChild(trackWrap);

  // Helper / error
  if (helperText || errorMessage) {
    const msg = document.createElement('div');
    msg.id = `${id}-msg`;
    msg.className = errorMessage ? 'eds-slider__error' : 'eds-slider__helper';
    msg.textContent = errorMessage || helperText;
    if (errorMessage) msg.setAttribute('role', 'alert');
    root.appendChild(msg);
  }

  // Wire up
  input.addEventListener('input', (e) => {
    const nv = +e.target.value;
    const fill = root.querySelector('[data-slider-fill]');
    const valEl = root.querySelector('[data-slider-value]');
    const tipEl = root.querySelector('[data-slider-tip]');
    const p = pct(nv, min, max);
    if (fill) fill.style.setProperty('--slider-pp', `${p}%`);
    if (valEl) valEl.textContent = nv;
    if (tipEl) {
      tipEl.style.left = `${p}%`;
      tipEl.textContent = `${prefix}${nv}${suffix}`;
    }
    if (onChange) onChange(nv);
  });

  return root;
}

function pct(v, min, max) {
  if (max === min) return 0;
  return Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
}

function stepMarks(min, max, step, target) {
  const range = max - min;
  const count = Math.min(target, Math.floor(range / step) + 1);
  if (count < 2) return [min, max];
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(+(min + (range * i) / (count - 1)).toFixed(2));
  }
  return out;
}
