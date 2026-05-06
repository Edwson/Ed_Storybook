/**
 * Component scanner.
 *
 * Walks `src/<category>/<slug>/` folders and builds ComponentMeta records.
 * For each component we read the .css file (if any) and infer:
 *   - bemClasses : every `.eds-<name>...` selector seen
 *   - variants   : everything after `--` on a `.eds-<name>--*` modifier
 *   - sizes      : `--sm`, `--md`, `--lg` modifiers (a subset of variants)
 *   - states     : pseudo-classes (`:hover`, `:focus`, …) and known state modifiers
 *
 * Story names come from `.stories.js` exports.
 *
 * The scan is filesystem-based (no eval, no import) because:
 *   1. The MCP server runs as a subprocess of the LLM client — eval'ing
 *      arbitrary JS from a workspace is a privilege escalation surface.
 *   2. Pure parsing keeps the openWorldHint=false guarantee meaningful.
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { join, basename } from "node:path";

import { CATEGORIES, SRC_ROOT, type Category } from "../constants.js";
import type { ComponentMeta } from "../types.js";

let _cache: ComponentMeta[] | null = null;

/** Reset the cache (used by tests; not exposed via tools). */
export function _resetComponentCache(): void {
  _cache = null;
}

/** Scan all components, with caching. */
export async function scanComponents(): Promise<ComponentMeta[]> {
  if (_cache) return _cache;
  const out: ComponentMeta[] = [];

  for (const category of CATEGORIES) {
    const catDir = join(SRC_ROOT, category);
    if (!(await dirExists(catDir))) continue;

    const slugs = await readdir(catDir);
    for (const slug of slugs) {
      const compDir = join(catDir, slug);
      const st = await safeStat(compDir);
      if (!st?.isDirectory()) continue;

      const meta = await readComponent(category, slug, compDir);
      if (meta) out.push(meta);
    }
  }

  // Stable order: foundations → primitives → ... → patterns, then alpha by slug.
  out.sort((a, b) => {
    const ca = CATEGORIES.indexOf(a.category);
    const cb = CATEGORIES.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    return a.slug.localeCompare(b.slug);
  });

  _cache = out;
  return out;
}

/** Look up one component by its `<category>/<slug>` key OR bare slug. */
export async function findComponent(
  identifier: string,
): Promise<ComponentMeta | undefined> {
  const all = await scanComponents();
  const id = identifier.toLowerCase().trim();

  // Try fully-qualified key first.
  const exact = all.find((c) => c.key === id);
  if (exact) return exact;

  // Fall back to slug match (errors if ambiguous).
  const slugMatches = all.filter((c) => c.slug === id);
  if (slugMatches.length === 1) return slugMatches[0];
  if (slugMatches.length > 1) {
    // Disambiguation handled at the tool layer.
    return undefined;
  }

  // Last resort: name match (case-insensitive).
  return all.find((c) => c.name.toLowerCase() === id);
}

// ─────────────────────────────────────────────────────────────────────
// Internals
// ─────────────────────────────────────────────────────────────────────

async function readComponent(
  category: Category,
  slug: string,
  dir: string,
): Promise<ComponentMeta | null> {
  const entries = await readdir(dir);
  const paths: ComponentMeta["paths"] = {};
  let inferredName = capitalize(slug);

  for (const entry of entries) {
    const full = join(dir, entry);
    if (entry.endsWith(".stories.js") || entry.endsWith(".stories.mjs")) {
      paths.stories = full;
      // Component name is the filename minus `.stories.js`
      inferredName = basename(entry).replace(/\.stories\.(js|mjs)$/, "");
    } else if (entry.endsWith(".js") || entry.endsWith(".mjs")) {
      paths.js = full;
      const candidateName = basename(entry).replace(/\.(js|mjs)$/, "");
      if (candidateName.toLowerCase() !== "icons") {
        inferredName = candidateName;
      }
    } else if (entry.endsWith(".css")) {
      paths.css = full;
    } else if (entry.endsWith(".mdx")) {
      paths.mdx = full;
    }
  }

  // A folder needs at least one of these to count as a component.
  if (!paths.css && !paths.js && !paths.stories && !paths.mdx) return null;

  let css = "";
  if (paths.css) {
    try {
      css = await readFile(paths.css, "utf8");
    } catch {
      /* swallow — empty CSS is non-fatal */
    }
  }
  let storiesSrc = "";
  if (paths.stories) {
    try {
      storiesSrc = await readFile(paths.stories, "utf8");
    } catch {
      /* same */
    }
  }
  let jsSrc = "";
  if (paths.js) {
    try {
      jsSrc = await readFile(paths.js, "utf8");
    } catch {
      /* same */
    }
  }

  return {
    name: inferredName,
    slug,
    category,
    key: `${category}/${slug}`,
    paths,
    summary: extractSummary(jsSrc) || extractSummary(storiesSrc),
    bemClasses: extractBemClasses(css),
    variants: extractVariants(css),
    sizes: extractSizes(css),
    states: extractStates(css),
    stories: extractStoryExports(storiesSrc),
  };
}

/** Pull the first JSDoc summary line out of a source file. */
function extractSummary(src: string): string | undefined {
  const m = src.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/);
  return m?.[1]?.trim();
}

/** Distinct BEM-style class selectors mentioned in the CSS. */
function extractBemClasses(css: string): string[] {
  const found = new Set<string>();
  const re = /\.(eds-[a-z0-9_-]+(?:__[a-z0-9_-]+)?)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    found.add(m[1]);
  }
  return Array.from(found).sort();
}

/**
 * `--variant` modifiers excluding size tokens.
 *
 * Each component lives in its own scoped CSS file, so we don't need to
 * tie modifiers to the folder slug — that mapping is unreliable anyway
 * (folder='button', BEM block='eds-btn'). Pull every BEM modifier seen
 * after `--` in any `.eds-...` selector inside this file, then route
 * size tokens to extractSizes() and the rest to variants.
 */
function extractVariants(css: string): string[] {
  const out = new Set<string>();
  for (const mod of allBemModifiers(css)) {
    if (!isSizeModifier(mod)) out.add(mod);
  }
  return Array.from(out).sort();
}

function extractSizes(css: string): string[] {
  const out = new Set<string>();
  for (const mod of allBemModifiers(css)) {
    if (isSizeModifier(mod)) out.add(mod);
  }
  return Array.from(out).sort();
}

/** Every `--X` modifier in any `.eds-…` selector. */
function allBemModifiers(css: string): string[] {
  const out: string[] = [];
  const re = /\.eds-[a-z0-9_-]+(?:__[a-z0-9_-]+)?--([a-z0-9_-]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) out.push(m[1]);
  return out;
}

function isSizeModifier(s: string): boolean {
  return ["xs", "sm", "md", "lg", "xl", "2xl"].includes(s);
}

function extractStates(css: string): string[] {
  const out = new Set<string>();
  // Pseudo-classes.
  const pseudoRe = /:(hover|focus|focus-visible|active|disabled|checked|indeterminate)/g;
  let m: RegExpExecArray | null;
  while ((m = pseudoRe.exec(css))) out.add(m[1]);
  // BEM state modifiers.
  for (const state of ["disabled", "loading", "active", "selected", "error", "success"]) {
    if (new RegExp(`--${state}\\b`).test(css)) out.add(state);
  }
  return Array.from(out).sort();
}

/** Names of `export const Xxx = …` entries from a stories file. */
function extractStoryExports(src: string): string[] {
  const out: string[] = [];
  const re = /export\s+const\s+([A-Z][A-Za-z0-9_]*)\s*=/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m[1] !== "default") out.push(m[1]);
  }
  return out;
}

function capitalize(s: string): string {
  return s
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

async function dirExists(p: string): Promise<boolean> {
  return !!(await safeStat(p))?.isDirectory();
}

async function safeStat(p: string) {
  try {
    return await stat(p);
  } catch {
    return null;
  }
}
