/**
 * Storybook 9 manager config — Edwson Design System  ·  v0.7
 *
 * Editorial dark chrome — refined palette, generous spacing, tighter
 * sidebar typography. Aesthetic target: Audi React UI / NASA JPL Explorer-1
 * tier — luxury-editorial, not engineering-utility.
 */

import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const edwsonTheme = create({
  base: 'dark',

  brandTitle: 'Edwson Design System',
  brandUrl: 'https://edwson.com',
  brandTarget: '_blank',

  colorPrimary: '#c9a959',
  colorSecondary: '#c9a959',

  appBg: '#060810',
  appContentBg: '#080b16',
  appPreviewBg: '#0c0f1a',
  appBorderColor: 'rgba(255, 255, 255, 0.05)',
  appBorderRadius: 6,

  textColor: '#ffffff',
  textInverseColor: '#060810',
  textMutedColor: 'rgba(255, 255, 255, 0.55)',

  barTextColor: 'rgba(255, 255, 255, 0.62)',
  barSelectedColor: '#c9a959',
  barHoverColor: '#c9a959',
  barBg: '#060810',

  inputBg: '#131720',
  inputBorder: 'rgba(255, 255, 255, 0.06)',
  inputTextColor: '#ffffff',
  inputBorderRadius: 4,

  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace',
});

addons.setConfig({
  theme: edwsonTheme,
  sidebar: {
    showRoots: true,
    renderLabel: ({ name }) => name,
  },
  toolbar: {
    'storybook/background': { hidden: true },
    'storybook/viewport': { hidden: false },
    'storybook/measure': { hidden: true },
    'storybook/outline': { hidden: true },
  },
  bottomPanelHeight: 280,
  rightPanelWidth: 420,
  enableShortcuts: true,
});
