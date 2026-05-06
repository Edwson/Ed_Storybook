/**
 * Vite config — Edwson Design System Storybook
 *
 * Storybook 9 manages its own Vite instance via @storybook/html-vite,
 * but this file lets us extend that config (e.g., aliases for sharing
 * source between Storybook and downstream consumers).
 */

import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// On GitHub Pages the site is served at https://edwson.github.io/Ed_Storybook/
// Vite needs to know that prefix at build time so its asset URLs resolve.
// Locally (`npm run storybook`) we want the root '/'.
const isCi = process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true';
const base = process.env.STORYBOOK_BASE
  || (isCi ? '/Ed_Storybook/' : '/');

export default defineConfig({
  base,
  resolve: {
    alias: {
      '@eds': resolve(__dirname, 'src'),
      '@tokens': resolve(__dirname, '.storybook/tokens.css'),
    },
  },
  server: {
    fs: {
      // Allow Storybook to read the portfolio's tokens.css living one
      // level above this directory.
      allow: ['..'],
    },
  },
});
