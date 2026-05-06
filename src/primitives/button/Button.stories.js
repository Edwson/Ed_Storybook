/**
 * Button stories — full args / argTypes / autodocs
 *
 * Demonstrates the Storybook 9 CSF 3 pattern this library uses for every
 * primitive: each story is an `args` object, controls panel exposes every
 * meaningful prop, autodocs renders the doc page from the JSDoc above the
 * render function.
 */

import { Button } from './Button.js';

const arrowRightSvg = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7"/>
  </svg>
`;

const downloadSvg = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
`;

export default {
  title: 'Primitives/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Five variants — primary, secondary, ghost, danger, link. ' +
          'Three sizes. States for disabled, loading, block. ' +
          'WCAG 2.1 AA on all variants. Loading sets aria-busy=true and ' +
          'disables interaction. Reduced-motion stops the spinner.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Button label',
      table: { category: 'Content' },
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger', 'link'],
      description: 'Visual variant',
      table: { category: 'Variant', defaultValue: { summary: 'primary' } },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Size token',
      table: { category: 'Variant', defaultValue: { summary: 'md' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interaction (sets aria-disabled)',
      table: { category: 'State' },
    },
    loading: {
      control: 'boolean',
      description: 'Show spinner, sets aria-busy=true',
      table: { category: 'State' },
    },
    block: {
      control: 'boolean',
      description: 'Stretch to container width',
      table: { category: 'Layout' },
    },
    iconLeft: {
      control: false,
      description: 'Inline SVG (use the svg-icon helper or pass a string)',
      table: { category: 'Slots' },
    },
    iconRight: {
      control: false,
      description: 'Inline SVG',
      table: { category: 'Slots' },
    },
    onClick: {
      action: 'clicked',
      table: { category: 'Events' },
    },
  },
  args: {
    label: 'Submit order',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    block: false,
  },
  render: (args) => Button(args),
};

export const Primary = {};

export const Secondary = {
  args: { variant: 'secondary', label: 'Cancel' },
};

export const Ghost = {
  args: { variant: 'ghost', label: 'Dismiss' },
};

export const Danger = {
  args: { variant: 'danger', label: 'Force-close position' },
};

export const Link = {
  args: { variant: 'link', label: 'Read field note →' },
};

export const Sizes = {
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes share the same height-token ladder used across the system. ' +
          'Use `sm` inside dense data tables, `md` everywhere else, ' +
          '`lg` only for hero CTAs.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    root.appendChild(Button({ label: 'Small', size: 'sm' }));
    root.appendChild(Button({ label: 'Medium (default)', size: 'md' }));
    root.appendChild(Button({ label: 'Large', size: 'lg' }));
    return root;
  },
};

export const States = {
  parameters: {
    docs: {
      description: {
        story:
          'Default · hover (interact) · disabled · loading. ' +
          'Loading sets `aria-busy=true` so screen readers announce the change.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    root.appendChild(Button({ label: 'Default' }));
    root.appendChild(Button({ label: 'Disabled', disabled: true }));
    root.appendChild(Button({ label: 'Loading', loading: true }));
    return root;
  },
};

export const WithIcons = {
  args: {
    label: 'Continue',
    iconRight: arrowRightSvg,
  },
};

export const Variants = {
  parameters: {
    docs: {
      description: {
        story: 'All five variants side-by-side at the default size.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    ['primary', 'secondary', 'ghost', 'danger', 'link'].forEach((v) => {
      root.appendChild(Button({ label: v.replace(/^./, (c) => c.toUpperCase()), variant: v }));
    });
    return root;
  },
};

export const InstitutionalUseCase = {
  name: 'Use case · order ticket footer',
  parameters: {
    docs: {
      description: {
        story:
          'A real composition. Ghost cancel + secondary save-draft + ' +
          'primary submit. Order is deliberately right-to-left in importance.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    root.style.justifyContent = 'flex-end';
    root.style.padding = '16px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '8px';
    root.appendChild(Button({ label: 'Cancel', variant: 'ghost' }));
    root.appendChild(Button({ label: 'Save draft', variant: 'secondary' }));
    root.appendChild(Button({
      label: 'Submit · BUY 200 SPY @ 487.30',
      variant: 'primary',
      iconRight: arrowRightSvg,
    }));
    return root;
  },
};
