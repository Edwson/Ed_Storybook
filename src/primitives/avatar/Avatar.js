/**
 * Avatar — initials / image / icon identity primitive
 *
 * Renders one of three sources, in priority order:
 *   1. `image`    — <img> element with alt
 *   2. `iconHtml` — inline SVG markup (used when there's no name yet)
 *   3. `initials` — derived from `name` if not explicit (first chars
 *                   of first + last word, capitalised, max 2 chars)
 *
 * Three sizes (sm 24 / md 32 / lg 48). Squared variant for system /
 * organisation avatars; circle is the default for people.
 *
 * Optional status dot in the bottom-right (useful in chat / queue
 * contexts) — colour follows `status` prop.
 *
 * @typedef {Object} AvatarProps
 * @property {string} [name]          Used to derive initials + alt text
 * @property {string} [initials]      Override initials explicitly (max 2 chars)
 * @property {string} [image]         Image URL
 * @property {string} [iconHtml]      Inline SVG fallback
 * @property {'sm'|'md'|'lg'} [size]
 * @property {boolean} [squared]
 * @property {'online'|'busy'|'away'|'offline'} [status]
 */

import './avatar.css';

const STATUS_COLOR = {
  online: 'success',
  busy: 'danger',
  away: 'warn',
  offline: 'neutral',
};

/**
 * @param {AvatarProps} props
 * @returns {HTMLSpanElement}
 */
export function Avatar({
  name = '',
  initials,
  image = '',
  iconHtml = '',
  size = 'md',
  squared = false,
  status,
} = {}) {
  const root = document.createElement('span');
  root.className = [
    'eds-avatar',
    `eds-avatar--${size}`,
    squared ? 'eds-avatar--squared' : 'eds-avatar--circle',
  ].filter(Boolean).join(' ');
  root.setAttribute('role', 'img');
  root.setAttribute('aria-label', name || 'avatar');

  const computedInitials = (
    initials != null
      ? String(initials)
      : name
        ? name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w.charAt(0).toUpperCase())
            .join('')
        : ''
  ).slice(0, 2);

  let inner = '';
  if (image) {
    inner = `<img class="eds-avatar__img" src="${escapeAttr(image)}" alt="${escapeAttr(name || '')}" />`;
  } else if (iconHtml) {
    inner = `<span class="eds-avatar__icon" aria-hidden="true">${iconHtml}</span>`;
  } else if (computedInitials) {
    inner = `<span class="eds-avatar__initials" aria-hidden="true">${computedInitials}</span>`;
  } else {
    inner = `<span class="eds-avatar__initials" aria-hidden="true">·</span>`;
  }

  root.innerHTML = `
    ${inner}
    ${status ? `<span class="eds-avatar__status eds-avatar__status--${STATUS_COLOR[status] || 'neutral'}" aria-label="${status}" title="${status}"></span>` : ''}
  `;
  return root;
}

function escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
