/**
 * Pagination — institutional table page navigator.
 *
 * Used for blotters, position lists, audit logs, KYC review queues. Range
 * readout ("13–24 of 248") uses tabular-nums so the column does not jitter
 * as totals refresh. Sibling-count + boundary-count knobs let the same
 * component fit a 6-cell mobile rail or a 12-cell desktop strip.
 *
 * @typedef {Object} PaginationProps
 * @property {number} [currentPage]            1-indexed
 * @property {number} [totalPages]
 * @property {number} [totalItems]             optional, for range readout
 * @property {number} [pageSize]               optional, for range readout
 * @property {number} [siblingCount]           default 1 — pages around current
 * @property {number} [boundaryCount]          default 1 — pages always shown at ends
 * @property {boolean} [showFirstLast]         default true
 * @property {boolean} [showPrevNext]          default true
 * @property {boolean} [showRange]             '13–24 of 248'
 * @property {'sm'|'md'|'lg'} [size]
 * @property {'compact'|'numbered'|'minimal'} [variant]
 *           compact: « ‹ 1 … 5 6 7 … 24 › »
 *           numbered: same plus larger numbered tiles
 *           minimal: just ‹ Page 5 of 24 ›
 * @property {(p:number)=>void} [onChange]
 * @property {string} [ariaLabel]
 */

import './pagination.css';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = null,
  pageSize = null,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  showRange = false,
  size = 'md',
  variant = 'compact',
  onChange = null,
  ariaLabel = 'Pagination',
} = {}) {
  const root = document.createElement('nav');
  root.className = [
    'eds-pag',
    `eds-pag--${size}`,
    `eds-pag--${variant}`,
  ].filter(Boolean).join(' ');
  root.setAttribute('aria-label', ariaLabel);

  const cur = clamp(currentPage, 1, Math.max(1, totalPages));
  const total = Math.max(1, totalPages);

  // Range readout (left side)
  const rangeBits = [];
  if (showRange && totalItems != null && pageSize != null) {
    const from = (cur - 1) * pageSize + 1;
    const to = Math.min(cur * pageSize, totalItems);
    rangeBits.push(
      `<span class="eds-pag__range">${from.toLocaleString()}–${to.toLocaleString()} of ${totalItems.toLocaleString()}</span>`
    );
  }

  // Build button strip (right side)
  const buttons = [];

  if (variant === 'minimal') {
    if (showPrevNext) buttons.push(buildBtn('prev', '‹', cur, cur - 1, cur === 1));
    buttons.push(`<span class="eds-pag__minimal-text">Page <strong>${cur}</strong> of ${total}</span>`);
    if (showPrevNext) buttons.push(buildBtn('next', '›', cur, cur + 1, cur === total));
  } else {
    if (showFirstLast) buttons.push(buildBtn('first', '«', cur, 1, cur === 1, 'First'));
    if (showPrevNext)  buttons.push(buildBtn('prev',  '‹', cur, cur - 1, cur === 1, 'Previous'));

    const range = pageRange(cur, total, siblingCount, boundaryCount);
    range.forEach((p) => {
      if (p === 'ellipsis-l' || p === 'ellipsis-r') {
        buttons.push(`<span class="eds-pag__ellipsis" aria-hidden="true">…</span>`);
      } else {
        const active = p === cur;
        buttons.push(
          `<button type="button" class="eds-pag__page${active ? ' eds-pag__page--active' : ''}" data-page="${p}"${active ? ' aria-current="page"' : ''}>${p}</button>`
        );
      }
    });

    if (showPrevNext)  buttons.push(buildBtn('next',  '›', cur, cur + 1, cur === total, 'Next'));
    if (showFirstLast) buttons.push(buildBtn('last',  '»', cur, total, cur === total, 'Last'));
  }

  root.innerHTML = `
    <div class="eds-pag__inner">
      ${rangeBits.join('') || '<span class="eds-pag__spacer"></span>'}
      <div class="eds-pag__strip">${buttons.join('')}</div>
    </div>
  `;

  // Wire buttons
  root.querySelectorAll('button[data-page]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const p = +btn.getAttribute('data-page');
      if (onChange) onChange(p);
    });
  });

  return root;
}

function buildBtn(kind, sym, cur, target, disabled, label) {
  const aria = label ? ` aria-label="${label}"` : '';
  return `<button type="button" class="eds-pag__nav eds-pag__nav--${kind}" data-page="${target}"${aria}${disabled ? ' disabled aria-disabled="true"' : ''}>${sym}</button>`;
}

function pageRange(cur, total, siblings, boundaries) {
  // Returns ['1', 'ellipsis-l', '5', '6', '7', 'ellipsis-r', '24']
  const pages = [];
  const totalNumbers = boundaries * 2 + siblings * 2 + 3; // 1st + last + cur + ellipses
  if (total <= totalNumbers) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  const leftSibling = Math.max(cur - siblings, boundaries + 2);
  const rightSibling = Math.min(cur + siblings, total - boundaries - 1);

  for (let i = 1; i <= boundaries; i++) pages.push(i);
  if (leftSibling > boundaries + 1) pages.push('ellipsis-l');
  else for (let i = boundaries + 1; i < leftSibling; i++) pages.push(i);

  for (let i = leftSibling; i <= rightSibling; i++) pages.push(i);

  if (rightSibling < total - boundaries) pages.push('ellipsis-r');
  else for (let i = rightSibling + 1; i <= total - boundaries; i++) pages.push(i);

  for (let i = total - boundaries + 1; i <= total; i++) pages.push(i);
  return pages;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
