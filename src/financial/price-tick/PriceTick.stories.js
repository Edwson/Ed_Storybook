import { PriceTick } from './PriceTick.js';

// Synthetic intraday closes — deterministic seed so stories don't drift.
const sparkUp = [482.10, 482.45, 483.20, 483.05, 484.10, 485.30, 486.10, 486.85, 487.30, 487.40, 487.32];
const sparkDown = [495.10, 494.80, 493.20, 492.05, 491.10, 489.50, 488.30, 487.85, 486.30, 485.90, 485.46];
const sparkFlat = [487.10, 487.40, 487.20, 487.45, 487.20, 487.30, 487.40, 487.32, 487.35, 487.30, 487.32];

export default {
  title: 'Financial/Price Tick',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The atom of every watchlist, ticker strip, and execution ' +
          'surface. Symbol + last + delta + percent + (optional) ' +
          'sparkline. Direction is **arrow + sign + colour** — never ' +
          'colour alone. Live updates are deliberately *not* animated; ' +
          'animating a price tick introduces perceived latency that ' +
          'professionals notice.',
      },
    },
  },
  argTypes: {
    symbol: { control: 'text', table: { category: 'Data' } },
    last: { control: 'number', table: { category: 'Data' } },
    change: { control: 'number', table: { category: 'Data' } },
    changePct: {
      control: { type: 'number', step: 0.0001 },
      description: 'Percent as decimal (0.0184 = +1.84%)',
      table: { category: 'Data' },
    },
    venue: { control: 'text', table: { category: 'Data' } },
    sparkline: { control: 'object', table: { category: 'Data' } },
    showVenue: { control: 'boolean', table: { category: 'Display' } },
    showSpark: { control: 'boolean', table: { category: 'Display' } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Variant' },
    },
    onClick: { action: 'clicked', table: { category: 'Events' } },
  },
  args: {
    symbol: 'SPY',
    last: 487.32,
    change: 1.84,
    changePct: 0.0038,
    venue: 'NYSE',
    sparkline: sparkUp,
    showVenue: true,
    showSpark: true,
    size: 'md',
  },
  render: (args) => PriceTick(args),
};

export const Up = {};

export const Down = {
  args: {
    symbol: 'NVDA',
    last: 485.46,
    change: -3.40,
    changePct: -0.0070,
    venue: 'NASDAQ',
    sparkline: sparkDown,
  },
};

export const Flat = {
  args: {
    symbol: 'AGG',
    last: 487.32,
    change: 0,
    changePct: 0,
    venue: 'ARCA',
    sparkline: sparkFlat,
  },
};

export const Sizes = {
  parameters: {
    docs: {
      description: {
        story: 'Three sizes — sm for dense watchlists, md default, lg for hero ticker.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    ['sm', 'md', 'lg'].forEach((size) =>
      root.appendChild(PriceTick({
        symbol: 'SPY',
        last: 487.32,
        change: 1.84,
        changePct: 0.0038,
        venue: 'NYSE',
        sparkline: sparkUp,
        size,
      }))
    );
    return root;
  },
};

export const NoSpark = {
  args: { showSpark: false },
};

export const Watchlist = {
  name: 'Use case · 8-symbol watchlist',
  parameters: {
    docs: {
      description: {
        story:
          'Eight symbols stacked into a watchlist. Tabular-nums + ' +
          'fixed grid columns mean dot positions and percent signs ' +
          'align across rows.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    root.style.maxWidth = '460px';
    root.style.gap = '6px';

    const data = [
      { symbol: 'SPY',  last: 487.32, change: 1.84,  changePct: 0.0038, venue: 'NYSE',   sparkline: sparkUp,   onClick: () => {} },
      { symbol: 'QQQ',  last: 412.65, change: 2.10,  changePct: 0.0051, venue: 'NASDAQ', sparkline: sparkUp,   onClick: () => {} },
      { symbol: 'NVDA', last: 485.46, change: -3.40, changePct: -0.0070,venue: 'NASDAQ', sparkline: sparkDown, onClick: () => {} },
      { symbol: 'AAPL', last: 184.20, change: 0.65,  changePct: 0.0035, venue: 'NASDAQ', sparkline: sparkUp,   onClick: () => {} },
      { symbol: 'MSFT', last: 412.50, change: -0.85, changePct: -0.0021,venue: 'NASDAQ', sparkline: sparkDown, onClick: () => {} },
      { symbol: 'GOOG', last: 142.10, change: 0.42,  changePct: 0.0030, venue: 'NASDAQ', sparkline: sparkUp,   onClick: () => {} },
      { symbol: 'TLT',  last: 91.32,  change: -0.18, changePct: -0.0020,venue: 'NASDAQ', sparkline: sparkDown, onClick: () => {} },
      { symbol: 'GLD',  last: 218.65, change: 0.45,  changePct: 0.0021, venue: 'ARCA',   sparkline: sparkFlat, onClick: () => {} },
    ];

    data.forEach((d) => root.appendChild(PriceTick({ ...d, size: 'sm' })));
    return root;
  },
};
