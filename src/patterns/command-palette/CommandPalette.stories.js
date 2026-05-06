import { CommandPalette } from './CommandPalette.js';

const TRADEX_ITEMS = [
  // Navigation
  { id: 'go-obs', label: 'Go to Observatory', eyebrow: 'Go', shortcut: '1', group: 'Navigation' },
  { id: 'go-pf',  label: 'Go to Portfolio Lens', eyebrow: 'Go', shortcut: '2', group: 'Navigation' },
  { id: 'go-bt',  label: 'Go to Backtest Workbench', eyebrow: 'Go', shortcut: '3', group: 'Navigation' },
  { id: 'go-sig', label: 'Go to Signal Feed', eyebrow: 'Go', shortcut: '4', group: 'Navigation' },
  { id: 'go-desk', label: 'Go to Desk · Paper trading', eyebrow: 'Go', shortcut: 'G→D', group: 'Navigation' },

  // Strategy
  { id: 'st-bh',   label: 'Strategy · Buy & Hold', eyebrow: 'Strategy', group: 'Backtest' },
  { id: 'st-rg',   label: 'Strategy · Regime-conditional weights', eyebrow: 'Strategy', group: 'Backtest' },
  { id: 'st-60',   label: 'Strategy · Static 60/40', eyebrow: 'Strategy', group: 'Backtest' },
  { id: 'st-vix',  label: 'Strategy · VIX gate', eyebrow: 'Strategy', group: 'Backtest' },

  // Filters
  { id: 'f-all',   label: 'Filter · All signals', eyebrow: 'Filter', group: 'Signal Feed' },
  { id: 'f-rg',    label: 'Filter · Regime transitions only', eyebrow: 'Filter', group: 'Signal Feed' },
  { id: 'f-vix',   label: 'Filter · VIX threshold crossings', eyebrow: 'Filter', group: 'Signal Feed' },
  { id: 'f-dd',    label: 'Filter · Drawdown triggers', eyebrow: 'Filter', group: 'Signal Feed' },

  // Help
  { id: 'help',    label: 'Show keyboard shortcuts', eyebrow: 'Help', shortcut: '?', group: 'Help' },
];

export default {
  title: 'Patterns/Command Palette',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The institutional Cmd+K surface. Token-fuzzy match (exact 100 / ' +
          'prefix 50 / substring 20 / per-token 5), arrow-key navigation, ' +
          'Enter to activate, Esc to close. Items can carry an eyebrow tag ' +
          '(Go / Strategy / Filter / Help), a hint, and a shortcut pill. ' +
          'Used in TradeX_Platform v0.3 + demo-trading-terminal.',
      },
    },
  },
  argTypes: {
    open: { control: 'boolean', table: { category: 'Display' } },
    placeholder: { control: 'text', table: { category: 'Content' } },
  },
  args: {
    items: TRADEX_ITEMS,
    open: true,
    placeholder: 'Type to search · ⌘K',
  },
  render: (args) => CommandPalette(args),
};

export const TradeXShortcuts = {
  name: 'TradeX terminal · 14 commands',
};

export const FewItems = {
  name: 'Short list',
  args: {
    items: [
      { id: 'a', label: 'Approve diff row 01', eyebrow: 'Action', shortcut: '⌘↵' },
      { id: 'b', label: 'Reject diff row 01', eyebrow: 'Action' },
      { id: 'c', label: 'View audit trail', eyebrow: 'Go' },
    ],
  },
};

export const Empty = {
  name: 'Empty state',
  args: {
    items: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'When no items match the search, an empty-state line appears.',
      },
    },
  },
};
