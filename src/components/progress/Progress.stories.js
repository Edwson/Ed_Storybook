import { Progress } from './Progress.js';

export default {
  title: 'Components/Progress',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Linear progress with five semantic variants (default / success / ' +
          'warning / danger / info), three sizes, optional stripes, and an ' +
          'indeterminate mode. Value labels render four ways: `inside`, ' +
          '`outside-right` (default), `outside-left`, or `top`.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 }, table: { category: 'Range' } },
    max: { control: 'number', table: { category: 'Range' } },
    variant: {
      control: { type: 'inline-radio' },
      options: ['default', 'success', 'warning', 'danger', 'info'],
      table: { category: 'Display' },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Display' },
    },
    striped: { control: 'boolean', table: { category: 'Display' } },
    animated: { control: 'boolean', table: { category: 'Display' } },
    indeterminate: { control: 'boolean', table: { category: 'State' } },
    showValue: { control: 'boolean', table: { category: 'Display' } },
    valuePosition: {
      control: { type: 'select' },
      options: ['inside', 'outside-right', 'outside-left', 'top'],
      table: { category: 'Display' },
    },
    valueFormat: {
      control: { type: 'inline-radio' },
      options: ['%', 'fraction'],
      table: { category: 'Display' },
    },
    label: { control: 'text', table: { category: 'Content' } },
    helperText: { control: 'text', table: { category: 'Content' } },
  },
  args: {
    value: 60,
    max: 100,
    variant: 'default',
    size: 'md',
    striped: false,
    animated: false,
    indeterminate: false,
    showValue: true,
    valuePosition: 'outside-right',
    valueFormat: '%',
    label: 'KYC progress',
    helperText: '',
  },
  render: (args) => Progress(args),
};

export const Default = {};

export const Variants = {
  parameters: {
    docs: {
      description: {
        story:
          'Five semantic variants. Direction is colour + variant label ' +
          'together — never colour alone (deuteranopia-safe).',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '14px';
    [
      { variant: 'default', label: 'Default · neutral', value: 50 },
      { variant: 'success', label: 'Success · KYC complete', value: 100 },
      { variant: 'info',    label: 'Info · capacity used',  value: 35 },
      { variant: 'warning', label: 'Warning · risk approaching limit', value: 78 },
      { variant: 'danger',  label: 'Danger · breach',       value: 92 },
    ].forEach((p) => root.appendChild(Progress({ ...p, valuePosition: 'outside-right' })));
    return root;
  },
};

export const Sizes = {
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '14px';
    ['sm', 'md', 'lg'].forEach((s) =>
      root.appendChild(Progress({ size: s, label: `${s.toUpperCase()} bar`, value: 55 }))
    );
    return root;
  },
};

export const Striped = {
  args: { striped: true, value: 65, label: 'Re-balance progress' },
};

export const StripedAnimated = {
  args: { striped: true, animated: true, value: 65, label: 'FIX session sync' },
  parameters: {
    docs: {
      description: {
        story:
          'Animated stripes signal active work without reshuffling the layout. ' +
          '`prefers-reduced-motion: reduce` stops the animation.',
      },
    },
  },
};

export const Indeterminate = {
  args: { indeterminate: true, label: 'Awaiting FIX 4.4 ack…', helperText: 'No value — sweep is the signal.' },
};

export const InsideLabel = {
  args: { valuePosition: 'inside', size: 'lg', value: 72, label: 'Audit completion' },
};

export const FractionFormat = {
  args: { valueFormat: 'fraction', value: 4, max: 7, label: 'Onboarding step' },
};

export const KYCProgressUseCase = {
  name: 'Use case · KYC step progress',
  parameters: {
    docs: {
      description: {
        story:
          'Three KYC stages stacked. The completed step uses `success`, the ' +
          'in-progress step is `default`, and the not-started step is `0`. ' +
          'A compliance officer scans down the column to know exactly where ' +
          'an applicant is.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '12px';
    root.style.maxWidth = '420px';
    [
      { label: 'Identity verification', value: 100, variant: 'success', valueFormat: 'fraction', max: 3 },
      { label: 'Source-of-funds attestation', value: 2, variant: 'default', valueFormat: 'fraction', max: 4 },
      { label: 'Sanctions screen', value: 0, variant: 'default', valueFormat: 'fraction', max: 2, helperText: 'Blocked until source-of-funds completes.' },
    ].forEach((p) => root.appendChild(Progress(p)));
    return root;
  },
};

export const RiskUtilizationUseCase = {
  name: 'Use case · risk utilization',
  parameters: {
    docs: {
      description: {
        story:
          'Three risk meters with semantic variant tied to threshold band. ' +
          'Compare to **VIX Chip** — the VIX chip names the regime, this bar ' +
          'shows distance to the next regulatory escalation.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '14px';
    root.style.maxWidth = '420px';
    [
      { label: 'Single-name exposure',     value: 38, max: 100, variant: 'success', helperText: 'FINRA 4210(g) limit · 5%.' },
      { label: 'Sector concentration',     value: 71, max: 100, variant: 'warning', helperText: 'Approaching MAS Notice 626 §8.3 cap.' },
      { label: 'Counterparty credit limit', value: 96, max: 100, variant: 'danger',  helperText: 'Breach — operations escalation triggered.' },
    ].forEach((p) => root.appendChild(Progress(p)));
    return root;
  },
};
