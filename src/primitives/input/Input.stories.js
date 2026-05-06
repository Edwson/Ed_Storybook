import { Input } from './Input.js';

export default {
  title: 'Primitives/Input',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Form-field primitive. Three sizes, four states, prefix/suffix slots ' +
          'for currency / ticker / unit, helper or error message wired to ' +
          'aria-describedby + role=alert. Tabular-nums by default for ' +
          'numeric input alignment.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    value: { control: 'text', table: { category: 'Content' } },
    placeholder: { control: 'text', table: { category: 'Content' } },
    type: {
      control: { type: 'select' },
      options: ['text', 'number', 'email', 'tel', 'url', 'password', 'search'],
      table: { category: 'Content', defaultValue: { summary: 'text' } },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Variant', defaultValue: { summary: 'md' } },
    },
    prefix: { control: 'text', table: { category: 'Slots' } },
    suffix: { control: 'text', table: { category: 'Slots' } },
    helper: { control: 'text', table: { category: 'Content' } },
    error: { control: 'text', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    readonly: { control: 'boolean', table: { category: 'State' } },
    required: { control: 'boolean', table: { category: 'State' } },
    maxLength: { control: 'number', table: { category: 'Content' } },
  },
  args: {
    label: 'Email',
    value: '',
    placeholder: 'you@example.com',
    type: 'email',
    size: 'md',
    helper: 'We never share your email.',
  },
  render: (args) => Input(args),
};

export const Default = {};

export const Required = {
  args: {
    required: true,
    placeholder: 'Required field',
    helper: '',
  },
};

export const WithError = {
  args: {
    value: 'not-an-email',
    error: 'Enter a valid email address.',
  },
};

export const Disabled = {
  args: {
    value: 'ed@edwson.com',
    disabled: true,
  },
};

export const NotionalAmount = {
  name: 'Use case · notional amount',
  args: {
    label: 'Notional',
    type: 'number',
    value: '50000',
    prefix: '$',
    suffix: 'USD',
    helper: 'Pre-trade size in account base currency.',
  },
};

export const ShareQuantity = {
  name: 'Use case · share quantity',
  args: {
    label: 'Quantity',
    type: 'number',
    value: '200',
    suffix: 'shares',
    size: 'sm',
    helper: 'Lot size 1 share. Min order 1.',
  },
};

export const TickerSearch = {
  name: 'Use case · ticker search',
  args: {
    label: 'Symbol',
    type: 'search',
    placeholder: 'SPY · QQQ · NVDA …',
    prefix: '🔍',
    helper: '',
  },
};

export const Sizes = {
  parameters: {
    docs: {
      description: {
        story: 'Three sizes share the same visual language as Button.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    ['sm', 'md', 'lg'].forEach((size) => {
      root.appendChild(Input({
        label: size.toUpperCase(),
        size,
        placeholder: `${size} input`,
      }));
    });
    return root;
  },
};

export const InstitutionalForm = {
  name: 'Use case · order ticket form',
  parameters: {
    docs: {
      description: {
        story:
          'A real composition. Three fields stacked, last one is errored. ' +
          'aria-describedby and aria-invalid wire correctly across the form.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    root.style.maxWidth = '380px';
    root.style.padding = '20px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '12px';

    root.appendChild(Input({
      label: 'Symbol',
      value: 'SPY',
      placeholder: 'Ticker',
      required: true,
    }));
    root.appendChild(Input({
      label: 'Quantity',
      type: 'number',
      value: '200',
      suffix: 'shares',
      required: true,
      helper: 'Notional ≈ $97,460 at last price.',
    }));
    root.appendChild(Input({
      label: 'Limit price',
      type: 'number',
      value: '0.00',
      prefix: '$',
      error: 'Limit price must be greater than 0 for a limit order.',
    }));
    return root;
  },
};
