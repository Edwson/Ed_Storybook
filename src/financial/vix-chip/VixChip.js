/**
 * VIX Chip — volatility regime indicator
 *
 * The CBOE Volatility Index (VIX) measures the market's 30-day forward
 * implied volatility of S&P 500 index options. Four institutional bands:
 *
 *   < 15      calm        — complacent / range-bound regime
 *   15 – 20   normal      — typical market conditions
 *   20 – 30   elevated    — heightened uncertainty / event-driven
 *   ≥ 30      crisis      — systemic stress / margin escalation territory
 *
 * The 30 threshold is the FINRA 4210(g) margin escalation trigger many
 * desks use as a defensive default. The chip pairs the VIX value
 * (mono, tabular-nums) with the band label + a small directional glyph
 * vs the prior close.
 *
 * @typedef {'calm'|'normal'|'elevated'|'crisis'|'auto'} VixBand
 *
 * @typedef {Object} VixChipProps
 * @property {number} value
 * @property {number} [prior]      Prior close, used to compute Δ
 * @property {VixBand} [band]      Override; otherwise computed from value
 * @property {boolean} [showLabel] Show "CALM" / "NORMAL" / etc.
 * @property {boolean} [showDelta] Show ▲/▼ vs prior + Δ value
 * @property {'sm'|'md'|'lg'} [size]
 */

import './vix-chip.css';

const BAND_META = {
  calm:     { label: 'Calm',     range: '<15' },
  normal:   { label: 'Normal',   range: '15–20' },
  elevated: { label: 'Elevated', range: '20–30' },
  crisis:   { label: 'Crisis',   range: '≥30' },
};

function inferBand(v) {
  if (v >= 30) return 'crisis';
  if (v >= 20) return 'elevated';
  if (v >= 15) return 'normal';
  return 'calm';
}

/**
 * @param {VixChipProps} props
 * @returns {HTMLSpanElement}
 */
export function VixChip({
  value = 0,
  prior,
  band = 'auto',
  showLabel = true,
  showDelta = true,
  size = 'md',
} = {}) {
  const resolvedBand = band === 'auto' || !band ? inferBand(value) : band;
  const meta = BAND_META[resolvedBand];

  const delta = prior != null ? value - prior : null;
  const deltaPct = prior != null && prior > 0 ? delta / prior : null;
  const dir = delta == null ? 'flat' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const glyph = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '—';

  const root = document.createElement('span');
  root.className = [
    'eds-vix',
    `eds-vix--${resolvedBand}`,
    `eds-vix--${size}`,
  ].join(' ');
  root.setAttribute(
    'aria-label',
    [
      `VIX ${value.toFixed(2)}`,
      `${meta.label} regime (${meta.range})`,
      delta != null ? `change ${dir === 'up' ? 'up' : dir === 'down' ? 'down' : 'flat'} ${Math.abs(delta).toFixed(2)}` : '',
    ].filter(Boolean).join(', '),
  );
  root.setAttribute(
    'title',
    `VIX ${value.toFixed(2)} · ${meta.label} regime (${meta.range})${
      resolvedBand === 'crisis' ? ' · FINRA 4210(g) escalation territory' : ''
    }`,
  );

  root.innerHTML = `
    <span class="eds-vix__tag">VIX</span>
    <span class="eds-vix__value">${value.toFixed(2)}</span>
    ${showLabel ? `<span class="eds-vix__label">${meta.label}</span>` : ''}
    ${showDelta && delta != null ? `
      <span class="eds-vix__delta eds-vix__delta--${dir}">
        <span aria-hidden="true">${glyph}</span>
        ${Math.abs(delta).toFixed(2)}
        <span class="eds-vix__delta-pct">(${deltaPct != null ? (deltaPct * 100).toFixed(1) : '0.0'}%)</span>
      </span>
    ` : ''}
  `;
  return root;
}
