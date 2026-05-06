/**
 * Spinner — Edwson Design System
 *
 * Loading indicator. Three sizes (sm / md / lg). Two visual styles:
 *  - 'circular' (default) — rotating arc, accent stroke
 *  - 'dots' — three pulsing dots (token-driven, tabular spacing)
 *
 * `prefers-reduced-motion` halts animation; the spinner is replaced with a
 * static "Loading..." marker so screen-reader users still get the cue.
 *
 * Accessibility — `role="status"` + `aria-live="polite"` so AT announces the
 * loading state. `aria-label` overrides the default "Loading…" text.
 */

const escape = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const Spinner = ({
  size = 'md',
  variant = 'circular',
  ariaLabel = 'Loading',
  showLabel = false,
  label = 'Loading…',
  tone = 'accent',
} = {}) => {
  const root = document.createElement('div');
  root.className = [
    'eds-spinner',
    `eds-spinner--${size}`,
    `eds-spinner--${variant}`,
    `eds-spinner--${tone}`,
  ].join(' ');
  root.setAttribute('role', 'status');
  root.setAttribute('aria-live', 'polite');
  root.setAttribute('aria-label', ariaLabel);

  if (variant === 'circular') {
    root.innerHTML = `
      <svg class="eds-spinner__svg" viewBox="0 0 50 50" aria-hidden="true">
        <circle class="eds-spinner__track" cx="25" cy="25" r="20" fill="none" stroke-width="4" />
        <circle class="eds-spinner__head" cx="25" cy="25" r="20" fill="none" stroke-width="4"
          stroke-linecap="round"
          stroke-dasharray="80 200" />
      </svg>
      ${showLabel ? `<span class="eds-spinner__label">${escape(label)}</span>` : ''}
    `;
  } else if (variant === 'dots') {
    root.innerHTML = `
      <span class="eds-spinner__dots" aria-hidden="true">
        <span class="eds-spinner__dot"></span>
        <span class="eds-spinner__dot"></span>
        <span class="eds-spinner__dot"></span>
      </span>
      ${showLabel ? `<span class="eds-spinner__label">${escape(label)}</span>` : ''}
    `;
  }

  return root;
};
