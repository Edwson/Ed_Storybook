import { Sparkline } from './Sparkline.js';

const SAMPLE_UP = [100, 101.2, 100.8, 102.4, 103.1, 104.8, 105.6, 107.2, 108.4, 109.1, 110.6];
const SAMPLE_DOWN = [110, 108.8, 109.2, 107.4, 106.1, 104.3, 103.8, 101.2, 100.4, 99.1, 97.6];
const SAMPLE_FLAT = [100, 100.2, 99.9, 100.1, 100.0, 100.3, 100.0, 99.8, 100.1, 100.2, 100.0];
const SAMPLE_VOL = [100, 105, 98, 107, 95, 110, 92, 108, 96, 104, 100];

export default {
  title: 'Financial/Sparkline',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Inline micro-chart for watchlist rows, position columns, KPI ' +
          'tiles. **No axes, no grid** — pure shape. Direction is colour ' +
          '+ arrow + signed-delta together (deuteranopia-safe). ' +
          'Auto-detects up / down / flat by total return; override via ' +
          '`direction` if a manual classification is needed.',
      },
    },
  },
  argTypes: {
    data: { control: 'object', table: { category: 'Content' } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Display' },
    },
    fill: { control: 'boolean', table: { category: 'Display' } },
    endDot: { control: 'boolean', table: { category: 'Display' } },
    showDelta: { control: 'boolean', table: { category: 'Display' } },
    compact: { control: 'boolean', table: { category: 'Display' } },
    direction: {
      control: { type: 'select' },
      options: ['auto', 'up', 'down', 'flat'],
      table: { category: 'Behaviour' },
    },
  },
  args: {
    data: SAMPLE_UP,
    size: 'md',
    fill: true,
    endDot: true,
    showDelta: true,
    compact: false,
    direction: 'auto',
  },
  render: (args) => Sparkline(args),
};

export const Default = {};

export const Up = { args: { data: SAMPLE_UP } };
export const Down = { args: { data: SAMPLE_DOWN } };
export const Flat = { args: { data: SAMPLE_FLAT } };

export const Volatile = {
  args: { data: SAMPLE_VOL },
  parameters: {
    docs: {
      description: {
        story:
          'High-volatility series — net change is small but path is jagged. ' +
          'Direction auto-detects by total return, so a wild path that ends ' +
          'flat reads as flat (no false signal).',
      },
    },
  },
};

export const Sizes = {
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes for three contexts. **sm** for dense watchlists ' +
          '(60×18px), **md** for default position rows (80×22px), ' +
          '**lg** for KPI tiles (120×32px).',
      },
    },
  },
  render: () => {
    const wrap = document.createElement('div');
    wrap.className = 'eds-stack';
    ['sm', 'md', 'lg'].forEach((size) => {
      const row = document.createElement('div');
      row.className = 'eds-row';
      row.appendChild(Sparkline({ data: SAMPLE_UP, size }));
      row.appendChild(Sparkline({ data: SAMPLE_DOWN, size }));
      wrap.appendChild(row);
    });
    return wrap;
  },
};

export const Compact = {
  args: { compact: true, data: SAMPLE_UP },
  parameters: {
    docs: {
      description: {
        story:
          'Chart-only, no delta label. For very dense layouts ' +
          'where the delta lives in a sibling column.',
      },
    },
  },
};

export const NoFill = {
  args: { fill: false, data: SAMPLE_UP },
  parameters: {
    docs: {
      description: {
        story:
          'Line-only variant. Lower visual weight — pairs well with ' +
          'tables already heavy with numbers.',
      },
    },
  },
};

export const Watchlist = {
  name: 'Use case · institutional watchlist',
  parameters: {
    docs: {
      description: {
        story:
          'Sparkline as a column inside a 5-column watchlist row ' +
          '(symbol · last · 7d trend · day change · day %). The trend ' +
          'sparkline gives a visual "shape" of the week without taking ' +
          'a chart panel of real estate.',
      },
    },
  },
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.fontFamily = 'JetBrains Mono, monospace';
    wrap.style.fontSize = '13px';
    wrap.style.background = 'var(--bg-surface)';
    wrap.style.border = '1px solid var(--border)';
    wrap.style.borderRadius = '6px';
    wrap.style.overflow = 'hidden';

    const rows = [
      { sym: 'AAPL', last: '188.42', trend: SAMPLE_UP, chg: '+1.84', pct: 'up' },
      { sym: 'MSFT', last: '412.18', trend: [380, 392, 388, 401, 404, 410, 408, 412.18], chg: '+0.62', pct: 'up' },
      { sym: 'NVDA', last: '108.34', trend: [125, 122, 119, 115, 113, 110, 108.34], chg: '-2.41', pct: 'down' },
      { sym: 'JPM',  last: '198.42', trend: SAMPLE_FLAT, chg: '+0.04', pct: 'flat' },
      { sym: 'XOM',  last: '110.18', trend: SAMPLE_DOWN, chg: '-1.62', pct: 'down' },
    ];

    rows.forEach((r, i) => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '60px 80px 1fr auto';
      row.style.alignItems = 'center';
      row.style.gap = '12px';
      row.style.padding = '8px 12px';
      if (i > 0) row.style.borderTop = '1px solid var(--border)';

      const sym = document.createElement('span');
      sym.style.fontWeight = '600';
      sym.style.color = 'var(--text-primary)';
      sym.textContent = r.sym;

      const last = document.createElement('span');
      last.style.color = 'var(--text-secondary)';
      last.textContent = r.last;

      row.appendChild(sym);
      row.appendChild(last);
      row.appendChild(Sparkline({ data: r.trend, size: 'sm' }));
      wrap.appendChild(row);
    });

    return wrap;
  },
};

export const KPI = {
  name: 'Use case · KPI tile',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gridTemplateColumns = 'repeat(3, 1fr)';
    wrap.style.gap = '12px';
    wrap.style.fontFamily = 'Inter, sans-serif';

    const tiles = [
      { label: 'Day P&L', value: '+$184,320', data: SAMPLE_UP, dir: 'up' },
      { label: 'VIX', value: '17.4', data: [22, 21, 20, 19.4, 18.8, 18.1, 17.4], dir: 'down' },
      { label: 'Net delta', value: '+0.42', data: SAMPLE_FLAT, dir: 'flat' },
    ];

    tiles.forEach((t) => {
      const card = document.createElement('div');
      card.style.padding = '12px';
      card.style.background = 'var(--bg-surface)';
      card.style.border = '1px solid var(--border)';
      card.style.borderRadius = '6px';

      const label = document.createElement('div');
      label.style.fontFamily = 'JetBrains Mono, monospace';
      label.style.fontSize = '10px';
      label.style.letterSpacing = '0.08em';
      label.style.color = 'var(--text-muted)';
      label.style.textTransform = 'uppercase';
      label.textContent = t.label;

      const value = document.createElement('div');
      value.style.fontSize = '1.2rem';
      value.style.fontWeight = '600';
      value.style.color = 'var(--text-primary)';
      value.style.fontFamily = 'JetBrains Mono, monospace';
      value.style.fontVariantNumeric = 'tabular-nums';
      value.style.margin = '4px 0';
      value.textContent = t.value;

      card.appendChild(label);
      card.appendChild(value);
      card.appendChild(Sparkline({ data: t.data, size: 'lg' }));
      wrap.appendChild(card);
    });

    return wrap;
  },
};
