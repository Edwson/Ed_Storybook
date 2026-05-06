/**
 * Token scanner.
 *
 * Reads the portfolio's tokens.css (single source of truth) plus the
 * Storybook overlay (`storybook-next/.storybook/tokens.css`) and
 * produces a flat list of design tokens.
 *
 * Inference of `group` is name-prefix-based:
 *   --bg-*, --text-*, --accent*, --color-*, --status-*, --border*  → color
 *   --space-*                                                     → space
 *   --font-*                                                      → type
 *   --duration-*, --ease*                                         → motion
 *   --shadow-*                                                    → elevation
 *   --radius-*                                                    → radius
 *   --container-*, --gutter*                                      → size
 *   anything else                                                 → other
 */

import { readFile } from "node:fs/promises";

import { PORTFOLIO_TOKENS_CSS, STORYBOOK_TOKENS_CSS } from "../constants.js";
import type { TokenGroup, TokenMeta } from "../types.js";

let _cache: TokenMeta[] | null = null;

export function _resetTokenCache(): void {
  _cache = null;
}

export async function scanTokens(): Promise<TokenMeta[]> {
  if (_cache) return _cache;

  const sources = [PORTFOLIO_TOKENS_CSS, STORYBOOK_TOKENS_CSS];
  const seen = new Map<string, TokenMeta>();

  for (const src of sources) {
    let css: string;
    try {
      css = await readFile(src, "utf8");
    } catch {
      continue;
    }
    for (const t of parseTokens(css)) {
      // Last writer wins (Storybook overlay can override portfolio).
      seen.set(t.name, t);
    }
  }

  _cache = Array.from(seen.values()).sort((a, b) => {
    if (a.group !== b.group) return a.group.localeCompare(b.group);
    return a.name.localeCompare(b.name);
  });
  return _cache;
}

export async function findToken(
  name: string,
): Promise<TokenMeta | undefined> {
  const all = await scanTokens();
  const needle = name.startsWith("--") ? name : `--${name}`;
  return all.find((t) => t.name === needle);
}

/**
 * Find every component whose CSS references a given token.
 * Linear scan; the design system is small enough that this is fine.
 */
export async function findTokenUsage(tokenName: string): Promise<string[]> {
  const { scanComponents } = await import("./components.js");
  const components = await scanComponents();
  const name = tokenName.startsWith("--") ? tokenName : `--${tokenName}`;
  const usage: string[] = [];

  for (const c of components) {
    if (!c.paths.css) continue;
    try {
      const css = await readFile(c.paths.css, "utf8");
      if (css.includes(`var(${name}`) || css.includes(`var(${name})`)) {
        usage.push(c.key);
      }
    } catch {
      /* skip */
    }
  }
  return usage.sort();
}

// ─────────────────────────────────────────────────────────────────────

function parseTokens(css: string): TokenMeta[] {
  const out: TokenMeta[] = [];
  // Match `--name: value;` declarations. Stays inside :root and theme blocks.
  const re = /(--[a-z][a-z0-9_-]*)\s*:\s*([^;]+?);/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    const name = m[1];
    const value = m[2].trim();
    if (value.length === 0) continue;
    out.push({ name, value, group: inferGroup(name) });
  }
  return out;
}

function inferGroup(name: string): TokenGroup {
  if (
    name.startsWith("--bg-") ||
    name.startsWith("--text-") ||
    name.startsWith("--accent") ||
    name.startsWith("--color-") ||
    name.startsWith("--status-") ||
    name.startsWith("--border") ||
    name.startsWith("--success") ||
    name.startsWith("--danger") ||
    name.startsWith("--warning") ||
    name.startsWith("--info") ||
    name.startsWith("--chart")
  )
    return "color";
  if (name.startsWith("--space-")) return "space";
  if (name.startsWith("--font-")) return "type";
  if (name.startsWith("--duration-") || name.startsWith("--ease")) return "motion";
  if (name.startsWith("--shadow-")) return "elevation";
  if (name.startsWith("--radius-")) return "radius";
  if (
    name.startsWith("--container") ||
    name.startsWith("--gutter") ||
    name.startsWith("--width-") ||
    name.startsWith("--height-")
  )
    return "size";
  return "other";
}
