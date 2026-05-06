import { KycStep } from './KycStep.js';

export default {
  title: 'Compliance/KYC Step',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Single step in a multi-step KYC / EDD flow. Four statuses ' +
          '(pending / active / complete / blocked) map to bar colour + ' +
          'numeral glyph (✓ on complete, ! on blocked). Each step exposes ' +
          'the regulation it satisfies, so users see *why* they are being ' +
          'asked for the document — this is the pattern from the ' +
          '"Why KYC Drop-Off Spikes at EDD" field note that lifted ' +
          'completion from 35% to 70%.',
      },
    },
  },
  argTypes: {
    index: { control: { type: 'number', min: 1, max: 9 }, table: { category: 'Identity' } },
    status: {
      control: { type: 'select' },
      options: ['pending', 'active', 'complete', 'blocked'],
      table: { category: 'State' },
    },
    title: { control: 'text', table: { category: 'Content' } },
    helper: { control: 'text', table: { category: 'Content' } },
    citation: { control: 'text', table: { category: 'Content' } },
    completedAt: { control: 'text', table: { category: 'Content' } },
    actionLabel: { control: 'text', table: { category: 'Slots' } },
    onAction: { action: 'action-clicked', table: { category: 'Events' } },
  },
  args: {
    index: 3,
    status: 'active',
    title: 'Source of funds',
    helper: 'Upload a bank statement or letter from a regulated financial institution covering the source of the deposit.',
    citation: 'FATF Rec 10 · MAS Notice 626 §8.4',
    actionLabel: 'Upload statement',
  },
  render: (args) => KycStep(args),
};

export const Active = {};

export const Pending = {
  args: { status: 'pending', title: 'PEP screening', helper: 'Runs automatically once Source of funds is verified.', actionLabel: '' },
};

export const Complete = {
  args: {
    status: 'complete',
    index: 1,
    title: 'Identity document',
    helper: 'Government-issued photo ID with name, date of birth, and document number captured.',
    citation: '31 CFR 1010.230 · CIP',
    completedAt: 'Apr 22, 14:32',
    actionLabel: '',
  },
};

export const Blocked = {
  args: {
    status: 'blocked',
    index: 4,
    title: 'UBO chain',
    helper: 'BVI shell structure resolved to one beneficial owner — but the owner appears on the OFAC SDN list. Compliance review required before continuing.',
    citation: '31 CFR 1010.230 · OFAC SDN check',
    actionLabel: 'Escalate to Compliance',
  },
};

export const FullFlow = {
  name: 'Use case · UHNW EDD flow (5 steps)',
  parameters: {
    docs: {
      description: {
        story:
          'A complete EDD flow showing all four statuses in context. Each ' +
          'step carries its regulatory anchor in the citation slot. The ' +
          'reader can see at a glance what is done, what is next, and ' +
          'where compliance has stopped progress.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    root.style.maxWidth = '640px';
    root.style.gap = '8px';

    [
      {
        index: 1,
        status: 'complete',
        title: 'Identity document',
        helper: 'Government-issued photo ID with name, date of birth, and document number captured.',
        citation: '31 CFR 1010.230 · CIP',
        completedAt: 'Apr 22, 14:32',
      },
      {
        index: 2,
        status: 'complete',
        title: 'Address verification',
        helper: 'Utility bill dated within 90 days, matching the residential address provided.',
        citation: 'FATF Rec 10 · MAS Notice 626 §8.2',
        completedAt: 'Apr 22, 14:48',
      },
      {
        index: 3,
        status: 'active',
        title: 'Source of funds',
        helper: 'Upload a bank statement or letter from a regulated financial institution covering the source of the deposit.',
        citation: 'FATF Rec 10 · MAS Notice 626 §8.4',
        actionLabel: 'Upload statement',
      },
      {
        index: 4,
        status: 'blocked',
        title: 'UBO chain',
        helper: 'BVI shell structure resolved to one beneficial owner — but the owner appears on the OFAC SDN list. Compliance review required before continuing.',
        citation: '31 CFR 1010.230 · OFAC SDN check',
        actionLabel: 'Escalate to Compliance',
      },
      {
        index: 5,
        status: 'pending',
        title: 'PEP & adverse-media screen',
        helper: 'Runs automatically once UBO chain is cleared.',
        citation: 'FATF Rec 12 · FCA SYSC 6.3',
      },
    ].forEach((p) => root.appendChild(KycStep(p)));
    return root;
  },
};
