import { Alert } from './Alert.js';

export default {
  title: 'Components/Alert',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Inline status notice — generic semantic, four variants. ' +
          'For regulatory / jurisdictional disclosures, use Disclosure ' +
          'Banner instead. `role="alert"` on `danger` (interrupts assistive ' +
          'tech); `role="status"` on the others (announces politely).',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['info', 'success', 'warning', 'danger'],
      table: { category: 'Variant' },
    },
    title: { control: 'text', table: { category: 'Content' } },
    body: { control: 'text', table: { category: 'Content' } },
    actionLabel: { control: 'text', table: { category: 'Slots' } },
    dismissible: { control: 'boolean', table: { category: 'Behaviour' } },
    onAction: { action: 'action-clicked', table: { category: 'Events' } },
    onDismiss: { action: 'dismissed', table: { category: 'Events' } },
  },
  args: {
    variant: 'info',
    title: 'Compliance review queued',
    body: 'Your draft will be reviewed by Legal within 2 business days.',
    actionLabel: '',
    dismissible: false,
  },
  render: (args) => Alert(args),
};

export const Info = {};

export const Success = {
  args: {
    variant: 'success',
    title: 'Order acknowledged',
    body: 'FIX 8 received from venue · OrdStatus 0 (New) · seqNum 1247.',
  },
};

export const Warning = {
  args: {
    variant: 'warning',
    title: 'Margin headroom narrow',
    body: 'Account is at 78% of Reg T initial. Consider reducing position size before next entry.',
    actionLabel: 'Reduce',
  },
};

export const Danger = {
  args: {
    variant: 'danger',
    title: 'Order rejected',
    body: 'Risk gate blocked submission — account VaR would exceed daily limit. See risk panel for breakdown.',
    actionLabel: 'View risk',
  },
};

export const AllVariants = {
  parameters: {
    docs: {
      description: {
        story: 'All four variants stacked, same layout, different semantic.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    root.style.maxWidth = '560px';
    [
      { variant: 'info',    title: 'Compliance review queued', body: 'Your draft will be reviewed by Legal within 2 business days.' },
      { variant: 'success', title: 'Order acknowledged',       body: 'FIX 8 received from venue · OrdStatus 0 (New) · seqNum 1247.' },
      { variant: 'warning', title: 'Margin headroom narrow',   body: 'Account is at 78% of Reg T initial.', actionLabel: 'Reduce' },
      { variant: 'danger',  title: 'Order rejected',           body: 'Risk gate blocked submission — VaR would exceed daily limit.', actionLabel: 'View risk' },
    ].forEach((p) => root.appendChild(Alert(p)));
    return root;
  },
};

export const Dismissible = {
  args: {
    variant: 'info',
    title: 'New regulatory rewrite available',
    body: 'ASIC RG 268 v3.2 was published. Affected components have been flagged for review.',
    dismissible: true,
  },
};

export const TitleOnly = {
  args: { title: '', body: 'A single-line alert without a title is fine for short factual notices.' },
};
