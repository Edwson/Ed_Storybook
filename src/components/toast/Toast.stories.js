import { Toast, ToastStack } from './Toast.js';

export default {
  title: 'Components/Toast',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Transient notification. Four variants × icon × optional message ' +
          '× optional action buttons. **Variant determines the ARIA role**: ' +
          '`info` / `success` use `role="status"` (polite), `warning` / ' +
          '`danger` use `role="alert"` (assertive — screen readers interrupt). ' +
          'This matches institutional convention — a kill-switch trip ' +
          'should interrupt; an order confirmation should not.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    message: { control: 'text', table: { category: 'Content' } },
    variant: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'danger'],
      table: { category: 'Variant' },
    },
    dismissable: { control: 'boolean', table: { category: 'Behaviour' } },
  },
  args: {
    title: 'Order submitted',
    message: 'Order #4521 · 1,000 SPY @ market · routed to NYSE',
    variant: 'success',
    dismissable: true,
  },
  render: (args) => Toast(args),
};

export const Default = {};

export const Variants = {
  parameters: {
    docs: {
      description: {
        story:
          'All four variants. **info** for ambient notices, **success** ' +
          'for confirmations, **warning** for soft attention (regime change, ' +
          'session reconnect), **danger** for hard interruption (kill-switch, ' +
          'risk breach, order reject).',
      },
    },
  },
  render: () => {
    const stack = document.createElement('div');
    stack.className = 'eds-stack';
    [
      { variant: 'info', title: 'Disclosure rendered',
        message: 'MAS Notice 626 §8.3 disclosure logged with hash 7a8b...' },
      { variant: 'success', title: 'Order #4521 filled',
        message: '1,000 SPY @ 488.42 · NYSE · 8ms' },
      { variant: 'warning', title: 'Regime transition · Bear',
        message: 'Margin requirement increased 25%. Open positions reviewed.' },
      { variant: 'danger', title: 'Kill switch tripped',
        message: 'All open orders cancelled. SEC 15c3-5 audit trail preserved.' },
    ].forEach((p) => stack.appendChild(Toast(p)));
    return stack;
  },
};

export const WithActions = {
  args: {
    title: 'Disconnect from FIX session?',
    message: 'You have 3 open orders. Cancel them or leave them working?',
    variant: 'warning',
    actions: [
      { label: 'Cancel all', onClick: () => {} },
      { label: 'Leave working', onClick: () => {} },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Action toasts replace the modal pattern for low-stakes ' +
          'confirmations — non-blocking, dismissable, gives the user ' +
          'two paths without taking over the screen.',
      },
    },
  },
};

export const Persistent = {
  args: {
    title: 'Connection lost',
    message: 'Reconnecting to market data feed... Last update 14s ago.',
    variant: 'danger',
    dismissable: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Non-dismissable toast — used for live system state ' +
          '(connection lost, session degraded). The toast only ' +
          'disappears when the underlying state clears, programmatically.',
      },
    },
  },
};

export const TitleOnly = {
  args: {
    title: 'Saved',
    message: '',
    variant: 'success',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Title-only toast for low-information confirmations. ' +
          'Shorter visual footprint, faster scan.',
      },
    },
  },
};

export const Stack = {
  parameters: {
    docs: {
      description: {
        story:
          'Stack container for queued notifications. Position via ' +
          '`top-right` (default) / `top-left` / `bottom-right` / `bottom-left`. ' +
          'In production, wire this to a notification queue with debounce ' +
          'so a flurry of FIX events does not flood the screen.',
      },
    },
  },
  render: () => {
    // Use relative positioning inside the story preview so the fixed
    // stack does not float over the Storybook chrome itself.
    const wrap = document.createElement('div');
    wrap.style.position = 'relative';
    wrap.style.minHeight = '320px';
    wrap.style.padding = '16px';
    wrap.style.background = 'var(--bg-deep, var(--bg-surface))';
    wrap.style.border = '1px dashed var(--border)';
    wrap.style.borderRadius = '6px';

    const note = document.createElement('div');
    note.style.fontFamily = 'JetBrains Mono, monospace';
    note.style.fontSize = '11px';
    note.style.color = 'var(--text-muted)';
    note.style.letterSpacing = '0.08em';
    note.style.textTransform = 'uppercase';
    note.textContent = 'simulated app surface';
    wrap.appendChild(note);

    const stack = ToastStack('top-right');
    stack.style.position = 'absolute';
    stack.style.top = '16px';
    stack.style.right = '16px';
    [
      { variant: 'success', title: 'Order #4521 filled' },
      { variant: 'warning', title: 'VIX > 30 · margin escalated', message: 'FINRA 4210(g)' },
      { variant: 'info', title: 'Disclosure rendered', message: '17a-4 hash logged' },
    ].forEach((p) => stack.appendChild(Toast(p)));
    wrap.appendChild(stack);
    return wrap;
  },
};
