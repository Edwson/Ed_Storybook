/**
 * Shared constants for the Edwson Design System MCP server.
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Root of the Storybook workspace, resolved relative to this file.
 * Layout: storybook-next/mcp-server/dist/constants.js → up two levels.
 */
export const STORYBOOK_ROOT = resolve(__dirname, "..", "..");

/** Path to the design system source tree. */
export const SRC_ROOT = resolve(STORYBOOK_ROOT, "src");

/** Path to the Storybook tokens.css (re-exports portfolio tokens). */
export const STORYBOOK_TOKENS_CSS = resolve(
  STORYBOOK_ROOT,
  ".storybook",
  "tokens.css",
);

/** Path to the portfolio's source-of-truth tokens. */
export const PORTFOLIO_TOKENS_CSS = resolve(
  STORYBOOK_ROOT,
  "..",
  "css",
  "tokens.css",
);

/** Path to the icons registry source. */
export const ICONS_SOURCE = resolve(
  SRC_ROOT,
  "foundations",
  "icons",
  "icons.js",
);

/** Maximum response size in characters before we truncate. */
export const CHARACTER_LIMIT = 25_000;

/** Default + max page size for list tools. */
export const DEFAULT_LIMIT = 25;
export const MAX_LIMIT = 100;

/** Server identity. */
export const SERVER_NAME = "eds-mcp-server";
export const SERVER_VERSION = "0.1.0";

/**
 * The category buckets the design system uses, in display order.
 * Matches the folder names under src/.
 */
export const CATEGORIES = [
  "foundations",
  "primitives",
  "components",
  "financial",
  "compliance",
  "aml",
  "b2b",
  "patterns",
] as const;

export type Category = (typeof CATEGORIES)[number];
