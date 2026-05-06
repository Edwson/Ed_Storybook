import { OrderRow } from './OrderRow.js';

export default {
  title: 'Financial/Order Row',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The atom of every execution surface — a single order in a blotter. ' +
          '11 columns at fixed-px widths so dot positions and percent signs ' +
          'align across rows. Tabular-nums on every numeric. Side colour ' +
          'is paired with arrow + uppercase label so deuteranopia users ' +
          'still parse the row at a glance. Status reuses `FixStateChip` ' +
          'in compact mode.\n\n' +
          '**Reg context:** SEC Rule 17a-4 retention applies to the full ' +
          'lifecycle (every OrdStatus transition). FINRA OATS reports key off ' +
          '`ClOrdID` + `OrigClOrdID`.\n\n' +
          '**Width budget:** ~1100px desktop. Below 900px, host should ' +
          'collapse to a card layout — the same pattern Stripe Dashboard ' +
          'and institutional terminals use.',
      },
    },
  },
  argTypes: {
    time: { control: 'text', table: { category: 'Order' } },
    id: { control: 'text', table: { category: 'Order' } },
    symbol: { control: 'text', table: { category: 'Order' } },
    side: {
      control: { type: 'inline-radio' },
      options: ['buy', 'sell'],
      table: { category: 'Order' },
    },
    type: {
      control: { type: 'select' },
      options: ['MKT', 'LMT', 'STP', 'STL', 'TWAP', 'VWAP', 'IOC', 'FOK'],
      table: { category: 'Order' },
    },
    qty: { control: 'number', table: { category: 'Order' } },
    limit: { control: 'number', table: { category: 'Order' } },
    stop: { control: 'number', table: { category: 'Order' } },
    tif: {
      control: { type: 'inline-radio' },
      options: ['DAY', 'GTC', 'IOC', 'FOK', 'GTD'],
      table: { category: 'Order' },
    },
    status: {
      control: { type: 'select' },
      options: ['pending-new', 'new', 'partial', 'filled', 'canceled', 'rejected'],
      table: { category: 'State' },
    },
    filledQty: { control: 'number', table: { category: 'Fill' } },
    avgFillPx: { control: 'number', table: { category: 'Fill' } },
    rejectReason: { control: 'text', table: { category: 'Fill' } },
    interactive: { control: 'boolean', table: { category: 'Behaviour' } },
    onClick: { action: 'clicked', table: { category: 'Events' } },
  },
  args: {
    time: '14:32:08.142',
    id: 'a4f2c1',
    symbol: 'SPY',
    side: 'buy',
    type: 'LMT',
    qty: 200,
    limit: 487.30,
    tif: 'DAY',
    status: 'filled',
    filledQty: 200,
    avgFillPx: 487.28,
    interactive: true,
  },
  render: (args) => OrderRow(args),
};

export const Filled = {};

export const Working = {
  args: { status: 'new', filledQty: undefined, avgFillPx: undefined },
};

export const PartiallyFilled = {
  args: {
    status: 'partial',
    qty: 1000,
    filledQty: 340,
    avgFillPx: 487.34,
  },
};

export const Rejected = {
  args: {
    side: 'sell',
    qty: 5000,
    type: 'MKT',
    limit: undefined,
    status: 'rejected',
    rejectReason: 'Risk gate · single-name concentration breach',
  },
};

export const PendingNew = {
  args: { status: 'pending-new', filledQty: undefined, avgFillPx: undefined },
};

export const Blotter = {
  name: 'Use case · 8-row execution blotter',
  parameters: {
    docs: {
      description: {
        story:
          'The institutional view: 8 orders stacked into a blotter. Each ' +
          'row is independently keyboard-focusable. Fills, partial fills, ' +
          'a working order, a cancelled order, and a risk-rejected order ' +
          'in a realistic sequence.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.padding = '24px';
    root.style.background = 'var(--bg-deep)';
    root.style.maxWidth = '1100px';

    // Header strip
    const head = document.createElement('div');
    head.style.display = 'grid';
    head.style.gridTemplateColumns = '80px 60px 80px 74px 52px 72px 74px 74px 50px 116px 1fr';
    head.style.gap = '12px';
    head.style.padding = '0 16px 8px';
    head.style.fontFamily = 'JetBrains Mono, monospace';
    head.style.fontSize = '10.5px';
    head.style.letterSpacing = '0.08em';
    head.style.textTransform = 'uppercase';
    head.style.color = 'var(--text-tertiary)';
    ['Time', 'ID', 'Symbol', 'Side', 'Type', 'Qty', 'Limit', 'Stop', 'TIF', 'Status', 'Fill'].forEach((label, i) => {
      const cell = document.createElement('span');
      cell.textContent = label;
      if (i === 5 || i === 6 || i === 7) cell.style.textAlign = 'right';
      head.appendChild(cell);
    });
    root.appendChild(head);

    const blotter = document.createElement('div');
    [
      { time: '14:32:08.142', id: 'a4f2c1', symbol: 'SPY',  side: 'buy',  type: 'LMT', qty: 200,  limit: 487.30, tif: 'DAY', status: 'filled',     filledQty: 200,  avgFillPx: 487.28 },
      { time: '14:31:45.022', id: '83b9d2', symbol: 'NVDA', side: 'sell', type: 'MKT', qty: 50,   tif: 'IOC', status: 'filled',     filledQty: 50,   avgFillPx: 485.47 },
      { time: '14:30:12.881', id: '6e1f47', symbol: 'AAPL', side: 'buy',  type: 'LMT', qty: 1000, limit: 184.10, tif: 'DAY', status: 'partial',    filledQty: 340,  avgFillPx: 184.08 },
      { time: '14:28:33.504', id: '2c8a91', symbol: 'TLT',  side: 'sell', type: 'STP', qty: 300,  stop:  91.00,  tif: 'GTC', status: 'new' },
      { time: '14:27:09.218', id: 'd9b4e3', symbol: 'QQQ',  side: 'buy',  type: 'LMT', qty: 150,  limit: 412.20, tif: 'DAY', status: 'pending-new' },
      { time: '14:24:51.097', id: '7f0a2b', symbol: 'GLD',  side: 'sell', type: 'LMT', qty: 100,  limit: 218.85, tif: 'DAY', status: 'canceled' },
      { time: '14:21:18.336', id: '5b2e8c', symbol: 'NVDA', side: 'sell', type: 'MKT', qty: 5000, tif: 'IOC', status: 'rejected', rejectReason: 'Risk · single-name concentration breach (105% of cap)' },
      { time: '14:18:42.612', id: '1a6c50', symbol: 'JPM',  side: 'buy',  type: 'LMT', qty: 75,   limit: 184.50, tif: 'DAY', status: 'filled',     filledQty: 75,   avgFillPx: 184.48 },
    ].forEach((row) => blotter.appendChild(OrderRow({ ...row, interactive: true })));
    root.appendChild(blotter);

    // Footer
    const footer = document.createElement('div');
    footer.style.padding = '12px 16px 0';
    footer.style.fontFamily = 'JetBrains Mono, monospace';
    footer.style.fontSize = '10.5px';
    footer.style.letterSpacing = '0.06em';
    footer.style.color = 'var(--text-tertiary)';
    footer.textContent = '8 orders · 5 filled · 1 partial · 1 working · 1 cancelled · 1 rejected · 17a-4 retained';
    root.appendChild(footer);

    return root;
  },
};
