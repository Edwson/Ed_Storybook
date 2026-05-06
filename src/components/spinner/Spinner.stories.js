import { Spinner } from './Spinner.js';
import './spinner.css';

export default {
  title: 'Components/Spinner',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Spinner is the canonical loading indicator across the system. ' +
          'Use it inline (size sm) for button-loading states, larger (md / lg) for full-section refreshes. ' +
          'Two variants: Circular (rotating arc, default) and Dots (pulsing trio, fits inline next to running text). ' +
          'prefers-reduced-motion halts animation; the static stroke / dot row stays visible so the loading state is still legible. ' +
          'role=status + aria-live=polite so AT announces the loading state.',
      },
    },
  },
  argTypes: {
    size:    { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    variant: { control: { type: 'inline-radio' }, options: ['circular', 'dots'] },
    tone:    { control: { type: 'inline-radio' }, options: ['accent', 'subtle', 'inverse'] },
    showLabel: { control: 'boolean' },
    label:     { control: 'text' },
  },
  args: {
    size: 'md',
    variant: 'circular',
    tone: 'accent',
    showLabel: false,
    label: 'Loading' + String.fromCharCode(8230),
  },
  render: (args) => Spinner(args),
};

export const Circular = {};

export const Dots = { args: { variant: 'dots' } };

export const AllSizes = {
  parameters: { docs: { description: { story: 'Three sizes side-by-side. sm (14px) for inline button loading, md (22px) for form-field pre-flight, lg (36px) for full-section refresh.' } } },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    ['sm', 'md', 'lg'].forEach((s) => {
      const wrap = document.createElement('div');
      wrap.className = 'eds-stack';
      wrap.style.alignItems = 'center';
      wrap.style.minWidth = '90px';
      wrap.appendChild(Spinner({ size: s }));
      const cap = document.createElement('span');
      cap.className = 'eds-meta';
      cap.textContent = s;
      wrap.appendChild(cap);
      root.appendChild(wrap);
    });
    return root;
  },
};

export const Tones = {
  parameters: { docs: { description: { story: 'Accent (gold) for default loading. Subtle (text-tertiary) for ambient / background fetches. Inverse (white) for gold-bg buttons and dark-tinted overlays.' } } },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    ['accent', 'subtle', 'inverse'].forEach((t) => {
      const wrap = document.createElement('div');
      wrap.className = 'eds-stack';
      wrap.style.alignItems = 'center';
      wrap.style.minWidth = '90px';
      wrap.style.padding = '12px 16px';
      if (t === 'inverse') {
        wrap.style.background = 'var(--bg-void)';
        wrap.style.borderRadius = '8px';
      }
      wrap.appendChild(Spinner({ size: 'md', tone: t }));
      const cap = document.createElement('span');
      cap.className = 'eds-meta';
      cap.textContent = t;
      wrap.appendChild(cap);
      root.appendChild(wrap);
    });
    return root;
  },
};

export const WithLabel = {
  args: { showLabel: true, label: 'Submitting order' + String.fromCharCode(8230) },
};
