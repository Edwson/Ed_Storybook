import { Badge } from './Badge.js';

export default {
  title: 'Primitives/Badge',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Status pill — six semantic variants (neutral · accent · success · ' +
          'warning · danger · info) × three appearances (subtle · solid · ' +
          'outline) × three sizes. Optional dot, glyph, or count. ' +
          'Tabular-nums on every variant so `12 / 25` style fragments align ' +
          'when stacked in a row.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    variant: {
      control: { type: 'select' },
      options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'],
      table: { category: 'Variant' },
    },
    appearance: {
      control: { type: 'inline-radio' },
      options: ['subtle', 'solid', 'outline'],
      table: { category: 'Variant' },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Variant' },
    },
    dot: { control: 'boolean', table: { category: 'Display' } },
    glyph: { control: 'text', table: { category: 'Display' } },
    uppercase: { control: 'boolean', table: { category: 'Display' } },
  },
  args: {
    label: 'Compliant',
    variant: 'success',
    appearance: 'subtle',
    size: 'md',
    dot: true,
    uppercase: false,
  },
  render: (args) => Badge(args),
};

export const Default = {};

export const Variants = {
  parameters: {
    docs: {
      description: {
        story:
          'All six semantic variants in subtle appearance. ' +
          'Each pairs colour with a label — never colour alone.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    [
      { label: 'Neutral', variant: 'neutral' },
      { label: 'Accent',  variant: 'accent' },
      { label: 'Active',  variant: 'success' },
      { label: 'Review',  variant: 'warning' },
      { label: 'Blocked', variant: 'danger' },
      { label: 'Audit',   variant: 'info' },
    ].forEach((p) => root.appendChild(Badge({ ...p, dot: true })));
    return root;
  },
};

export const Appearances = {
  parameters: {
    docs: {
      description: {
        story:
          'Three appearances at the same variant. **Subtle** is the default ' +
          'for inline status. **Solid** for one badge per row that must ' +
          'pull weight. **Outline** for tags that share row space with ' +
          'other content.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    ['accent', 'success', 'danger'].forEach((v) => {
      const row = document.createElement('div');
      row.className = 'eds-row';
      ['subtle', 'solid', 'outline'].forEach((a) => {
        row.appendChild(Badge({
          label: `${v} · ${a}`,
          variant: v,
          appearance: a,
        }));
      });
      root.appendChild(row);
    });
    return root;
  },
};

export const Sizes = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    ['sm', 'md', 'lg'].forEach((s) =>
      root.appendChild(Badge({ label: `${s.toUpperCase()}`, variant: 'accent', size: s, dot: true }))
    );
    return root;
  },
};

export const Uppercase = {
  args: { uppercase: true, label: 'Concept', variant: 'accent', dot: false },
  parameters: {
    docs: {
      description: {
        story:
          '`uppercase` switches to JetBrains Mono with letter-spacing — ' +
          'used for case-study tier markers (CONCEPT · LIVE · CONCEPT).',
      },
    },
  },
};

export const RegimeChips = {
  name: 'Use case · regime classifier chips',
  parameters: {
    docs: {
      description: {
        story:
          'The 5-state HMM regime classifier from TradeX_Platform. ' +
          'Each regime is colour-coded and dot-led — colour is the ' +
          'shorthand, the label carries the meaning.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    [
      { label: 'Crash',     variant: 'danger',  dot: true },
      { label: 'Bear',      variant: 'warning', dot: true },
      { label: 'Neutral',   variant: 'accent',  dot: true },
      { label: 'Bull',      variant: 'success', dot: true },
      { label: 'Euphoria',  variant: 'info',    dot: true },
    ].forEach((p) => root.appendChild(Badge({ ...p, uppercase: true, size: 'sm' })));
    return root;
  },
};

export const InRow = {
  name: 'Use case · case-study card',
  parameters: {
    docs: {
      description: {
        story:
          'Multiple badges sharing space inside a card head — ' +
          'tier marker + status + jurisdiction.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    root.style.padding = '16px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '8px';
    root.style.fontFamily = 'Inter, sans-serif';
    root.appendChild(Badge({ label: 'Concept', variant: 'accent', uppercase: true, size: 'sm' }));
    root.appendChild(Badge({ label: 'Working demo', variant: 'success', dot: true, size: 'sm' }));
    root.appendChild(Badge({ label: 'EU MiFID II', variant: 'neutral', appearance: 'outline', size: 'sm' }));
    root.appendChild(Badge({ label: 'AAA · 14.8:1', variant: 'info', glyph: '✓', size: 'sm' }));
    return root;
  },
};
