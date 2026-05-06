import { Avatar } from './Avatar.js';
import { iconHtml } from '../../foundations/icons/icons.js';

export default {
  title: 'Primitives/Avatar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Identity primitive — image / initials / icon fallback in priority ' +
          'order. Three sizes, circle (default) or squared. Optional status ' +
          'dot for chat / queue / desk surfaces. `role="img"` + ' +
          '`aria-label="<name>"` so screen readers announce identity rather ' +
          'than try to read the initials character-by-character.',
      },
    },
  },
  argTypes: {
    name: { control: 'text', table: { category: 'Identity' } },
    initials: { control: 'text', table: { category: 'Identity' } },
    image: { control: 'text', table: { category: 'Identity' } },
    iconHtml: { control: false, table: { category: 'Identity' } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Variant' },
    },
    squared: { control: 'boolean', table: { category: 'Variant' } },
    status: {
      control: { type: 'select' },
      options: [undefined, 'online', 'busy', 'away', 'offline'],
      table: { category: 'State' },
    },
  },
  args: {
    name: 'Ed Chen',
    size: 'md',
    squared: false,
  },
  render: (args) => Avatar(args),
};

export const Initials = {};

export const WithImage = {
  args: {
    image: 'https://avatars.githubusercontent.com/u/1?v=4',
    name: 'Octocat',
  },
};

export const WithIcon = {
  args: {
    name: 'System',
    iconHtml: iconHtml('shield-check', { size: 18 }),
  },
};

export const Sizes = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    root.style.alignItems = 'center';
    ['sm', 'md', 'lg'].forEach((size) =>
      root.appendChild(Avatar({ name: 'Ed Chen', size })),
    );
    return root;
  },
};

export const Squared = {
  args: { squared: true, name: 'JP Morgan' },
};

export const Status = {
  parameters: {
    docs: {
      description: {
        story:
          'Status dot in the bottom-right corner. Four states map to ' +
          'success / warning / danger / neutral colour tokens.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-row';
    root.style.alignItems = 'center';
    [
      { name: 'Online',  status: 'online' },
      { name: 'Busy',    status: 'busy' },
      { name: 'Away',    status: 'away' },
      { name: 'Offline', status: 'offline' },
    ].forEach((p) => root.appendChild(Avatar(p)));
    return root;
  },
};

export const Roster = {
  name: 'Use case · advisor desk roster',
  parameters: {
    docs: {
      description: {
        story:
          'A row of advisor avatars at sm size — typical for a desk ' +
          'roster, queue dashboard, or assignment cell in a CRM.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'flex';
    root.style.alignItems = 'center';
    root.style.gap = '6px';
    root.style.padding = '8px 12px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '8px';
    root.style.width = 'fit-content';
    root.style.fontFamily = 'JetBrains Mono, monospace';
    root.style.fontSize = '11px';
    root.style.color = 'var(--text-tertiary)';
    root.style.letterSpacing = '0.06em';
    root.style.textTransform = 'uppercase';

    ['Sarah Park', 'Daniel Lee', 'Mei Hartmann', 'Kenji Sato'].forEach((n) =>
      root.appendChild(Avatar({ name: n, size: 'sm', status: 'online' })),
    );
    const label = document.createElement('span');
    label.textContent = '4 advisors on desk';
    label.style.marginLeft = '6px';
    root.appendChild(label);
    return root;
  },
};
