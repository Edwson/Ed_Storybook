/**
 * Regime Chip — institutional 5-state market-regime classifier
 *
 * Reads as: "we currently believe the market is in [Bear] regime,
 * with [82%] confidence". The five regimes match the HMM regime
 * classifier in TradeX_Platform — Crash / Bear / Neutral / Bull /
 * Euphoria — ordered by mean 21-day return.
 *
 * Three sizes. Optional confidence bar (% width, semantic color).
 * Always paired with a label — never communicates "Bear" by colour
 * alone (deuteranopia + senior-PD baseline).
 *
 * @typedef {'crash'|'bear'|'neutral'|'bull'|'euphoria'} Regime
 *
 * @typedef {Object} RegimeChipProps
 * @property {Regime} regime
 * @property {number} [confidence]    0–1; rendered as percent + bar
 * @property {boolean} [showConfidence]
 * @property {boolean} [showDot]
 * @property {'sm'|'md'|'lg'} [size]
 * @property {string} [label]         Override default regime label
 */

import './regime-chip.css';

const REGIMES = {
  crash:    { label: 'Crash',    glyph: '▼▼' },
  bear:     { label: 'Bear',     glyph: '▼'  },
  neutral:  { label: 'Neutral',  glyph: '·'  },
  bull:     { label: 'Bull',     glyph: '▲'  },
  euphoria: { label: 'Euphoria', glyph: '▲▲' },
};

/**
 * @param {RegimeChipProps} props
 * @returns {HTMLSpanElement}
 */
export function RegimeChip({
  regime = 'neutral',
  confidence = null,
  showConfidence = true,
  showDot = true,
  size = 'md',
  label,
} = {}) {
  const meta = REGIMES[regime] || REGIMES.neutral;
  const confPct = confidence != null
    ? Math.round(Math.max(0, Math.min(1, confidence)) * 100)
    : null;

  const root = document.createElement('span');
  root.className = [
    'eds-regime',
    `eds-regime--${regime}`,
    `eds-regime--${size}`,
  ].join(' ');

  const ariaPieces = [
    `${meta.label} regime`,
    confPct != null ? `confidence ${confPct} percent` : '',
  ].filter(Boolean);
  root.setAttribute('aria-label', ariaPieces.join(', '));

  root.innerHTML = `
    ${showDot ? `<span class="eds-regime__dot" aria-hidden="true"></span>` : ''}
    <span class="eds-regime__glyph" aria-hidden="true">${meta.glyph}</span>
    <span class="eds-regime__label">${label || meta.label}</span>
    ${showConfidence && confPct != null ? `
      <span class="eds-regime__conf">
        <span class="eds-regime__conf-bar" style="--eds-conf: ${confPct}%;"></span>
        <span class="eds-regime__conf-pct">${confPct}%</span>
      </span>
    ` : ''}
  `;
  return root;
}
