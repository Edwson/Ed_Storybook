import { PositionRow } from './PositionRow.js';

export default {
  title: 'Financial/Position Row',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Atom of every PORT-style positions table. 9 columns at fixed-px ' +
          'widths. Reuses `PnLCell` (sm) for unrealized + total — colour ' +
          'is paired with arrow + sign so direction is parseable without ' +
          'colour. Side glyph (L / S) carries the long/short distinction; ' +
          'short positions show negative MV correctly (sign flips through ' +
          'the calculation).\n\n' +
          'Market value uses an institutional money formatter — `$5.0M`, ' +
          '`$340K`, `$2.10` — so every row fits the same column width ' +
          'regardless of magnitude.',
      },
    },
  },
  argTypes: {
    symbol: { control: 'text', table: { category: 'Position' } },
    side: {
      control: { type: 'inline-radio' },
      options: ['long', 'short'],
      table: { category: 'Position' },
    },
    qty: { control: 'number', table: { category: 'Position' } },
    avg: { control: 'number', table: { category: 'Position' } },
    last: { control: 'number', table: { category: 'Position' } },
    realized: { control: 'number', table: { category: 'P&L' } },
    interactive: { control: 'boolean', table: { category: 'Behaviour' } },
  },
  args: {
    symbol: 'SPY',
    side: 'long',
    qty: 200,
    avg: 482.50,
    last: 487.32,
    realized: 0,
    interactive: true,
  },
  render: (args) => PositionRow(args),
};

export const Long = {};

export const Short = {
  args: {
    symbol: 'TSLA',
    side: 'short',
    qty: 100,
    avg: 248.00,
    last: 240.50,
    realized: 0,
  },
};

export const LosingPosition = {
  args: {
    symbol: 'NVDA',
    qty: 50,
    avg: 495.00,
    last: 485.46,
    realized: 0,
  },
};

export const WithRealized = {
  args: {
    symbol: 'AAPL',
    qty: 1000,
    avg: 182.10,
    last: 184.20,
    realized: 1250.00,
  },
};

export const PositionsTable = {
  name: 'Use case · 6-row positions table',
  parameters: {
    docs: {
      description: {
        story:
          'Six positions stacked into a PORT-style table. Mix of long + ' +
          'short, winners + losers. Every numeric column aligns at the ' +
          'decimal — that is the point of the fixed-px grid.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.padding = '24px';
    root.style.background = 'var(--bg-deep)';
    root.style.maxWidth = '1100px';

    // Header
    const head = document.createElement('div');
    head.style.display = 'grid';
    head.style.gridTemplateColumns = '72px 62px 72px 74px 74px 100px 1fr 1fr 1fr';
    head.style.gap = '12px';
    head.style.padding = '0 16px 8px';
    head.style.fontFamily = 'JetBrains Mono, monospace';
    head.style.fontSize = '10.5px';
    head.style.letterSpacing = '0.08em';
    head.style.textTransform = 'uppercase';
    head.style.color = 'var(--text-tertiary)';
    ['Symbol', 'Side', 'Qty', 'Avg', 'Last', 'MV', 'Unrealized', 'Realized', 'Total P&L'].forEach((label, i) => {
      const cell = document.createElement('span');
      cell.textContent = label;
      if (i >= 2 && i <= 5) cell.style.textAlign = 'right';
      if (i >= 6) cell.style.textAlign = 'right';
      head.appendChild(cell);
    });
    root.appendChild(head);

    [
      { symbol: 'SPY',  side: 'long',  qty: 200,  avg: 482.50, last: 487.32, realized: 0 },
      { symbol: 'QQQ',  side: 'long',  qty: 150,  avg: 408.20, last: 412.65, realized: 0 },
      { symbol: 'NVDA', side: 'long',  qty: 50,   avg: 495.00, last: 485.46, realized: 0 },
      { symbol: 'AAPL', side: 'long',  qty: 1000, avg: 182.10, last: 184.20, realized: 1250.00 },
      { symbol: 'TSLA', side: 'short', qty: 100,  avg: 248.00, last: 240.50, realized: 0 },
      { symbol: 'TLT',  side: 'long',  qty: 300,  avg:  92.40, last:  91.32, realized:  -180.00 },
    ].forEach((row) => root.appendChild(PositionRow({ ...row, interactive: true })));

    // Footer summary
    const footer = document.createElement('div');
    footer.style.padding = '12px 16px 0';
    footer.style.fontFamily = 'JetBrains Mono, monospace';
    footer.style.fontSize = '10.5px';
    footer.style.letterSpacing = '0.06em';
    footer.style.color = 'var(--text-tertiary)';
    footer.textContent = '6 positions · 5 long · 1 short · MV $432.6K · Day P&L +$1,250';
    root.appendChild(footer);

    return root;
  },
};
