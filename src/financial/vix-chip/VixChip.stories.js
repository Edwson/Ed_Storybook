import { VixChip } from './VixChip.js';

export default {
  title: 'Financial/VIX Chip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Volatility regime indicator. The CBOE VIX measures 30-day forward ' +
          'implied volatility on S&P 500 options. Four institutional bands:\n\n' +
          '- **Calm** (< 15) — complacent / range-bound regime\n' +
          '- **Normal** (15–20) — typical conditions\n' +
          '- **Elevated** (20–30) — heightened uncertainty\n' +
          '- **Crisis** (≥ 30) — systemic stress, FINRA 4210(g) margin escalation territory\n\n' +
          'VIX-up colours red (volatility increase = bad for risk-on positioning); ' +
          'VIX-down colours green. The arrow + sign pairing means the chip ' +
          'remains parseable for deuteranopia users.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'number', min: 5, max: 90, step: 0.1 }, table: { category: 'Data' } },
    prior: { control: 'number', table: { category: 'Data' } },
    band: {
      control: { type: 'select' },
      options: ['auto', 'calm', 'normal', 'elevated', 'crisis'],
      table: { category: 'Variant' },
    },
    showLabel: { control: 'boolean', table: { category: 'Display' } },
    showDelta: { control: 'boolean', table: { category: 'Display' } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Variant' },
    },
  },
  args: {
    value: 18.42,
    prior: 17.85,
    band: 'auto',
    showLabel: true,
    showDelta: true,
    size: 'md',
  },
  render: (args) => VixChip(args),
};

export const Default = {};

export const AllBands = {
  parameters: {
    docs: {
      description: {
        story:
          'All four bands side-by-side. Each band carries its own colour ' +
          'language. The crisis chip is what triggers a margin policy review.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    root.style.gap = '12px';
    [
      { value: 12.40, prior: 12.85 }, // calm
      { value: 18.42, prior: 17.85 }, // normal
      { value: 24.10, prior: 23.20 }, // elevated
      { value: 38.55, prior: 32.10 }, // crisis
    ].forEach((p) => root.appendChild(VixChip(p)));
    return root;
  },
};

export const Sizes = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    root.style.alignItems = 'center';
    root.style.gap = '12px';
    ['sm', 'md', 'lg'].forEach((size) =>
      root.appendChild(VixChip({ value: 22.45, prior: 20.10, size })),
    );
    return root;
  },
};

export const NoDelta = {
  args: { showDelta: false },
};

export const TerminalHeaderStrip = {
  name: 'Use case · terminal header strip',
  parameters: {
    docs: {
      description: {
        story:
          'How the chip lives at the top of an institutional terminal — ' +
          'paired with the regime classifier and a short observation. The ' +
          "crisis-band chip's red border catches the eye even on a dense screen.",
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'flex';
    root.style.alignItems = 'center';
    root.style.gap = '16px';
    root.style.padding = '12px 16px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '8px';
    root.style.fontFamily = 'Inter, sans-serif';
    root.style.fontSize = '13px';
    root.style.color = 'var(--text-secondary)';

    root.appendChild(VixChip({ value: 28.85, prior: 24.10, size: 'lg' }));

    const note = document.createElement('span');
    note.innerHTML = `
      <span style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.08em;
                   text-transform:uppercase;color:var(--text-tertiary);margin-right:8px;">
        OBS
      </span>
      VIX has expanded 19.7% in the last session. Defensive default applied to portfolio recommendations.
    `;
    root.appendChild(note);
    return root;
  },
};

export const RegimeStrip = {
  name: 'Use case · 5-day VIX evolution',
  parameters: {
    docs: {
      description: {
        story:
          'Five trailing closes shown as a horizontal strip — useful in a ' +
          'small-multiples grid where each cell is one trading day.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'flex';
    root.style.alignItems = 'center';
    root.style.gap = '8px';
    root.style.padding = '12px';
    root.style.background = 'var(--bg-deep)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '8px';

    const series = [
      { day: 'Mon', value: 16.20, prior: 17.10 },
      { day: 'Tue', value: 18.85, prior: 16.20 },
      { day: 'Wed', value: 22.10, prior: 18.85 },
      { day: 'Thu', value: 26.40, prior: 22.10 },
      { day: 'Fri', value: 28.85, prior: 26.40 },
    ];

    series.forEach(({ day, value, prior }) => {
      const cell = document.createElement('div');
      cell.style.display = 'flex';
      cell.style.flexDirection = 'column';
      cell.style.alignItems = 'flex-start';
      cell.style.gap = '4px';
      const label = document.createElement('span');
      label.style.fontFamily = 'JetBrains Mono, monospace';
      label.style.fontSize = '10px';
      label.style.letterSpacing = '0.08em';
      label.style.textTransform = 'uppercase';
      label.style.color = 'var(--text-tertiary)';
      label.textContent = day;
      cell.appendChild(label);
      cell.appendChild(VixChip({ value, prior, size: 'sm', showDelta: false }));
      root.appendChild(cell);
    });
    return root;
  },
};
