import { Toggle } from './Toggle.js';

export default {
  title: 'Primitives/Toggle',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Toggle vs Checkbox:** a Toggle commits *immediately* — the ' +
          'change takes effect the moment the user flips it. A Checkbox ' +
          'commits on form submit. Use Toggle for binary settings that ' +
          'take effect right away (e.g., live ticks, paper-trade mode, ' +
          'auto-route to dark pools). `role="switch"` is wired so screen ' +
          'readers announce on/off correctly.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    onLabel: { control: 'text', table: { category: 'Content' } },
    offLabel: { control: 'text', table: { category: 'Content' } },
    helper: { control: 'text', table: { category: 'Content' } },
    checked: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
      table: { category: 'Variant' },
    },
    onChange: { action: 'changed', table: { category: 'Events' } },
  },
  args: {
    label: 'Live ticks',
    helper: 'Stream price updates every 1s.',
    onLabel: 'Streaming',
    offLabel: 'Paused',
    checked: true,
    size: 'md',
  },
  render: (args) => Toggle(args),
};

export const On = {};

export const Off = {
  args: { checked: false },
};

export const NoStateLabel = {
  args: {
    label: 'Show after-hours data',
    onLabel: '',
    offLabel: '',
    helper: '',
  },
};

export const Disabled = {
  args: { disabled: true, label: 'Force-close (admin only)' },
};

export const TerminalSettings = {
  name: 'Use case · trading-terminal settings panel',
  parameters: {
    docs: {
      description: {
        story:
          'Several toggles stacked in a settings panel. Each commits ' +
          'immediately — note the state-label changes on flip.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    root.style.maxWidth = '420px';
    root.style.padding = '20px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '12px';

    [
      { label: 'Live ticks',       onLabel: 'Streaming', offLabel: 'Paused', checked: true, helper: 'WebSocket subscription to consolidated tape.' },
      { label: 'Paper trading',    onLabel: 'Paper', offLabel: 'Live', checked: true, helper: 'Demo mode. No real orders sent.' },
      { label: 'Smart routing',    onLabel: 'Auto', offLabel: 'Manual', checked: true, helper: 'Reg NMS Rule 611 protected.' },
      { label: 'Show level 2 book',onLabel: 'On', offLabel: 'Off', checked: false, helper: '' },
      { label: 'After-hours data', onLabel: 'On', offLabel: 'Off', checked: false, helper: '' },
    ].forEach((p) => root.appendChild(Toggle(p)));

    return root;
  },
};
