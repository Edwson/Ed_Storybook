/**
 * Storybook 9 preview config — Edwson Design System
 *
 * Loads design tokens, sets up theme decorator (institutional-dark default,
 * salt-light variant for Xanthos / Christie's surfaces), and configures
 * documentation defaults to match the brand voice.
 */

import { withThemeByDataAttribute } from '@storybook/addon-themes';

import './tokens.css';
import './fonts.css';
import './storybook-brand.css';

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'institutional-dark',
      values: [
        { name: 'institutional-dark', value: '#060810' },
        { name: 'card-surface', value: '#131720' },
        { name: 'salt-light', value: '#f5f0e6' },
        { name: 'pure-white', value: '#ffffff' },
      ],
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color|fill|stroke)$/i,
        date: /Date$/i,
      },
      sort: 'requiredFirst',
    },
    docs: {
      toc: { headingSelector: 'h2, h3' },
      source: { language: 'html', format: 'dedent' },
    },
    options: {
      storySort: {
        order: [
          'Welcome',
          'Foundations',
          ['Overview', 'Color', 'Typography', 'Spacing', 'Radius', 'Motion', 'Elevation', 'Icons', 'WCAG Contrast'],
          'Primitives',
          'Components',
          'Financial',
          'Compliance',
          'AML',
          'B2B SaaS',
          'Patterns',
        ],
      },
    },
    a11y: {
      // Enforce WCAG 2.1 AA — institutional baseline.
      element: '#storybook-root',
      config: {},
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
        },
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        'Institutional Dark': 'institutional',
        'Salt Light': 'salt',
      },
      defaultTheme: 'Institutional Dark',
      attributeName: 'data-theme',
    }),
    /**
     * Density mode decorator — toggles --density between 'comfortable'
     * (default) and 'compact' for institutional dense surfaces.
     */
    (storyFn, context) => {
      const density = context.globals.density || 'comfortable';
      const wrap = document.createElement('div');
      wrap.setAttribute('data-density', density);
      wrap.className = 'eds-preview-host';
      const node = storyFn();
      if (typeof node === 'string') {
        wrap.innerHTML = node;
      } else if (node instanceof HTMLElement) {
        wrap.appendChild(node);
      }
      return wrap;
    },
  ],
  globalTypes: {
    density: {
      name: 'Density',
      description: 'Component density mode',
      defaultValue: 'comfortable',
      toolbar: {
        icon: 'component',
        items: [
          { value: 'comfortable', title: 'Comfortable', right: '— default' },
          { value: 'compact', title: 'Compact', right: '— institutional dense' },
        ],
        dynamicTitle: true,
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
