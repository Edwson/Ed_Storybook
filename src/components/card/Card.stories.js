import { Card } from './Card.js';

export default {
  title: 'Components/Card',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Universal surface primitive — case-study tiles, KPI panels, ' +
          'info blocks, dashboard cells. Three optional slots: eyebrow ' +
          '(uppercase mono label), title (display font), body (HTML), ' +
          'meta (footer line above a hairline). Hoverable variant lifts ' +
          'on hover. Elevated variant uses shadow instead of border-only.',
      },
    },
  },
  argTypes: {
    eyebrow: { control: 'text', table: { category: 'Content' } },
    title: { control: 'text', table: { category: 'Content' } },
    body: { control: 'text', table: { category: 'Content' } },
    meta: { control: 'text', table: { category: 'Content' } },
    hoverable: { control: 'boolean', table: { category: 'Behaviour' } },
    elevated: { control: 'boolean', table: { category: 'Appearance' } },
    href: { control: 'text', table: { category: 'Behaviour' } },
    onClick: { action: 'clicked', table: { category: 'Events' } },
  },
  args: {
    eyebrow: 'Case study · 2024',
    title: 'ACY Connect — institutional FIX onboarding',
    body: '<p>Twelve prime brokers onboarded against MiFID II Art 27 disclosure requirements. Same component library, three jurisdictional variants.</p>',
    meta: '100K+ traders · 40+ jurisdictions · $2B daily',
    hoverable: false,
    elevated: false,
  },
  render: (args) => Card(args),
};

export const Default = {};

export const Hoverable = {
  args: { hoverable: true },
};

export const Elevated = {
  args: { elevated: true, hoverable: true },
};

export const TitleOnly = {
  args: { eyebrow: '', body: '', meta: '' },
};

export const NoEyebrow = {
  args: { eyebrow: '' },
};

export const KpiTile = {
  name: 'Use case · KPI tile',
  parameters: {
    docs: {
      description: {
        story:
          'A small Card variant used in dashboard grids. Eyebrow is the ' +
          'metric name; title is the value; meta is the period and source.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
    root.style.gap = '16px';
    [
      { eyebrow: 'Day P&L', title: '+$141,840', meta: 'Apr 24 · paper trade' },
      { eyebrow: 'Open positions', title: '12', meta: '7 long · 5 short' },
      { eyebrow: 'Margin used', title: '38.5%', meta: 'of $10M account' },
      { eyebrow: 'Active alerts', title: '3', meta: '1 SAR draft · 2 review' },
    ].forEach((p) => root.appendChild(Card({ ...p, hoverable: true })));
    return root;
  },
};

export const Grid = {
  name: 'Use case · case-study tile grid',
  parameters: {
    docs: {
      description: {
        story:
          'Three Cards laid out as portfolio tiles. Each is a clickable ' +
          'link (`href` set) — Card auto-renders as `<a>`.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
    root.style.gap = '16px';
    [
      {
        eyebrow: 'CASE STUDY',
        title: 'ACY Securities · design system',
        body: '<p>Five-platform fintech ecosystem, 150 components, eight regulatory rewrites absorbed without a rebuild cycle.</p>',
        meta: '2020 — present',
        href: '#case-acy',
        hoverable: true,
      },
      {
        eyebrow: 'CASE STUDY',
        title: "Christie's · UHNW onboarding",
        body: "<p>High-value auction onboarding with editorial UX. AML checks woven into the intake flow without breaking the room's tone.</p>",
        meta: '2023',
        href: '#case-christies',
        hoverable: true,
      },
      {
        eyebrow: 'FIELD NOTE',
        title: 'Why FIX 4.4 latency dictates form design',
        body: '<p>8–12ms round-trip is not the constraint to design around — it&rsquo;s the constraint that makes consumer safety patterns a tax.</p>',
        meta: '8 min read · Apr 2026',
        href: '#note-fix',
        hoverable: true,
      },
    ].forEach((p) => root.appendChild(Card(p)));
    return root;
  },
};
