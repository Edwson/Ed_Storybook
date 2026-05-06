import { RadioGroup } from './RadioGroup.js';

export default {
  title: 'Primitives/Radio',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Radio vs Checkbox vs Select:** ' +
          'Radio = exactly one of N (≤5 options usually). ' +
          'Checkbox = zero or more of N. ' +
          'Select = exactly one of N (>5 options, saves vertical space). ' +
          'Native `<input type="radio">` with `<fieldset><legend>` ' +
          'wrapping — best a11y, free ←/↑/→/↓ keyboard navigation within group.',
      },
    },
  },
  argTypes: {
    name: { control: 'text', table: { category: 'Group' } },
    legend: { control: 'text', table: { category: 'Group' } },
    options: { control: 'object', table: { category: 'Group' } },
    value: { control: 'text', table: { category: 'Group' } },
    orientation: {
      control: { type: 'inline-radio' },
      options: ['vertical', 'horizontal'],
      table: { category: 'Layout' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    helper: { control: 'text', table: { category: 'Content' } },
    error: { control: 'text', table: { category: 'State' } },
    onChange: { action: 'changed', table: { category: 'Events' } },
  },
  args: {
    name: 'tif',
    legend: 'Time in force',
    options: [
      { value: 'day', label: 'Day',  helper: 'Cancel at end-of-day if unfilled.' },
      { value: 'gtc', label: 'GTC',  helper: 'Good til cancelled (max 90 days).' },
      { value: 'ioc', label: 'IOC',  helper: 'Immediate or cancel.' },
      { value: 'fok', label: 'FOK',  helper: 'Fill or kill — all-or-nothing.' },
    ],
    value: 'day',
    orientation: 'vertical',
    helper: 'Default DAY. GTC may incur additional fees.',
  },
  render: (args) => RadioGroup(args),
};

export const Default = {};

export const Horizontal = {
  args: {
    legend: 'Side',
    name: 'side',
    options: [
      { value: 'buy',  label: 'Buy' },
      { value: 'sell', label: 'Sell' },
    ],
    value: 'buy',
    orientation: 'horizontal',
    helper: '',
  },
};

export const NoLegend = {
  args: { legend: '', helper: '' },
};

export const WithError = {
  args: {
    value: '',
    error: 'Pick a time-in-force before submitting.',
    helper: '',
  },
};

export const DisabledOption = {
  args: {
    options: [
      { value: 'day', label: 'Day' },
      { value: 'gtc', label: 'GTC' },
      { value: 'ioc', label: 'IOC' },
      { value: 'fok', label: 'FOK', disabled: true, helper: 'Disabled — desk policy.' },
    ],
    value: 'day',
  },
};

export const OrderTicketSnippet = {
  name: 'Use case · order ticket side + TIF',
  parameters: {
    docs: {
      description: {
        story:
          'Two radio groups stacked — one horizontal (Buy/Sell), one ' +
          'vertical (TIF). Real composition from a paper-trade ticket.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    root.style.maxWidth = '420px';
    root.style.padding = '20px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '12px';

    root.appendChild(RadioGroup({
      name: 'side-demo',
      legend: 'Side',
      options: [
        { value: 'buy',  label: 'Buy' },
        { value: 'sell', label: 'Sell' },
      ],
      value: 'buy',
      orientation: 'horizontal',
    }));

    root.appendChild(RadioGroup({
      name: 'tif-demo',
      legend: 'Time in force',
      options: [
        { value: 'day', label: 'Day',  helper: 'Cancel at end-of-day if unfilled.' },
        { value: 'gtc', label: 'GTC',  helper: 'Good til cancelled (max 90 days).' },
        { value: 'ioc', label: 'IOC',  helper: 'Immediate or cancel.' },
        { value: 'fok', label: 'FOK',  helper: 'All-or-nothing.' },
      ],
      value: 'day',
    }));

    return root;
  },
};
