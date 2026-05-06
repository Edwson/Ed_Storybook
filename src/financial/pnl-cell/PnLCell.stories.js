import { PnLCell } from './PnLCell.js';

export default {
  title: 'Financial/PnL Cell',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A financial-data primitive. Value + glyph + delta + percent — ' +
          'never colour alone for direction. Tabular-nums means the cell ' +
          'aligns when stacked in a row, even when integer widths differ. ' +
          'WCAG 2.1 AA on positive/negative variants against the dark ' +
          'surface (4.8:1 and 5.1:1 against #060810).',
      },
    },
  },
  argTypes: {
    value: { control: 'number', table: { category: 'Data' } },
    delta: { control: 'number', table: { category: 'Data' } },
    deltaPct: {
      control: { type: 'number', step: 0.0001 },
      description: 'Percent as decimal (0.0184 = +1.84%)',
      table: { category: 'Data' },
    },
    currency: { control: 'text', table: { category: 'Data' } },
    showCurrency: { control: 'boolean', table: { category: 'Display' } },
    showSign: { control: 'boolean', table: { category: 'Display' } },
    block: { control: 'boolean', table: { category: 'Layout' } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Variant' },
    },
    direction: {
      control: { type: 'select' },
      options: ['auto', 'positive', 'negative', 'neutral'],
      description: 'Override directional inference',
      table: { category: 'Variant' },
    },
  },
  args: {
    value: 487.32,
    delta: 1.84,
    deltaPct: 0.0038,
    currency: 'USD',
    showCurrency: false,
    showSign: true,
    direction: 'auto',
    size: 'md',
    block: false,
  },
  render: (args) => PnLCell(args),
};

export const Positive = {};

export const Negative = {
  args: { value: 487.32, delta: -1.84, deltaPct: -0.0038 },
};

export const Neutral = {
  args: { value: 487.32, delta: 0, deltaPct: 0 },
};

export const WithCurrency = {
  args: { showCurrency: true, value: 50000, delta: 1840, deltaPct: 0.0379 },
};

export const Sizes = {
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes — sm for blotter rows, md for default, lg for KPI tiles.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    ['sm', 'md', 'lg'].forEach((size) => {
      root.appendChild(PnLCell({ value: 487.32, delta: 1.84, deltaPct: 0.0038, size }));
    });
    return root;
  },
};

export const PortfolioRow = {
  name: 'Use case · positions table row',
  parameters: {
    docs: {
      description: {
        story:
          'A single row from a positions table. Cells share tabular-nums ' +
          'alignment — integer widths can differ but the dot positions match.',
      },
    },
  },
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '80px 120px 1fr 1fr';
    row.style.alignItems = 'center';
    row.style.gap = '16px';
    row.style.padding = '12px 16px';
    row.style.background = 'var(--bg-surface)';
    row.style.border = '1px solid var(--border)';
    row.style.borderRadius = '8px';
    row.style.fontFamily = 'JetBrains Mono, monospace';
    row.style.fontSize = '13px';

    const symbol = document.createElement('div');
    symbol.innerHTML = '<strong>SPY</strong>';
    symbol.style.color = 'var(--text-primary)';
    row.appendChild(symbol);

    const qty = document.createElement('div');
    qty.style.color = 'var(--text-tertiary)';
    qty.style.fontVariantNumeric = 'tabular-nums';
    qty.textContent = '200 sh';
    row.appendChild(qty);

    row.appendChild(PnLCell({ value: 97464.00, delta: 368.00, deltaPct: 0.0038, size: 'sm' }));
    row.appendChild(PnLCell({ value: 487.32, delta: 1.84, deltaPct: 0.0038, size: 'sm' }));
    return row;
  },
};

export const KpiTile = {
  name: 'Use case · KPI tile (block layout)',
  parameters: {
    docs: {
      description: {
        story:
          'Block layout puts value and delta on separate lines for KPI ' +
          'dashboards where the value is the headline.',
      },
    },
  },
  render: () => {
    const tile = document.createElement('div');
    tile.style.padding = '24px';
    tile.style.background = 'var(--bg-surface)';
    tile.style.border = '1px solid var(--border)';
    tile.style.borderRadius = '12px';
    tile.style.display = 'grid';
    tile.style.gap = '8px';
    tile.style.fontFamily = 'Inter, sans-serif';

    const label = document.createElement('div');
    label.textContent = 'Day P&L';
    label.style.fontFamily = 'JetBrains Mono, monospace';
    label.style.fontSize = '11px';
    label.style.letterSpacing = '0.08em';
    label.style.textTransform = 'uppercase';
    label.style.color = 'var(--text-tertiary)';
    tile.appendChild(label);

    tile.appendChild(PnLCell({
      value: 141840,
      delta: 141840,
      deltaPct: 0.0142,
      size: 'lg',
      block: true,
    }));

    return tile;
  },
};
