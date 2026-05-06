import { Modal } from './Modal.js';
import './modal.css';

export default {
  title: 'Components/Modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal is a focused-task overlay used for confirmations, risk-acknowledged ' +
          'actions, and short forms that must be completed before continuing.\n\n' +
          '**Three severities** — Neutral (informational confirm), Warning (recoverable ' +
          'but consequential), Danger (irreversible / regulatory significant).\n\n' +
          '**Three sizes** — sm (acknowledgements), md (default), lg (forms with content).\n\n' +
          '**Reg context** — danger variant is the convention for SAR submission, ' +
          'kill-switch trips, and large-notional pre-trade gate confirmations. The ' +
          'primary button takes the severity tint so the operator cannot proceed ' +
          'without registering the consequence.',
      },
    },
  },
  argTypes: {
    severity: {
      control: { type: 'inline-radio' },
      options: ['neutral', 'warning', 'danger'],
      table: { category: 'Severity' },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Size' },
    },
    title: { control: 'text', table: { category: 'Content' } },
    primaryLabel: { control: 'text', table: { category: 'Actions' } },
    secondaryLabel: { control: 'text', table: { category: 'Actions' } },
    showHeaderIcon: { control: 'boolean', table: { category: 'Display' } },
    showClose: { control: 'boolean', table: { category: 'Display' } },
  },
  args: {
    title: 'Confirm submission',
    body: '<p>You are about to submit a Suspicious Activity Report for <strong>Nicosia Trading Ltd</strong> to FinCEN. Once filed, this action cannot be undone.</p><p>The 30-day BSA clock starts from <strong>detection</strong>, not from filing.</p>',
    primaryLabel: 'File SAR',
    secondaryLabel: 'Save draft',
    severity: 'neutral',
    size: 'md',
    showHeaderIcon: true,
    showClose: true,
  },
  render: (args) => Modal(args),
};

export const Neutral = {};

export const Warning = {
  args: {
    severity: 'warning',
    title: 'Concentration limit warning',
    body: '<p>This order would push <strong>Tesla (TSLA)</strong> to <strong>5.4% of NAV</strong>, exceeding the 5.0% single-name cap (FINRA 4210(g)).</p><p>You can still submit, but the order will be flagged for risk-officer review and may be reduced or rejected.</p>',
    primaryLabel: 'Submit anyway',
    secondaryLabel: 'Cancel',
  },
};

export const Danger = {
  args: {
    severity: 'danger',
    title: 'Trip the kill switch',
    body: '<p>You are about to trip the firm-wide execution kill switch. <strong>All working orders will be canceled</strong> across <strong>40+ jurisdictions</strong> and the message bus will block new submissions until manually re-enabled.</p><p>SEC Rule 15c3-5 requires a written rationale within 60 minutes.</p>',
    primaryLabel: 'Trip kill switch',
    secondaryLabel: 'Cancel',
  },
};

export const Small = {
  args: {
    size: 'sm',
    title: 'Logged out',
    body: 'Your session expired. Please sign in again.',
    primaryLabel: 'Sign in',
    secondaryLabel: '',
    showClose: false,
  },
};

export const Large = {
  args: {
    size: 'lg',
    title: 'Pre-trade compliance gate',
    body: [
      '<p>This trade requires acknowledgement across <strong>three jurisdictions</strong>:</p>',
      '<ul>',
      '  <li><strong>EU MiFID II Art 27</strong> — best-execution evidence retained via FIX log.</li>',
      '  <li><strong>US SEC Reg NMS Rule 611</strong> — order protection · smart-route enabled.</li>',
      '  <li><strong>SG MAS Notice 626</strong> — large-trade AML threshold flagged at \$48M.</li>',
      '</ul>',
      '<p>By submitting, you confirm the trade is suitable per FINRA 2111.</p>',
    ].join(''),
    primaryLabel: 'Acknowledge & submit',
    secondaryLabel: 'Review details',
  },
};

export const NoSecondary = {
  args: {
    title: 'Update available',
    body: 'A new build is available. Refresh to load v0.6.',
    primaryLabel: 'Refresh',
    secondaryLabel: '',
    showClose: true,
  },
};

export const NoIcon = {
  args: { showHeaderIcon: false, title: 'Plain confirm dialog' },
};

export const UseCase_OrderConfirmation = {
  name: 'Use case · Order confirmation',
  args: {
    severity: 'neutral',
    size: 'md',
    title: 'Confirm order',
    body: [
      '<p style="margin-bottom: 8px;"><strong>BUY</strong> · 5,000 SPY @ MARKET</p>',
      '<p style="font-family: \'JetBrains Mono\', monospace; font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 12px;">Notional ~\$2.41M · Day order · Smart route</p>',
      '<p>Pre-trade compliance: <strong>cleared</strong>. Risk: <strong>3.2% of NAV</strong>. Execution venue: <strong>NYSE</strong>.</p>',
    ].join(''),
    primaryLabel: 'Send order',
    secondaryLabel: 'Cancel',
  },
};
