/**
 * Tooltip — pure-CSS hover affordance
 *
 * No JS positioning library, no portal. The trigger and tooltip live
 * in the same DOM node; the tooltip is absolutely positioned relative
 * to the trigger and revealed via :hover / :focus-within.
 *
 * Why pure CSS:
 *   - Works before Storybook hydration, before page JS runs at all.
 *   - No flicker on first render; no jank during scroll.
 *   - For complex floating UI (auto-flip, collision detection),
 *     reach for a Popover instead.
 *
 * Always prefer a label or text — Tooltip is supplementary, not the
 * only carrier of meaning.
 *
 * @typedef {Object} TooltipProps
 * @property {string} text                 Tooltip body (text only)
 * @property {'top'|'right'|'bottom'|'left'} [placement]
 * @property {string} [triggerHtml]        HTML for the trigger element
 * @property {string} [id]
 */

import './tooltip.css';

let _idCounter = 0;
const nextId = () => `eds-tt-${++_idCounter}`;

/**
 * @param {TooltipProps} props
 * @returns {HTMLSpanElement}
 */
export function Tooltip({
  text = '',
  placement = 'top',
  triggerHtml = '',
  id,
} = {}) {
  const ttId = id || nextId();
  const root = document.createElement('span');
  root.className = `eds-tt eds-tt--${placement}`;

  root.innerHTML = `
    <span class="eds-tt__trigger" tabindex="0" aria-describedby="${ttId}">
      ${triggerHtml || 'hover me'}
    </span>
    <span class="eds-tt__bubble" id="${ttId}" role="tooltip">${text}</span>
  `;
  return root;
}
