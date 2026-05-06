/**
 * Storybook 9 main config — Edwson Design System
 *
 * HTML renderer (vanilla JS / template-string render functions).
 * No React, no JSX, no framework lock-in. Same vanilla discipline
 * as the rest of the portfolio.
 */

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/welcome/**/*.mdx',
    '../src/foundations/**/*.@(mdx|stories.@(js|mjs))',
    '../src/primitives/**/*.@(mdx|stories.@(js|mjs))',
    '../src/components/**/*.@(mdx|stories.@(js|mjs))',
    '../src/financial/**/*.@(mdx|stories.@(js|mjs))',
    '../src/compliance/**/*.@(mdx|stories.@(js|mjs))',
    '../src/aml/**/*.@(mdx|stories.@(js|mjs))',
    '../src/b2b/**/*.@(mdx|stories.@(js|mjs))',
    '../src/patterns/**/*.@(mdx|stories.@(js|mjs))',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Docs',
  },
};

export default config;
