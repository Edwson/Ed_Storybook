import { Breadcrumb } from './Breadcrumb.js';

export default {
  title: 'Components/Breadcrumb',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Hierarchical nav crumb. Last item carries `aria-current="page"` ' +
          'and renders as plain text (no link). Whole tree wrapped in ' +
          '`<nav aria-label="Breadcrumb">` for screen-reader semantics. ' +
          'Supports collapse via `maxItems` for deep paths.',
      },
    },
  },
  argTypes: {
    items: { table: { category: 'Content' } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Display' },
    },
    compact: { control: 'boolean', table: { category: 'Display' } },
    maxItems: { control: { type: 'number', min: 0, max: 10 }, table: { category: 'Behaviour' } },
  },
  args: {
    items: [
      { label: 'Compliance', href: '#' },
      { label: 'KYC review', href: '#' },
      { label: 'Step 3 of 5' },
    ],
    size: 'md',
    compact: false,
    maxItems: 0,
  },
  render: (args) => Breadcrumb(args),
};

export const Default = {};

export const TwoLevels = {
  args: {
    items: [
      { label: 'Trading desk', href: '#' },
      { label: 'Order ticket' },
    ],
  },
};

export const DeepPath = {
  args: {
    items: [
      { label: 'Compliance', href: '#' },
      { label: 'AML', href: '#' },
      { label: 'Sanctions screening', href: '#' },
      { label: 'Pending review', href: '#' },
      { label: 'Case #84219' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Five-level path inside an AML investigation surface. ' +
          'No truncation — every level visible. For very narrow ' +
          'containers, use `compact` or `maxItems`.',
      },
    },
  },
};

export const Collapsed = {
  args: {
    items: [
      { label: 'Compliance', href: '#' },
      { label: 'AML', href: '#' },
      { label: 'Sanctions screening', href: '#' },
      { label: 'Pending review', href: '#' },
      { label: 'Case #84219' },
    ],
    maxItems: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`maxItems: 3` collapses middle items into a `…` overflow ' +
          'button. The overflow has its own `aria-label` so screen readers ' +
          'announce "Show hidden breadcrumb items".',
      },
    },
  },
};

export const WithIcons = {
  args: {
    items: [
      { label: 'Home', href: '#', icon: '◆' },
      { label: 'Trading', href: '#' },
      { label: 'O2der ticket' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Optional `icon` on any crumb. Rendered with `aria-hidden` ' +
          'so the icon is decoration; the label remains the screen-reader ' +
          'announcement.',
      },
    },
  },
};

export const Sizes = {
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes for three rail densities. **sm** for dense ' +
          'institutional terminals, **md** for default web admin, ' +
          '**lg** for marketing / settings surfaces.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-stack';
    ['sm', 'md', 'lg'].forEach((size) => {
      root.appendChild(
        Breadcrumb({
          size,
          items: [
            { label: 'Section', href: '#' },
            { label: 'Subsection', href: '#' },
            { label: `Size: ${size}` },
          ],
        })
      );
    });
    return root;
  },
};

export const InContext = {
  name: 'Use case · KYC review header',
  parameters: {
    docs: {
      description: {
        story:
          'Breadcrumb sitting above a workflow heading — typical ' +
          'pattern for any multi-step regulated workflow. The breadcrumb ' +
          'gives the analyst orientation; the H1 names the current step.',
      },
    },
  },
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.padding = '20px';
    wrap.style.background = 'var(--bg-surface)';
    wrap.style.border = '1px solid var(--border)';
    wrap.style.borderRadius = '8px';
    wrap.appendChild(
      Breadcrumb({
        size: 'sm',
        items: [
          { label: 'Compliance', href: '#' },
          { label: 'KYC', href: '#' },
          { label: 'Customer #84219', href: '#' },
          { label: 'Enhanced Due Diligence' },
        ],
      })
    );
    const h1 = document.createElement('h1');
    h1.style.margin = '8px 0 0 0';
    h1.style.fontFamily = 'Cormorant Garamond, serif';
    h1.style.fontSize = '1.6rem';
    h1.style.color = 'var(--text-primary)';
    h1.style.fontWeight = '500';
    h1.textContent = 'Source-of-funds review';
    wrap.appendChild(h1);
    const sub = document.createElement('p');
    sub.style.margin = '4px 0 0 0';
    sub.style.fontFamily = 'Inter, sans-serif';
    sub.style.fontSize = '0.85rem';
    sub.style.color = 'var(--text-tertiary)';
    sub.textContent = '31 CFR 1010.230 · FATF Rec 10 + 12';
    wrap.appendChild(sub);
    return wrap;
  },
};
