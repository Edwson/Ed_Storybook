/**
 * Tabs — Edwson Design System
 *
 * Tabbed navigation primitive. Tab strip + active indicator + panels.
 * Supports two appearances (bordered / transparent), inline + block layouts,
 * disabled tabs, and an optional badge per tab. Keyboard navigable: Left/Right
 * to move focus between tabs, Home/End to jump to first/last.
 *
 * Render returns a DOM node so the keyboard wiring + active-state JS can attach
 * after render. State is managed via data-eds-active attribute on the host.
 */

const escape = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

let _tabsId = 0;

export const Tabs = ({
  tabs = [
    { id: 'home', label: 'Home', content: 'Home tab content.' },
    { id: 'transactions', label: 'Transactions', content: 'Transactions tab content.' },
    { id: 'positions', label: 'Positions', content: 'Positions tab content.' },
  ],
  appearance = 'bordered',     // 'bordered' | 'transparent'
  size = 'md',                 // 'sm' | 'md'
  active = null,               // tab id, defaults to first
  block = false,               // full-width tab strip
  ariaLabel = 'Tabs',
} = {}) => {
  _tabsId += 1;
  const uid = `eds-tabs-${_tabsId}`;
  const activeId = active || (tabs[0] && tabs[0].id);

  const root = document.createElement('div');
  root.className = [
    'eds-tabs',
    `eds-tabs--${appearance}`,
    `eds-tabs--${size}`,
    block ? 'eds-tabs--block' : '',
  ].filter(Boolean).join(' ');
  root.setAttribute('data-eds-tabs', uid);

  const strip = document.createElement('div');
  strip.className = 'eds-tabs__strip';
  strip.setAttribute('role', 'tablist');
  strip.setAttribute('aria-label', ariaLabel);

  const panels = document.createElement('div');
  panels.className = 'eds-tabs__panels';

  tabs.forEach((t) => {
    const isActive = t.id === activeId;
    const isDisabled = !!t.disabled;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = [
      'eds-tabs__tab',
      isActive ? 'eds-tabs__tab--active' : '',
      isDisabled ? 'eds-tabs__tab--disabled' : '',
    ].filter(Boolean).join(' ');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('id', `${uid}-tab-${t.id}`);
    btn.setAttribute('aria-controls', `${uid}-panel-${t.id}`);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    btn.setAttribute('tabindex', isActive ? '0' : '-1');
    if (isDisabled) btn.setAttribute('aria-disabled', 'true');
    btn.dataset.tabId = t.id;

    btn.innerHTML = [
      `<span class="eds-tabs__tab-label">${escape(t.label)}</span>`,
      typeof t.badge !== 'undefined'
        ? `<span class="eds-tabs__tab-badge" aria-hidden="true">${escape(t.badge)}</span>`
        : '',
    ].join('');

    strip.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'eds-tabs__panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('id', `${uid}-panel-${t.id}`);
    panel.setAttribute('aria-labelledby', `${uid}-tab-${t.id}`);
    panel.setAttribute('tabindex', '0');
    if (!isActive) panel.hidden = true;
    panel.innerHTML = typeof t.content === 'string' ? t.content : '';
    panels.appendChild(panel);
  });

  // Wire interactivity (click + keyboard).
  strip.addEventListener('click', (e) => {
    const btn = e.target.closest('.eds-tabs__tab');
    if (!btn || btn.classList.contains('eds-tabs__tab--disabled')) return;
    activate(btn.dataset.tabId);
  });

  strip.addEventListener('keydown', (e) => {
    const buttons = Array.from(strip.querySelectorAll('.eds-tabs__tab:not(.eds-tabs__tab--disabled)'));
    const idx = buttons.findIndex((b) => b === document.activeElement);
    if (idx < 0) return;

    let next = -1;
    if (e.key === 'ArrowRight') next = (idx + 1) % buttons.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + buttons.length) % buttons.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = buttons.length - 1;
    else return;

    e.preventDefault();
    buttons[next].focus();
    activate(buttons[next].dataset.tabId);
  });

  function activate(tabId) {
    strip.querySelectorAll('.eds-tabs__tab').forEach((b) => {
      const on = b.dataset.tabId === tabId;
      b.classList.toggle('eds-tabs__tab--active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.setAttribute('tabindex', on ? '0' : '-1');
    });
    panels.querySelectorAll('.eds-tabs__panel').forEach((p) => {
      p.hidden = p.id !== `${uid}-panel-${tabId}`;
    });
  }

  root.appendChild(strip);
  root.appendChild(panels);
  return root;
};
