/**
 * Zod input schemas for every tool, plus shared helpers.
 *
 * `.strict()` on every schema so unknown keys are rejected — preventing
 * agents from silently sending parameters that get ignored.
 */

import { z } from "zod";

import { CATEGORIES, DEFAULT_LIMIT, MAX_LIMIT } from "./constants.js";
import { ResponseFormat } from "./types.js";

const ResponseFormatSchema = z
  .nativeEnum(ResponseFormat)
  .default(ResponseFormat.MARKDOWN)
  .describe(
    "Output format. 'markdown' for human-readable prose with headings " +
      "and lists; 'json' for structured machine-readable data. Default: markdown.",
  );

const PaginationSchema = {
  limit: z
    .number()
    .int()
    .min(1)
    .max(MAX_LIMIT)
    .default(DEFAULT_LIMIT)
    .describe(`Maximum results to return (1–${MAX_LIMIT}). Default: ${DEFAULT_LIMIT}.`),
  offset: z
    .number()
    .int()
    .min(0)
    .default(0)
    .describe("Number of results to skip for pagination. Default: 0."),
};

const CategoryEnum = z
  .enum([...CATEGORIES])
  .describe(
    "Top-level category folder name. One of: " + CATEGORIES.join(", ") + ".",
  );

// ─────────────────────────────────────────────────────────────────────
// Per-tool schemas
// ─────────────────────────────────────────────────────────────────────

export const ListComponentsInput = z
  .object({
    category: CategoryEnum.optional().describe(
      "Optional filter — only return components from this category.",
    ),
    ...PaginationSchema,
    response_format: ResponseFormatSchema,
  })
  .strict();

export const GetComponentInput = z
  .object({
    component: z
      .string()
      .min(1)
      .max(120)
      .describe(
        "Component identifier. Either a fully-qualified key like " +
          "'primitives/button' OR a bare slug like 'button' (must be unique). " +
          "Case-insensitive.",
      ),
    response_format: ResponseFormatSchema,
  })
  .strict();

export const GetComponentSourceInput = z
  .object({
    component: z
      .string()
      .min(1)
      .max(120)
      .describe(
        "Component identifier — fully-qualified ('primitives/button') or slug ('button').",
      ),
    kind: z
      .enum(["js", "css", "stories", "all"])
      .default("all")
      .describe(
        "Which file to return. 'js' = render function; 'css' = scoped " +
          "styles; 'stories' = .stories.js Storybook file; 'all' = every available file.",
      ),
    response_format: ResponseFormatSchema,
  })
  .strict();

export const SearchComponentsInput = z
  .object({
    query: z
      .string()
      .min(1)
      .max(200)
      .describe(
        "Search string. Matches against component name, slug, category, " +
          "BEM classes, and the JSDoc summary. Token-based fuzzy match: exact 100 / " +
          "prefix 50 / substring 20 / per-word 5.",
      ),
    limit: z
      .number()
      .int()
      .min(1)
      .max(MAX_LIMIT)
      .default(10)
      .describe(`Maximum matches to return (1–${MAX_LIMIT}). Default: 10.`),
    response_format: ResponseFormatSchema,
  })
  .strict();

export const ListTokensInput = z
  .object({
    group: z
      .enum(["color", "space", "type", "motion", "elevation", "radius", "size", "other"])
      .optional()
      .describe(
        "Optional filter — only return tokens in this group. Groups are " +
          "inferred from token name prefixes.",
      ),
    ...PaginationSchema,
    response_format: ResponseFormatSchema,
  })
  .strict();

export const GetTokenInput = z
  .object({
    name: z
      .string()
      .min(1)
      .max(80)
      .describe(
        "Token name. Leading '--' optional (both 'accent' and '--accent' work).",
      ),
    include_usage: z
      .boolean()
      .default(false)
      .describe(
        "If true, include the list of components whose CSS references this " +
          "token. Adds a filesystem scan over component CSS — slower but useful for refactors.",
      ),
    response_format: ResponseFormatSchema,
  })
  .strict();

export const ListIconsInput = z
  .object({
    ...PaginationSchema,
    response_format: ResponseFormatSchema,
  })
  .strict();

export const GetIconSvgInput = z
  .object({
    name: z
      .string()
      .min(1)
      .max(80)
      .describe(
        "Icon name as registered in src/foundations/icons/icons.js. " +
          "Use eds_list_icons to discover names.",
      ),
    size: z
      .number()
      .int()
      .min(8)
      .max(96)
      .default(24)
      .describe("SVG width and height in pixels. Default: 24."),
    stroke: z
      .number()
      .min(0.5)
      .max(4)
      .default(2)
      .describe("Stroke width in pixels. Default: 2."),
  })
  .strict();

export const GetStoryInput = z
  .object({
    component: z
      .string()
      .min(1)
      .max(120)
      .describe("Component identifier — fully-qualified or slug."),
    story: z
      .string()
      .min(1)
      .max(120)
      .optional()
      .describe(
        "Story export name (e.g., 'Primary'). If omitted, returns the first story exported.",
      ),
    response_format: ResponseFormatSchema,
  })
  .strict();

export const GetBrandRuleInput = z
  .object({
    rule_id: z
      .string()
      .min(1)
      .max(80)
      .optional()
      .describe(
        "Rule id (e.g., 'no-inline-styles', 'token-first', 'voice-no-incumbent'). " +
          "If omitted, returns the catalogue of available rule ids.",
      ),
    response_format: ResponseFormatSchema,
  })
  .strict();
