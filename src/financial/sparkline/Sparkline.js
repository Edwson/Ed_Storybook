/**
 * Sparkline — inline micro-chart for watchlists, position rows, KPI tiles.
 *
 * Renders a series as a sized SVG path with optional fill area, end-cap
 * dot, and a delta label. No axes, no grid — pure shape. Direction
 * (up / down / flat) is encoded as colour PAIRED with arrow and signed
 * delta, so colour is never the only signal (deuteranopia-safe).
 *
 * @typedef {Object} SparklineProps
 * @property {number[]} data                Series of close values, length ≥ 2
 * @property {'sm'|'md'|'lg'} [size]
 * @property {boolean} [fill]               Render area fill under the line
 * @property {boolean} [endDot]             End-cap dot at the right
 * @property {boolean} [showDelta]          Show signed delta + percent
 * @property {boolean} [compact]            Chart-only, hide delta even if true
 * @property {string} [ariaLabel]
 * @property {'auto'|'up'|'down'|'flat'} [direction]    Override auto direction
 */

import './sparkline.css';

const ARROWS = { up: '▲', down: '▼', flat: '—' };
const SIGNS = { up: '+', down: '', flat: '' };

/**
 * @param {SparklineProps} props
 * @returns {HTMLSpanElement}
 */
export function Sparkline({
  data = [],
  size = 'md',
  fill = true,
  endDot = true,
  showDelta = true,
  compact = false,
  ariaLabel = '',
  direction = 'auto',
} = {}) {
  if (!Array.isArray(data) || data.length < 2) {
    const empty = document.createElement('span');
    empty.className = 'eds-spark eds-spark--flat';
    empty.textContent = '—';
    return empty;
  }

  // Width/height in viewBox space — actual pixel size is set via CSS.
  const W = size === 'lg' ? 120 : size === 'sm' ? 60 : 80;
  const H = size === 'lg' ? 32 : size === 'sm' ? 18 : 22;
  const PAD = 1.5;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const x = (i) => PAD + (i / (data.length - 1)) * (W - PAD * 2);
  // SVG y grows downward; invert so larger values render higher.
  const y = (v) => H - PAD - ((v - min) / range) * (H - PAD * 2);

  const points = data.map((v, i) => `${x(i).toFixed(2)},${y(v).toFixed(2)}`);
  const linePath = 'M ' + points.join(' L ');
  const lastX = x(data.length - 1).toFixed(2);
  const lastY = y(data[data.length - 1]).toFixed(2);

  const fillPath =
    'M ' + points[0] + ' L ' + points.slice(1).join(' L ') +
    ` L ${lastX},${(H - PAD).toFixed(2)} L ${PAD.toFixed(2)},${(H - PAD).toFixed(2)} Z`;

  const first = data[0];
  const last = data[data.length - 1];
  const deltaAbs = last - first;
  const deltaPct = first === 0 ? 0 : (deltaAbs / first) * 100;

  let dir = direction;
  if (dir === 'auto') {
    if (Math.abs(deltaPct) < 0.05) dir = 'flat';
    else dir = deltaAbs > 0 ? 'up' : 'down';
  }

  const arrow = ARROWS[dir];
  const sign = SIGNS[dir];
  const deltaText = `${sign}${deltaPct >= 0 ? deltaPct.toFixed(2) : deltaPct.toFixed(2)}%`;

  const root = document.createElement('span');
  root.className = [
    'eds-spark',
    `eds-spark--${size}`,
    `eds-spark--${dir}`,
    compact ? 'eds-spark--compact' : '',
  ].filter(Boolean).join(' ');

  const computedAria = ariaLabel ||
    `Trend ${dir}, ${data.length} data points, change ${deltaText}, range ${min.toFixed(2)} to ${max.toFixed(2)}`;
  root.setAttribute('role', 'img');
  root.setAttribute('aria-label', computedAria);

  let html = `
    <svg class="eds-spark__chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      ${fill ? `<path class="eds-spark__fill" d="${fillPath}"/>` : ''}
      <path class="eds-spark__line" d="${linePath}"/>
      ${endDot ? `<circle class="eds-spark__dot" cx="${lastX}" cy="${lastY}" r="1.6"/>` : ''}
    </svg>
  `;

  if (showDelta && !compact) {
    html += `<span class="eds-spark__delta"><span class="eds-spark__arrow" aria-hidden="true">${arrow}</span>${deltaText}</span>`;
  }

  root.innerHTML = html;
  return root;
}
