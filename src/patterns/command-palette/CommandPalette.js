/**
 * Command Palette — composite pattern
 *
 * The institutional Cmd+K surface. Token-fuzzy match across a flat
 * action list, ↑↓ keyboard navigation, Enter to activate, Esc to close.
 * Supports grouped sections, keyboard hints, and (optional) a leading
 * eyebrow chip per item (e.g., 'Go', 'Strategy', 'Filter').
 *
 * Behaviour matches the Cmd+K palette in TradeX_Platform v0.3 and the
 * demo-trading-terminal — same scoring rule (exact 100 / prefix 50 /
 * substring 20 / per-token 5), same keyboard model, same UX copy.
 *
 * @typedef {Object} CommandItem
 * @property {string} id
 * @property {string} label
 * @property {string} [hint]      Right-side hint text
 * @property {string} [group]     Group label
 * @property {string} [eyebrow]   e.g., 'Go', 'Filter', 'Help'
 * @property {string} [shortcut]  e.g., '⌘K'
 * @property {() => void} [run]
 *
 * @typedef {Object} CommandPaletteProps
 * @property {CommandItem[]} items
 * @property {boolean} [open]
 * @property {string} [placeholder]
 */

import './command-palette.css';

/**
 * @param {CommandPaletteProps} props
 * @returns {HTMLDivElement}
 */
export function CommandPalette({
  items = [],
  open = true,
  placeholder = 'Type to search · ⌘K',
} = {}) {
  const root = document.createElement('div');
  root.className = `eds-cmdp ${open ? 'eds-cmdp--open' : ''}`;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Command palette');

  root.innerHTML = `
    <div class="eds-cmdp__panel">
      <div class="eds-cmdp__search">
        <span class="eds-cmdp__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
          </svg>
        </span>
        <input type="text"
               class="eds-cmdp__input"
               placeholder="${placeholder}"
               autocomplete="off"
               aria-label="Search commands"
               aria-controls="eds-cmdp-list"
               aria-activedescendant="" />
        <kbd class="eds-cmdp__kbd">esc</kbd>
      </div>
      <ul class="eds-cmdp__list" id="eds-cmdp-list" role="listbox" tabindex="-1"></ul>
      <div class="eds-cmdp__hint">
        <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
        <span><kbd>↵</kbd> to select</span>
        <span><kbd>esc</kbd> to close</span>
      </div>
    </div>
  `;

  const input = root.querySelector('.eds-cmdp__input');
  const list = root.querySelector('.eds-cmdp__list');

  let activeIdx = 0;
  let filtered = items.slice();

  function render() {
    list.innerHTML = '';
    if (!filtered.length) {
      const empty = document.createElement('li');
      empty.className = 'eds-cmdp__empty';
      empty.textContent = 'No matches.';
      list.appendChild(empty);
      input.setAttribute('aria-activedescendant', '');
      return;
    }
    // Group items by `group` field, preserving insertion order.
    const byGroup = new Map();
    filtered.forEach((it) => {
      const g = it.group || '';
      if (!byGroup.has(g)) byGroup.set(g, []);
      byGroup.get(g).push(it);
    });

    let runningIdx = 0;
    byGroup.forEach((groupItems, groupLabel) => {
      if (groupLabel) {
        const head = document.createElement('li');
        head.className = 'eds-cmdp__group-label';
        head.textContent = groupLabel;
        list.appendChild(head);
      }
      groupItems.forEach((it) => {
        const li = document.createElement('li');
        li.className = `eds-cmdp__item ${runningIdx === activeIdx ? 'eds-cmdp__item--active' : ''}`;
        li.setAttribute('role', 'option');
        li.id = `eds-cmdp-item-${runningIdx}`;
        li.setAttribute('aria-selected', runningIdx === activeIdx ? 'true' : 'false');
        li.dataset.idx = String(runningIdx);
        li.innerHTML = `
          ${it.eyebrow ? `<span class="eds-cmdp__eyebrow">${it.eyebrow}</span>` : ''}
          <span class="eds-cmdp__label">${it.label}</span>
          ${it.hint ? `<span class="eds-cmdp__item-hint">${it.hint}</span>` : ''}
          ${it.shortcut ? `<kbd class="eds-cmdp__kbd">${it.shortcut}</kbd>` : ''}
        `;
        li.addEventListener('mouseenter', () => {
          activeIdx = parseInt(li.dataset.idx, 10);
          syncActive();
        });
        li.addEventListener('click', () => {
          activate(filtered[parseInt(li.dataset.idx, 10)]);
        });
        list.appendChild(li);
        runningIdx++;
      });
    });

    if (filtered[activeIdx]) {
      input.setAttribute('aria-activedescendant', `eds-cmdp-item-${activeIdx}`);
    }
  }

  function syncActive() {
    list.querySelectorAll('.eds-cmdp__item').forEach((node) => {
      const idx = parseInt(node.dataset.idx, 10);
      node.classList.toggle('eds-cmdp__item--active', idx === activeIdx);
      node.setAttribute('aria-selected', idx === activeIdx ? 'true' : 'false');
    });
    input.setAttribute('aria-activedescendant', `eds-cmdp-item-${activeIdx}`);
    const activeNode = list.querySelector('.eds-cmdp__item--active');
    activeNode?.scrollIntoView({ block: 'nearest' });
  }

  function score(item, q) {
    if (!q) return 1;
    const label = item.label.toLowerCase();
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    let s = 0;
    for (const t of tokens) {
      if (label === t) s += 100;
      else if (label.startsWith(t)) s += 50;
      else if (label.includes(t)) s += 20;
      else if (label.split(/\W+/).some((w) => w.startsWith(t))) s += 5;
      else return 0;
    }
    return s;
  }

  function filter(q) {
    filtered = items
      .map((it) => ({ it, s: score(it, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.it);
    activeIdx = 0;
    render();
  }

  function activate(item) {
    if (!item) return;
    if (typeof item.run === 'function') item.run();
    // In a real shell, the host closes the palette here.
  }

  input.addEventListener('input', (e) => filter(e.target.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, filtered.length - 1);
      syncActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      syncActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activate(filtered[activeIdx]);
    } else if (e.key === 'Escape') {
      root.classList.remove('eds-cmdp--open');
    }
  });

  render();
  setTimeout(() => input.focus(), 0);
  return root;
}
