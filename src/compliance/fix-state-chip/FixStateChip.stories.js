import { FixStateChip } from './FixStateChip.js';

export default {
  title: 'Compliance/FIX State Chip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'FIX 4.4 OrdStatus indicator (tag 39). Renders the single-character ' +
          'protocol code in mono + the human-readable label. Six states cover ' +
          '~99% of single-broker order flow:\n\n' +
          '- **A** Pending New — order received, awaiting venue ack\n' +
          '- **0** New — accepted by venue, working in book\n' +
          '- **1** Partial — partially filled, `LeavesQty > 0`\n' +
          '- **2** Filled — fully filled, `LeavesQty = 0`\n' +
          '- **4** Canceled — cancelled by client or venue\n' +
          '- **8** Rejected — see `Text` (tag 58) for reason\n\n' +
          '**Reg context:** SEC Rule 17a-4 requires retention of OrdStatus ' +
          'transitions for execution records. FINRA OATS hooks off OrdStatus.',
      },
    },
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['pending-new', 'new', 'partial', 'filled', 'canceled', 'rejected'],
      table: { category: 'State' },
    },
    showCode: { control: 'boolean', table: { category: 'Display' } },
    compact: { control: 'boolean', table: { category: 'Display' } },
    tooltip: { control: 'text', table: { category: 'Content' } },
  },
  args: {
    status: 'filled',
    showCode: true,
    compact: false,
  },
  render: (args) => FixStateChip(args),
};

export const Filled = {};

export const AllSixStates = {
  parameters: {
    docs: {
      description: {
        story:
          'All six states stacked. Tone reflects severity: filled (success), ' +
          'partial (accent), new (info), pending-new (warn), canceled ' +
          '(neutral), rejected (danger).',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    ['pending-new', 'new', 'partial', 'filled', 'canceled', 'rejected'].forEach((s) =>
      root.appendChild(FixStateChip({ status: s })),
    );
    return root;
  },
};

export const Compact = {
  args: { compact: true },
  parameters: {
    docs: {
      description: {
        story:
          'Compact size for use inside dense table rows (Order Row, Blotter).',
      },
    },
  },
};

export const NoCode = {
  args: { showCode: false },
};

export const InOrderTransition = {
  name: 'Use case · order lifecycle (left → right)',
  parameters: {
    docs: {
      description: {
        story:
          'A single order transitions through states left to right. This is ' +
          'how the audit trail for a single ClOrdID reads in an SEC 17a-4 ' +
          'execution record.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'flex';
    root.style.alignItems = 'center';
    root.style.gap = '8px';
    root.style.padding = '12px 16px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '8px';
    root.style.fontFamily = 'JetBrains Mono, monospace';
    root.style.fontSize = '11px';
    root.style.color = 'var(--text-tertiary)';

    const tsLabel = document.createElement('span');
    tsLabel.textContent = '14:32:08.142';
    tsLabel.style.color = 'var(--text-muted)';
    root.appendChild(tsLabel);

    [
      { status: 'pending-new', compact: true },
      { status: 'new', compact: true },
      { status: 'partial', compact: true },
      { status: 'filled', compact: true },
    ].forEach((p, i) => {
      if (i > 0) {
        const arrow = document.createElement('span');
        arrow.textContent = '→';
        arrow.style.color = 'var(--text-muted)';
        root.appendChild(arrow);
      }
      root.appendChild(FixStateChip(p));
    });
    return root;
  },
};

export const RejectedRow = {
  name: 'Use case · rejected order with reason',
  parameters: {
    docs: {
      description: {
        story:
          'When status is rejected, the calling row should also surface ' +
          'FIX tag 58 (Text). Here it sits next to the chip for context.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'flex';
    root.style.alignItems = 'center';
    root.style.gap = '8px';
    root.style.padding = '8px 12px';
    root.style.background = 'var(--color-danger-subtle)';
    root.style.border = '1px solid var(--color-danger-border)';
    root.style.borderRadius = '8px';
    root.style.fontFamily = 'JetBrains Mono, monospace';
    root.style.fontSize = '11px';
    root.appendChild(FixStateChip({ status: 'rejected', compact: true }));
    const reason = document.createElement('span');
    reason.style.color = 'var(--color-danger)';
    reason.style.letterSpacing = '0.04em';
    reason.textContent = 'Risk gate · concentration limit (single name 105% of cap)';
    root.appendChild(reason);
    return root;
  },
};
