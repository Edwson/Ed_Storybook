/**
 * Storybook 9 manager config — Edwson Design System
 *
 * Customizes the Storybook UI chrome (sidebar / toolbar / about page)
 * to match Ed Chen portfolio brand: institutional dark, gold accent,
 * Cormorant Garamond display + Inter body.
 */

import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const edwsonTheme = create({
  base: 'dark',

  brandTitle: 'Edwson Design System',
  brandUrl: 'https://edwson.com',
  brandTarget: '_blank',

  // Color palette — sourced verbatim from portfolio tokens.css
  colorPrimary: '#c9a959',
  colorSecondary: '#c9a959',

  // UI
  appBg: '#060810',
  appContentBg: '#0c0f1a',
  appPreviewBg: '#0c0f1a',
  appBorderColor: 'rgba(255,255,255,0.06)',
  appBorderRadius: 8,

  // Text colors
  textColor: '#ffffff',
  textInverseColor: '#060810',
  textMutedColor: 'rgba(255,255,255,0.55)',

  // Toolbar
  barTextColor: 'rgba(255,255,255,0.72)',
  barSelectedColor: '#c9a959',
  barHoverColor: '#c9a959',
  barBg: '#060810',

  // Form
  inputBg: '#131720',
  inputBorder: 'rgba(255,255,255,0.06)',
  inputTextColor: '#ffffff',
  inputBorderRadius: 4,

  // Typography
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace',
});

addons.setConfig({
  theme: edwsonTheme,
  sidebar: {
    showRoots: true,
  },
  toolbar: {
    'storybook/background': { hidden: false },
    'storybook/viewport': { hidden: false },
  },
});
