/**
 * Shared TypeScript types for the EDS MCP server.
 *
 * The naming intentionally mirrors how a hiring manager or AI agent
 * would describe the design system out loud — "components", "tokens",
 * "stories", "icons" — so tool outputs stay grokkable without
 * cross-referencing a glossary.
 */

import type { Category } from "./constants.js";

/** A scanned component from src/<category>/<slug>/. */
export interface ComponentMeta {
  /** Human-readable name (e.g., "Button"). Inferred from filename. */
  name: string;
  /** Folder slug (e.g., "button"). */
  slug: string;
  /** Top-level category folder. */
  category: Category;
  /** Full unique key: `<category>/<slug>`. */
  key: string;
  /** Absolute paths to the component files (only those that exist). */
  paths: {
    js?: string;
    css?: string;
    stories?: string;
    mdx?: string;
  };
  /** First line of the component file's JSDoc summary, when available. */
  summary?: string;
  /** Distinct BEM block + element classes referenced in the component CSS. */
  bemClasses: string[];
  /** Variant modifiers detected (e.g., ["primary", "secondary", ...]). */
  variants: string[];
  /** Size modifiers detected (e.g., ["sm", "md", "lg"]). */
  sizes: string[];
  /** State modifiers / pseudo-classes detected (e.g., ["disabled", "loading", "hover"]). */
  states: string[];
  /** Story names exported from the .stories.js file. */
  stories: string[];
}

/** A single design token parsed from tokens.css. */
export interface TokenMeta {
  /** Token name including leading `--`. */
  name: string;
  /** Raw CSS value (post-trim). */
  value: string;
  /** Group inferred from the token name prefix. */
  group: TokenGroup;
}

export type TokenGroup =
  | "color"
  | "space"
  | "type"
  | "motion"
  | "elevation"
  | "radius"
  | "size"
  | "other";

/** A story discovered inside a `.stories.js` file. */
export interface StoryMeta {
  /** Component key (`<category>/<slug>`). */
  componentKey: string;
  /** Exported story identifier (e.g., "Primary"). */
  exportName: string;
  /** Human-readable name (Storybook `name` property if present, else exportName). */
  displayName: string;
  /** The story's `args` literal, parsed best-effort from source. */
  args: Record<string, unknown> | null;
  /** Description text from `parameters.docs.description.story` if present. */
  description?: string;
}

/** An icon from the foundations/icons registry. */
export interface IconMeta {
  name: string;
  /** Raw inner SVG path string (without the wrapping <svg>). */
  paths: string;
}

/** A documented brand / design discipline rule. */
export interface BrandRule {
  id: string;
  title: string;
  body: string;
  examples?: string[];
  source: string;
}

export enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json",
}

/** Standard pagination envelope used by list tools. */
export interface Paginated<T> {
  total: number;
  count: number;
  offset: number;
  items: T[];
  has_more: boolean;
  next_offset?: number;
}
