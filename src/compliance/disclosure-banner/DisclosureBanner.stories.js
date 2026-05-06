import { DisclosureBanner } from './DisclosureBanner.js';

export default {
  title: 'Compliance/Disclosure Banner',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Inline jurisdictional disclosure surface — three severities ' +
          '(compliant / disclosure-required / blocked) map to the three-band ' +
          'pre-trade pattern. Inline because **modal** disclosure fails ' +
          'the ASIC RG 268 "meaningful engagement" test for cross-border ' +
          'trades.\n\n' +
          'Wires `role="alert"` + `aria-live="assertive"` on `blocked`, ' +
          '`role="status"` + `aria-live="polite"` on the others. ' +
          'Citation slot uses mono font and is meant for a regulatory ' +
          'reference verbatim (e.g., `MAS Notice 626 §8.3`).',
      },
    },
  },
  argTypes: {
    severity: {
      control: { type: 'inline-radio' },
      options: ['compliant', 'disclosure', 'blocked'],
      table: { category: 'Variant' },
    },
    jurisdiction: { control: 'text', table: { category: 'Content' } },
    title: { control: 'text', table: { category: 'Content' } },
    body: { control: 'text', table: { category: 'Content' } },
    citation: { control: 'text', table: { category: 'Content' } },
    actionLabel: { control: 'text', table: { category: 'Slots' } },
    dismissible: { control: 'boolean', table: { category: 'Behaviour' } },
    showIcon: { control: 'boolean', table: { category: 'Display' } },
    onAction: { action: 'action-clicked', table: { category: 'Events' } },
    onDismiss: { action: 'dismissed', table: { category: 'Events' } },
  },
  args: {
    severity: 'compliant',
    jurisdiction: 'EU MiFID II Art 27',
    title: 'Best execution evidence will be retained',
    body: 'Order routing decision and venue selection logged to FIX execution log for client request.',
    citation: 'MiFID II Art 27 · RTS 27/28',
    actionLabel: '',
    dismissible: false,
    showIcon: true,
  },
  render: (args) => DisclosureBanner(args),
};

export const Compliant = {};

export const DisclosureRequired = {
  args: {
    severity: 'disclosure',
    jurisdiction: 'SG MAS Notice 626',
    title: 'Large-trade AML disclosure required',
    body: 'Notional crosses S$5M threshold. Supervisor review required before submission.',
    citation: 'MAS Notice 626 §8 · 31 CFR 1010.311',
    actionLabel: 'Review thresholds',
  },
};

export const Blocked = {
  args: {
    severity: 'blocked',
    jurisdiction: 'SG MAS Notice 626',
    title: 'Pre-clearance required — submission blocked',
    body: 'Notional exceeds S$50M. Pre-clearance from Compliance required before this order can be sent.',
    citation: 'MAS Notice 626 §8.3',
    actionLabel: 'Request pre-clearance',
  },
};

export const WithDismiss = {
  args: {
    severity: 'compliant',
    title: 'Disclosure rendered to client',
    body: 'Pre-trade jurisdictional disclosure was acknowledged. Render event logged to audit trail.',
    citation: 'ASIC RG 268.55',
    dismissible: true,
  },
};

export const Stack = {
  name: 'Use case · pre-trade compliance stack',
  parameters: {
    docs: {
      description: {
        story:
          'Three banners stacked above the order-ticket submit button. The ' +
          'pre-trade jurisdictional check used in the demo terminal — three ' +
          'compliant calls plus one blocking call escalate visually without ' +
          'punitive language.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    root.style.maxWidth = '480px';

    root.appendChild(DisclosureBanner({
      severity: 'compliant',
      jurisdiction: 'EU MiFID II Art 27',
      title: 'Best-execution evidence retained via FIX log',
      citation: 'MiFID II Art 27',
    }));
    root.appendChild(DisclosureBanner({
      severity: 'compliant',
      jurisdiction: 'US SEC Reg NMS Rule 611',
      title: 'Order protection · smart-route enabled',
      citation: 'SEC Rule 611',
    }));
    root.appendChild(DisclosureBanner({
      severity: 'blocked',
      jurisdiction: 'SG MAS Notice 626',
      title: 'Threshold exceeded · pre-clearance required',
      body: 'Notional S$58M > S$50M. Submission blocked until Compliance pre-clearance.',
      citation: 'MAS Notice 626 §8.3',
      actionLabel: 'Request pre-clearance',
    }));
    return root;
  },
};
