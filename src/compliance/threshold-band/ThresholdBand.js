/**
 * Threshold Band — pre-trade 3-tier escalation
 *
 * Shows where a notional falls inside the supervisor's escalation
 * bands. Three tiers, two threshold values:
 *
 *   notional ≤ disclosureAt        compliant       (green)
 *   disclosureAt < notional < blockAt
 *                                  disclosure-required (gold)
 *   notional ≥ blockAt             blocked         (red, hard gate)
 *
 * The bar is a token-driven progress fill that maps the notional
 * relative to a sensible track maximum (1.5 × blockAt by default).
 * Both threshold ticks are rendered on the bar so the operator sees
 * not just *what* tier they are in, but *how close* they are to the
 * next escalation.
 *
 * Real anchors:
 *   - MAS Notice 626 §8.3 — large-trade AML thresholds (S$5M / S$50M)
 *   - FINRA 4210(g) — single-name concentration caps
 *   - 31 CFR 1010.311 — CTR threshold
 *
 * @typedef {Object} ThresholdBandProps
 * @property {number} notional       Current trade notional (USD)
 * @property {number} disclosureAt   Supervisor-review threshold
 * @property {number} blockAt        Hard-block threshold
 * @property {number} [trackMax]     Bar track max (defaults to 1.5 × blockAt)
 * @property {string} [jurisdiction] e.g., "SG MAS Notice 626"
 * @property {string} [currency]     ISO code for label, default 'USD'
 */

import './threshold-band.css';

/**
 * @param {ThresholdBandProps} props
 * @returns {HTMLDivElement}
 */
export function ThresholdBand({
  notional = 0,
  disclosureAt = 5_000_000,
  blockAt = 50_000_000,
  trackMax,
  jurisdiction = 'SG MAS Notice 626 §8.3',
  currency = 'USD',
} = {}) {
  const max = trackMax || blockAt * 1.5;
  const tier =
    notional >= blockAt
      ? 'blocked'
      : notional > disclosureAt
        ? 'disclosure'
        : 'compliant';

  const tierMeta = {
    compliant:  { label: 'Compliant',           note: 'no supervisor review required' },
    disclosure: { label: 'Disclosure required', note: 'supervisor review before submission' },
    blocked:    { label: 'Blocked',             note: 'pre-clearance required' },
  };

  const fillPct = clamp((notional / max) * 100, 0, 100);
  const dPct = clamp((disclosureAt / max) * 100, 0, 100);
  const bPct = clamp((blockAt / max) * 100, 0, 100);

  const root = document.createElement('div');
  root.className = `eds-tband eds-tband--${tier}`;
  root.setAttribute(
    'role',
    tier === 'blocked' ? 'alert' : 'status',
  );
  root.setAttribute('aria-live', tier === 'blocked' ? 'assertive' : 'polite');

  root.innerHTML = `
    <div class="eds-tband__head">
      <div class="eds-tband__juris">${jurisdiction}</div>
      <div class="eds-tband__tier">${tierMeta[tier].label} · ${tierMeta[tier].note}</div>
    </div>
    <div class="eds-tband__bar">
      <div class="eds-tband__fill" style="--tband-fill: ${fillPct}%;"></div>
      <div class="eds-tband__tick eds-tband__tick--disclose" style="--tband-tick: ${dPct}%;">
        <span class="eds-tband__tick-label">${formatMoney(disclosureAt, currency)}<br><em>disclose</em></span>
      </div>
      <div class="eds-tband__tick eds-tband__tick--block" style="--tband-tick: ${bPct}%;">
        <span class="eds-tband__tick-label">${formatMoney(blockAt, currency)}<br><em>block</em></span>
      </div>
      <div class="eds-tband__pin" style="--tband-pin: ${fillPct}%;">
        <span class="eds-tband__pin-label">${formatMoney(notional, currency)}</span>
      </div>
    </div>
  `;
  return root;
}

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

function formatMoney(n, ccy = 'USD') {
  if (n == null || isNaN(n)) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  const sym = ccy === 'USD' ? '$' : ccy === 'SGD' ? 'S$' : ccy === 'EUR' ? '€' : '$';
  if (abs >= 1e9) return `${sign}${sym}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${sym}${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}${sym}${(abs / 1e3).toFixed(0)}K`;
  return `${sign}${sym}${abs.toFixed(0)}`;
}
