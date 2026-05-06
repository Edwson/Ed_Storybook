import { Select } from './Select.js';

const VENUES = [
  { value: 'NYSE',    label: 'NYSE · New York Stock Exchange',  group: 'US Equities' },
  { value: 'NASDAQ',  label: 'NASDAQ',                          group: 'US Equities' },
  { value: 'ARCA',    label: 'NYSE Arca',                       group: 'US Equities' },
  { value: 'IEX',     label: 'IEX',                             group: 'US Equities' },
  { value: 'LSE',     label: 'London Stock Exchange',           group: 'EU/UK' },
  { value: 'XETRA',   label: 'Deutsche Börse · Xetra',          group: 'EU/UK' },
  { value: 'EURONEXT',label: 'Euronext Paris',                  group: 'EU/UK' },
  { value: 'TSE',     label: 'Tokyo Stock Exchange',            group: 'APAC' },
  { value: 'HKEX',    label: 'Hong Kong Exchange',              group: 'APAC' },
  { value: 'ASX',     label: 'Australian Securities Exchange',  group: 'APAC' },
];

const ORDER_TYPES = [
  { value: 'market',  label: 'Market' },
  { value: 'limit',   label: 'Limit' },
  { value: 'stop',    label: 'Stop' },
  { value: 'sl',      label: 'Stop-Limit' },
  { value: 'twap',    label: 'TWAP' },
  { value: 'vwap',    label: 'VWAP' },
];

export default {
  title: 'Primitives/Select',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Native `<select>` underneath for best a11y and keyboard support, ' +
          'wrapped in chrome that visually matches Input. Supports `<optgroup>` ' +
          'for venue or jurisdiction groupings.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    placeholder: { control: 'text', table: { category: 'Content' } },
    value: { control: 'text', table: { category: 'Content' } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Variant' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    required: { control: 'boolean', table: { category: 'State' } },
    error: { control: 'text', table: { category: 'State' } },
    helper: { control: 'text', table: { category: 'Content' } },
    options: { control: 'object', table: { category: 'Content' } },
  },
  args: {
    label: 'Order type',
    options: ORDER_TYPES,
    placeholder: 'Choose order type',
    size: 'md',
    helper: 'Defaults to Market when not set.',
  },
  render: (args) => Select(args),
};

export const Default = {};

export const PreSelected = {
  args: { value: 'limit', helper: '' },
};

export const Grouped = {
  name: 'Use case · execution venue (grouped)',
  args: {
    label: 'Execution venue',
    options: VENUES,
    placeholder: 'Select venue',
    helper: 'MiFID II Art 27 best-execution evidence will be retained.',
  },
};

export const Required = {
  args: { required: true, helper: '' },
};

export const WithError = {
  args: {
    value: '',
    error: 'Order type is required before submission.',
  },
};

export const Disabled = {
  args: { value: 'market', disabled: true },
};

export const Sizes = {
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes share the same height ladder as Button + Input.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    ['sm', 'md', 'lg'].forEach((size) => {
      root.appendChild(Select({
        label: size.toUpperCase(),
        options: ORDER_TYPES,
        placeholder: `${size} select`,
        size,
      }));
    });
    return root;
  },
};
