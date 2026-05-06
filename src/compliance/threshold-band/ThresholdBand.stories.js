import { ThresholdBand } from './ThresholdBand.js';

export default {
  title: 'Compliance/Threshold Band',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pre-trade 3-tier escalation indicator. Maps a notional onto a ' +
          'jurisdictional threshold ladder so the operator sees not just ' +
          '*what* tier they are in, but *how close* to the next escalation. ' +
          'Two threshold ticks (disclose · block) sit on the bar; the live ' +
          'pin shows the current notional.\n\n' +
          '**Reg anchors:**\n' +
          '- MAS Notice 626 §8.3 — large-trade AML thresholds (S$5M / S$50M)\n' +
          '- FINRA 4210(g) — single-name concentration caps\n' +
          '- 31 CFR 1010.311 — CTR threshold ($10K)',
      },
    },
  },
  argTypes: {
    notional: { control: { type: 'number', step: 1000 }, table: { category: 'Order' } },
    disclosureAt: { control: 'number', table: { category: 'Thresholds' } },
    blockAt: { control: 'number', table: { category: 'Thresholds' } },
    trackMax: { control: 'number', table: { category: 'Thresholds' } },
    jurisdiction: { control: 'text', table: { category: 'Content' } },
    currency: {
      control: { type: 'inline-radio' },
      options: ['USD', 'SGD', 'EUR'],
      table: { category: 'Content' },
    },
  },
  args: {
    notional: 2_500_000,
    disclosureAt: 5_000_000,
    blockAt: 50_000_000,
    jurisdiction: 'SG MAS Notice 626 §8.3',
    currency: 'SGD',
  },
  render: (args) => ThresholdBand(args),
};

export const Compliant = {};

export const DisclosureRequired = {
  args: { notional: 12_500_000 },
};

export const Blocked = {
  args: { notional: 58_000_000 },
};

export const PreTradeProgression = {
  name: 'Use case · operator dialing notional up',
  parameters: {
    docs: {
      description: {
        story:
          'Three states an operator might see as they dial up the notional ' +
          'on a single order ticket. The pin moves left → right; the bar ' +
          'colour shifts from compliant → disclosure → blocked. The labels ' +
          'and reg citation stay constant — only the operator&rsquo;s ' +
          'position on the ladder changes.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    root.style.maxWidth = '720px';
    [2_500_000, 12_500_000, 58_000_000].forEach((notional) =>
      root.appendChild(
        ThresholdBand({
          notional,
          disclosureAt: 5_000_000,
          blockAt: 50_000_000,
          jurisdiction: 'SG MAS Notice 626 §8.3',
          currency: 'SGD',
        }),
      ),
    );
    return root;
  },
};

export const FINRAConcentration = {
  name: 'Use case · FINRA 4210(g) concentration',
  parameters: {
    docs: {
      description: {
        story:
          'Different jurisdiction, different thresholds — the band shape ' +
          'stays consistent so operators across desks read it the same way.',
      },
    },
  },
  args: {
    notional: 8_500_000,
    disclosureAt: 5_000_000,
    blockAt: 10_000_000,
    jurisdiction: 'FINRA 4210(g) · single-name concentration',
    currency: 'USD',
  },
};
