import { Tabs } from './Tabs.js';
import './tabs.css';

export default {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tabs let users move between related views without leaving the page. ' +
          'A tab strip includes at least two tabs; only one is engaged at a time, ' +
          'differentiated by a 2-px accent indicator under the active label.\n\n' +
          '**Two appearances** — Bordered (boxed active state on a card) and ' +
          'Transparent (underline only, for tighter layouts).\n\n' +
          '**Keyboard** — Left/Right move focus between tabs, Home/End jump to ' +
          'first/last; Enter or Space activates the focused tab. Disabled tabs ' +
          'are skipped during keyboard navigation.\n\n' +
          '**Reg context** — used in compliance dashboards to switch between ' +
          'Watchlist / Surveillance / SAR / Audit views without losing context. ' +
          'Default tab is the most recently active surface for the operator.',
      },
    },
  },
  argTypes: {
    appearance: {
      control: { type: 'inline-radio' },
      options: ['bordered', 'transparent'],
      table: { category: 'Appearance' },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
      table: { category: 'Size' },
    },
    block: { control: 'boolean', table: { category: 'Layout' } },
  },
  args: {
    appearance: 'bordered',
    size: 'md',
    block: false,
    tabs: [
      { id: 'positions', label: 'Positions', content: 'Live unrealized P&L across 12 holdings.' },
      { id: 'orders', label: 'Orders', content: 'Working / Pending New / Filled across 8 venues.' },
      { id: 'blotter', label: 'Blotter', content: "Today's execution record (SEC 17a-4 retention)." },
    ],
  },
  render: (args) => Tabs(args),
};

export const Bordered = {};

export const Transparent = {
  args: { appearance: 'transparent' },
};

export const Block = {
  args: {
    block: true,
    tabs: [
      { id: 'home', label: 'Home', content: 'Home overview.' },
      { id: 'tx', label: 'Transactions', content: 'Recent activity.' },
      { id: 'loans', label: 'Loans', content: 'Outstanding facilities.' },
      { id: 'liquidity', label: 'Liquidity', content: 'Cash + same-day settle.' },
    ],
  },
};

export const Small = { args: { size: 'sm' } };

export const WithBadges = {
  args: {
    tabs: [
      { id: 'inbox', label: 'Inbox', badge: '3', content: '3 alerts pending triage.' },
      { id: 'review', label: 'Under review', badge: '12', content: '12 KYC files in EDD.' },
      { id: 'cleared', label: 'Cleared', badge: '0', content: 'Nothing to do — go home.' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Numeric badge per tab. Active tab's badge picks up the accent border " +
          'so the count stays readable at a glance (FINRA-style review queue).',
      },
    },
  },
};

export const WithDisabled = {
  args: {
    tabs: [
      { id: 'overview', label: 'Overview', content: 'Account overview.' },
      { id: 'orders', label: 'Orders', content: 'Working orders.' },
      { id: 'reports', label: 'Reports', content: '', disabled: true },
      { id: 'settings', label: 'Settings', content: 'Persona + density.' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled tab stays in the strip but is skipped by keyboard navigation ' +
          'and ignores clicks. Use sparingly — prefer hiding the tab if its content ' +
          'is genuinely unavailable.',
      },
    },
  },
};

export const UseCase_ComplianceWorkbench = {
  name: 'Use case · Compliance workbench',
  args: {
    appearance: 'transparent',
    tabs: [
      { id: 'queue', label: 'Alert queue', badge: '4', content: '4 alerts awaiting L1 triage.' },
      { id: 'sar', label: 'SAR drafts', badge: '2', content: '2 SAR drafts open · 30-day BSA clock running.' },
      { id: 'cases', label: 'Open cases', badge: '7', content: '7 cases in active investigation.' },
      { id: 'audit', label: 'Audit trail', content: 'Full 17a-4 retention timeline (read-only).' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Transparent tabs with badges in a compliance workbench. The Audit trail ' +
          "sits at the right because it's read-only — the operator engages the first " +
          'three for active work and references the fourth for evidence.',
      },
    },
  },
};
