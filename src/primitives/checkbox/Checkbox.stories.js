import { Checkbox } from './Checkbox.js';

export default {
  title: 'Primitives/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Native checkbox under the hood; custom indicator drawn via CSS. ' +
          'Indeterminate state for tree-table master rows. Label is part ' +
          'of the click area for usability + keyboard.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    helper: { control: 'text', table: { category: 'Content' } },
    checked: { control: 'boolean', table: { category: 'State' } },
    indeterminate: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onChange: { action: 'changed', table: { category: 'Events' } },
  },
  args: {
    label: 'Acknowledge pre-trade disclosure',
    helper: 'Required by ASIC RG 268 for cross-border trades.',
    checked: false,
  },
  render: (args) => Checkbox(args),
};

export const Default = {};

export const Checked = {
  args: { checked: true },
};

export const Indeterminate = {
  args: { indeterminate: true, label: '3 of 8 jurisdictions selected' },
  parameters: {
    docs: {
      description: {
        story:
          'Indeterminate is the third state — neither all nor none. Common ' +
          'on tree-table master rows, multi-jurisdiction selectors, etc.',
      },
    },
  },
};

export const Disabled = {
  args: { disabled: true, label: 'Disabled (compliance lock)' },
};

export const NoHelper = {
  args: { helper: '', label: 'Remember this device' },
};

export const Group = {
  name: 'Use case · jurisdiction multi-select',
  parameters: {
    docs: {
      description: {
        story:
          'A group of related checkboxes. The master row at the top uses ' +
          'indeterminate to indicate partial selection.',
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

    root.appendChild(Checkbox({
      label: 'All jurisdictions',
      indeterminate: true,
      helper: '3 of 8 selected',
    }));

    const group = document.createElement('div');
    group.style.display = 'grid';
    group.style.gap = '10px';
    group.style.paddingLeft = '32px';
    group.style.marginTop = '8px';
    [
      { label: 'United States · SEC Reg NMS', checked: true },
      { label: 'United Kingdom · FCA COBS', checked: true },
      { label: 'European Union · MiFID II', checked: true },
      { label: 'Singapore · MAS Notice 626', checked: false },
      { label: 'Australia · ASIC RG 268', checked: false },
      { label: 'Japan · FIEA', checked: false },
      { label: 'Hong Kong · SFC', checked: false },
      { label: 'Switzerland · FINMA', checked: false },
    ].forEach((it) => {
      group.appendChild(Checkbox({ ...it, helper: '' }));
    });
    root.appendChild(group);
    return root;
  },
};
