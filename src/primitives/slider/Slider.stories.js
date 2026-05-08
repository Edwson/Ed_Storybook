import { Slider } from './Slider.js';

export default {
  title: 'Primitives/Slider',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Range input for allocation, threshold, density, and risk-appetite ' +
          'controls. Tabular-nums on every readout so 1.25% lines up with ' +
          '12.50%. Marks accept boolean (auto step ticks) or an array of ' +
          'custom positions. Three value-display modes: `none` / `inline` / ' +
          '`tooltip`.',
      },
    },
  },
  argTypes: {
    min: { control: 'number', table: { category: 'Range' } },
    max: { control: 'number', table: { category: 'Range' } },
    step: { control: 'number', table: { category: 'Range' } },
    value: { control: 'number', table: { category: 'Range' } },
    showValue: {
      control: { type: 'inline-radio' },
      options: ['none', 'inline', 'tooltip'],
      table: { category: 'Display' },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Display' },
    },
    marks: { control: 'boolean', table: { category: 'Display' } },
    label: { control: 'text', table: { category: 'Content' } },
    helperText: { control: 'text', table: { category: 'Content' } },
    errorMessage: { control: 'text', table: { category: 'State' } },
    prefix: { control: 'text', table: { category: 'Content' } },
    suffix: { control: 'text', table: { category: 'Content' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 40,
    showValue: 'inline',
    size: 'md',
    marks: false,
    label: 'Risk appetite',
    helperText: '',
    errorMessage: '',
    prefix: '',
    suffix: '%',
    disabled: false,
  },
  render: (args) => Slider(args),
};

export const Default = {};

export const Sizes = {
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes for three contexts. **sm** for filter rails / dense ' +
          'panels, **md** default, **lg** for touch targets / hero KPI tiles.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '24px';
    ['sm', 'md', 'lg'].forEach((s) => {
      root.appendChild(
        Slider({ size: s, label: `${s.toUpperCase()} slider`, value: 35, suffix: '%' })
      );
    });
    return root;
  },
};

export const WithMarks = {
  args: {
    marks: true,
    min: 0,
    max: 100,
    step: 25,
    value: 50,
    label: 'Concentration cap',
    suffix: '%',
    helperText: 'Auto step-aligned ticks at 0 / 25 / 50 / 75 / 100.',
  },
};

export const CustomMarks = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass an array to `marks` for custom tick positions — useful when ' +
          'the meaningful break-points are not step-aligned (e.g. VaR limits, ' +
          'FINRA 4210(g) margin tiers).',
      },
    },
  },
  render: () => Slider({
    label: 'Margin tier',
    min: 0,
    max: 100,
    step: 1,
    value: 30,
    marks: [0, 15, 30, 50, 75, 100],
    suffix: '%',
    helperText: 'Custom marks at FINRA 4210(g) escalation boundaries.',
  }),
};

export const Tooltip = {
  args: {
    showValue: 'tooltip',
    value: 65,
    label: 'Notional cap',
    prefix: '$',
    suffix: 'M',
    marks: false,
    helperText: 'Live tooltip follows the thumb — used in trade-sizers.',
  },
};

export const Disabled = {
  args: {
    disabled: true,
    value: 30,
    label: 'Concentration cap (locked)',
    suffix: '%',
    helperText: 'Disabled when the user lacks the allocation permission.',
  },
};

export const Error = {
  args: {
    value: 95,
    label: 'Single-name exposure',
    suffix: '%',
    errorMessage: 'Exceeds FINRA 4210(g) single-name 5% threshold.',
    marks: true,
    step: 25,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`errorMessage` paints the fill red, sets `aria-invalid`, and ' +
          'renders a `role="alert"` paragraph below the track.',
      },
    },
  },
};

export const AllocationUseCase = {
  name: 'Use case · portfolio allocation',
  parameters: {
    docs: {
      description: {
        story:
          'A 4-row allocation editor. Each slider drives one position weight; ' +
          'the strip below sums in real time. Tabular-nums means the column ' +
          'reads top-to-bottom.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '20px';
    root.style.padding = '20px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '8px';
    root.style.maxWidth = '480px';

    const sum = document.createElement('div');
    sum.style.display = 'flex';
    sum.style.justifyContent = 'space-between';
    sum.style.fontFamily = 'JetBrains Mono, monospace';
    sum.style.fontSize = '0.85rem';
    sum.style.padding = '8px 12px';
    sum.style.background = 'var(--bg-elevated)';
    sum.style.borderRadius = '4px';
    sum.style.fontVariantNumeric = 'tabular-nums';
    sum.innerHTML = '<span>Total</span><span data-sum>0%</span>';

    const initial = { Equity: 60, Fixed: 25, Alts: 10, Cash: 5 };
    const refs = {};
    Object.entries(initial).forEach(([name, v]) => {
      const s = Slider({
        size: 'sm',
        label: name,
        suffix: '%',
        value: v,
        min: 0,
        max: 100,
        step: 1,
        onChange: (nv) => {
          refs[name] = nv;
          let total = 0;
          Object.values(refs).forEach((x) => (total += x));
          sum.querySelector('[data-sum]').textContent = `${total}%`;
        },
      });
      refs[name] = v;
      root.appendChild(s);
    });
    sum.querySelector('[data-sum]').textContent =
      Object.values(refs).reduce((a, b) => a + b, 0) + '%';
    root.appendChild(sum);
    return root;
  },
};
