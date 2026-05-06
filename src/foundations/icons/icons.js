/**
 * Icon registry — 24×24 stroke icons
 *
 * All icons are 24×24 viewBox, 2px stroke, currentColor — so they
 * inherit color from the parent. Stroke-based (not filled) to match
 * the institutional voice (filled icons read as consumer-app).
 *
 * Icons are sourced from Tabler Icons (MIT) and Lucide where applicable,
 * then trimmed to the names used in the design system. This subset is
 * intentionally small: ~30 icons covering finance, compliance, UI
 * essentials. Adding more requires the same review (does this earn its
 * weight in the bundle?).
 */

export const ICONS = {
  // ── Direction / arrows ──
  'arrow-right': '<path d="M5 12h14M13 5l7 7-7 7"/>',
  'arrow-left':  '<path d="M19 12H5M11 19l-7-7 7-7"/>',
  'arrow-up':    '<path d="M12 19V5M5 12l7-7 7 7"/>',
  'arrow-down':  '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  'chevron-down':  '<path d="M6 9l6 6 6-6"/>',
  'chevron-right': '<path d="M9 18l6-6-6-6"/>',
  'external-link': '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4M14 3h7v7M10 14L21 3"/>',

  // ── Status / signal ──
  'check':    '<path d="M5 12l5 5L20 7"/>',
  'x':        '<path d="M18 6L6 18M6 6l12 12"/>',
  'plus':     '<path d="M12 5v14M5 12h14"/>',
  'minus':    '<path d="M5 12h14"/>',
  'info':     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  'warning':  '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>',
  'shield':   '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  'alert-circle': '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',

  // ── Finance / data ──
  'trending-up':   '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
  'trending-down': '<path d="M23 18l-9.5-9.5-5 5L1 6"/><path d="M17 18h6v-6"/>',
  'activity':      '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  'bar-chart':     '<path d="M12 20V10M18 20V4M6 20v-6"/>',
  'pie-chart':     '<path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/>',
  'dollar-sign':   '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
  'percent':       '<path d="M19 5L5 19M6.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM17.5 20a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>',

  // ── Compliance / audit ──
  'lock':       '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  'unlock':     '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/>',
  'eye':        '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off':    '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><path d="M1 1l22 22"/>',
  'file-text':  '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  'clipboard':  '<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>',
  'clock':      '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'calendar':   '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',

  // ── UI essentials ──
  'search':     '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  'filter':     '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
  'settings':   '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 8a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  'refresh':    '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>',
  'download':   '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  'upload':     '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  'menu':       '<path d="M3 12h18M3 6h18M3 18h18"/>',
  'more-h':     '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  'more-v':     '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  'user':       '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'mail':       '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/>',
};

/**
 * Render an icon as an SVG element.
 * @param {string} name
 * @param {{ size?: number, stroke?: number }} [opts]
 * @returns {SVGElement}
 */
export function icon(name, { size = 24, stroke = 2 } = {}) {
  const path = ICONS[name];
  if (!path) {
    console.warn(`[eds] icon "${name}" not found`);
    return document.createTextNode('');
  }
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', String(stroke));
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = path;
  return svg;
}

/**
 * Render an icon as an HTML string (for innerHTML composition).
 * @param {string} name
 * @param {{ size?: number, stroke?: number }} [opts]
 * @returns {string}
 */
export function iconHtml(name, { size = 24, stroke = 2 } = {}) {
  const path = ICONS[name] || '';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none"
              stroke="currentColor" stroke-width="${stroke}"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            ${path}
          </svg>`;
}

/** Sorted list of icon names (useful for the gallery story). */
export const ICON_NAMES = Object.keys(ICONS).sort();
