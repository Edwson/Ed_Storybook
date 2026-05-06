import { RegimeChip } from './RegimeChip.js';

export default {
  title: 'Financial/Regime Chip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The 5-state market-regime classifier from TradeX_Platform. ' +
          'Reads as: *we currently believe the market is in [Bear] regime, ' +
          'with [82%] confidence*. Five regimes ordered by mean 21-day ' +
          'return: Crash (≤ −15%) · Bear · Neutral · Bull · Euphoria ' +
          '(≥ +15%).\n\n' +
          'Colour is paired with arrow glyph + uppercase label — never ' +
          'colour alone. The confidence bar is informative but optional.',
      },
    },
  },
  argTypes: {
    regime: {
      control: { type: 'select' },
      options: ['crash', 'bear', 'neutral', 'bull', 'euphoria'],
      table: { category: 'Data' },
    },
    confidence: {
      control: { type: 'number', min: 0, max: 1, step: 0.01 },
      table: { category: 'Data' },
    },
    showConfidence: { control: 'boolean', table: { category: 'Display' } },
    showDot: { control: 'boolean', table: { category: 'Display' } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Variant' },
    },
    label: { control: 'text', table: { category: 'Display' } },
  },
  args: {
    regime: 'bear',
    confidence: 0.82,
    showConfidence: true,
    showDot: true,
    size: 'md',
  },
  render: (args) => RegimeChip(args),
};

export const Default = {};

export const AllRegimes = {
  parameters: {
    docs: {
      description: {
        story: 'Five regimes side-by-side with the same 82% confidence.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    ['crash', 'bear', 'neutral', 'bull', 'euphoria'].forEach((r) =>
      root.appendChild(RegimeChip({ regime: r, confidence: 0.82 }))
    );
    return root;
  },
};

export const ConfidenceLadder = {
  parameters: {
    docs: {
      description: {
        story:
          'Same regime, four confidence levels — note the bar fill ' +
          'reflects the proportion exactly.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    [0.45, 0.62, 0.82, 0.97].forEach((c) =>
      root.appendChild(RegimeChip({ regime: 'bear', confidence: c }))
    );
    return root;
  },
};

export const NoConfidence = {
  args: { showConfidence: false },
};

export const Sizes = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    root.style.alignItems = 'center';
    ['sm', 'md', 'lg'].forEach((s) =>
      root.appendChild(RegimeChip({ regime: 'bull', confidence: 0.82, size: s }))
    );
    return root;
  },
};

export const ObservatoryHeader = {
  name: 'Use case · Observatory current-state header',
  parameters: {
    docs: {
      description: {
        story:
          'How the chip lives at the top of the TradeX Observatory tab — ' +
          'paired with the data window and a since-when timestamp.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gridTemplateColumns = '1fr auto';
    root.style.alignItems = 'center';
    root.style.gap = '24px';
    root.style.padding = '20px 24px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '12px';
    root.style.fontFamily = 'Inter, sans-serif';

    const left = document.createElement('div');
    left.innerHTML = `
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;
                  letter-spacing: 0.08em; text-transform: uppercase;
                  color: var(--text-tertiary); margin-bottom: 6px;">
        Current regime · 5-state HMM (SPY · QQQ · VIX · 16y daily)
      </div>
      <div style="font-family: 'Cormorant Garamond', serif; font-weight: 400;
                  font-size: 1.5rem; color: var(--text-primary); line-height: 1.2;">
        Bear regime since 2026-03-05
      </div>
      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
        Posterior probability 82%. 4 days into current run.
      </div>
    `;
    root.appendChild(left);
    root.appendChild(RegimeChip({ regime: 'bear', confidence: 0.82, size: 'lg' }));
    return root;
  },
};
