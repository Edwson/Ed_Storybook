import { Chip } from './Chip.js';

export default {
  title: 'Primitives/Chip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Interactive selectable element with optional dismiss. ' +
          'Used for filter pills, faceted search, watchlist symbols, ' +
          'tag input fields. **Differs from Badge** — chip is a CONTROL ' +
          '(clickable, removable), badge is a DISPLAY indicator (status only).',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    selected: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    removable: { control: 'boolean', table: { category: 'Behaviour' } },
    icon: { control: 'text', table: { category: 'Display' } },
    count: { control: 'text', table: { category: 'Display' } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Display' },
    },
  },
  args: {
    label: 'Filter',
    selected: false,
    disabled: false,
    removable: false,
    size: 'md',
  },
  render: (args) => Chip(args),
};

export const Default = {};

export const Selected = {
  args: { selected: true, label: 'Active filter' },
  parameters: {
    docs: {
      description: {
        story:
          '`selected` toggles to gold accent surface — used as a filter ' +
          'state. Pairs colour with `aria-pressed` so screen readers ' +
          'announce the toggle state. Colour is never the only signal.',
      },
    },
  },
};

export const Removable = {
  args: { removable: true, label: 'EU MiFID II', selected: true },
  parameters: {
    docs: {
      description: {
        story:
          '`removable` adds a `×` dismiss button. Clicking it fires ' +
          '`onRemove` (or removes the chip from DOM if no handler). ' +
          'The dismiss button has its own `aria-label` so screen readers ' +
          'announce "Remove EU MiFID II" — never just "×".',
      },
    },
  },
};

export const WithCount = {
  args: { label: 'Open orders', count: 12, selected: true },
  parameters: {
    docs: {
      description: {
        story:
          'Trailing count chip — used in nav rails, filter sidebars, ' +
          'faceted search counters. Tabular-nums on count so `12 / 247` ' +
          'aligns when stacked.',
      },
    },
  },
};

export const Sizes = {
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes for three contexts. **sm** (filter rail dense), ' +
          '**md** (default — toolbar, header), **lg** (touch target on mobile).',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    ['sm', 'md', 'lg'].forEach((s) => root.appendChild(Chip({ label: s.toUpperCase(), size: s })));
    return root;
  },
};

export const FilterRow = {
  name: 'Use case · faceted filter row',
  parameters: {
    docs: {
      description: {
        story:
          'A filter row from a Compliance review surface. Selected chips ' +
          'show as gold subtle, unselected as neutral. Each chip carries ' +
          'a count of matching records — institutional convention is ' +
          '"chip with count" so the analyst sees the result-set size ' +
          'before clicking.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    [
      { label: 'All', count: 247, selected: false },
      { label: 'Pending review', count: 18, selected: true },
      { label: 'Escalated', count: 4, selected: true },
      { label: 'Cleared', count: 225, selected: false },
    ].forEach((p) => root.appendChild(Chip({ ...p, size: 'sm' })));
    return root;
  },
};

export const TagInput = {
  name: 'Use case · multi-select tag input',
  parameters: {
    docs: {
      description: {
        story:
          'Removable chips inside a tag-input — jurisdiction selector ' +
          'on a KYC form. Each chip is dismissable so the user can pull ' +
          'a jurisdiction back out without retyping.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    root.style.padding = '8px 12px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '6px';
    [
      'EU (MiFID II Art 27)',
      'US (SEC Reg NMS)',
      'SG (MAS Notice 626)',
      'AU (ASIC RG 268)',
    ].forEach((label) => root.appendChild(Chip({ label, removable: true, selected: true, size: 'sm' })));
    return root;
  },
};

export const Disabled = {
  args: { disabled: true, label: 'Restricted', selected: true },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled chip — used for jurisdictions a customer is not ' +
          'eligible to trade in, or filters that have no matching records.',
      },
    },
  },
};
