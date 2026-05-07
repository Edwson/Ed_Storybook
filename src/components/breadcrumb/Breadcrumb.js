/**
 * Breadcrumb — hierarchical nav crumb.
 *
 * Used in deep workflows (Compliance > KYC > Step 3 > Document upload),
 * documentation surfaces, settings panels. Last item is the current
 * location and rendered as plain text (no link). Wrapped in
 * `<nav aria-label="Breadcrumb">` for screen-reader semantics.
 *
 * @typedef {Object} CrumbItem
 * @property {string} label
 * @property {string} [href]                URL — omit for current item
 * @property {string} [icon]                Optional leading glyph
 *
 * @typedef {Object} BreadcrumbProps
 * @property {CrumbItem[]} items
 * @property {'sm'|'md'|'lg'} [size]
 * @property {boolean} [compact]            Single-line truncation
 * @property {string} [separator]           Override separator glyph
 * @property {number} [maxItems]            Collapse middle items beyond this
 * @property {string} [ariaLabel]
 */

import './breadcrumb.css';

const SEP_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>`;

/**
 * @param {BreadcrumbProps} props
 * @returns {HTMLElement}
 */
export function Breadcrumb({
  items = [],
  size = 'md',
  compact = false,
  separator = SEP_SVG,
  maxItems = 0,
  ariaLabel = 'Breadcrumb',
} = {}) {
  const nav = document.createElement('nav');
  nav.className = [
    'eds-breadcrumb',
    `eds-breadcrumb--${size}`,
    compact ? 'eds-breadcrumb--compact' : '',
  ].filter(Boolean).join(' ');
  nav.setAttribute('aria-label', ariaLabel);

  // Collapse middle items if overflowing maxItems.
  let displayItems = items;
  let collapsed = false;
  if (maxItems > 0 && items.length > maxItems) {
    displayItems = [items[0], '…', ...items.slice(items.length - (maxItems - 1))];
    collapsed = true;
  }

  const ol = document.createElement('ol');
  ol.className = 'eds-breadcrumb__list';

  displayItems.forEach((item, idx) => {
    const isLast = idx === displayItems.length - 1;
    const li = document.createElement('li');
    li.className = 'eds-breadcrumb__item';

    if (item === '…') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'eds-breadcrumb__overflow';
      btn.textContent = '…';
      btn.setAttribute('aria-label', 'Show hidden breadcrumb items');
      li.appendChild(btn);
    } else if (isLast || !item.href) {
      const span = document.createElement('span');
      span.className = 'eds-breadcrumb__current';
      span.setAttribute('aria-current', 'page');
      span.innerHTML = (item.icon ? `<span aria-hidden="true">${item.icon}</span> ` : '') + item.label;
      li.appendChild(span);
    } else {
      const a = document.createElement('a');
      a.className = 'eds-breadcrumb__link';
      a.href = item.href;
      a.innerHTML = (item.icon ? `<span aria-hidden="true">${item.icon}</span> ` : '') + item.label;
      li.appendChild(a);
    }

    if (!isLast) {
      const sep = document.createElement('span');
      sep.className = 'eds-breadcrumb__separator';
      sep.setAttribute('aria-hidden', 'true');
      sep.innerHTML = separator;
      li.appendChild(sep);
    }

    ol.appendChild(li);
  });

  nav.appendChild(ol);
  return nav;
}
