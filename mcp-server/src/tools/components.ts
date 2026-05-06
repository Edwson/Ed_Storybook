/**
 * Component-domain tools: list, get, get_source, search.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFile } from "node:fs/promises";

import {
  GetComponentInput,
  GetComponentSourceInput,
  ListComponentsInput,
  SearchComponentsInput,
} from "../schemas.js";
import {
  findComponent,
  scanComponents,
} from "../services/components.js";
import { extractStories } from "../services/stories.js";
import { err, formatEnvelope, ok } from "../services/format.js";
import { ResponseFormat, type ComponentMeta } from "../types.js";

export function registerComponentTools(server: McpServer): void {
  // ── eds_list_components ─────────────────────────────────────────
  server.registerTool(
    "eds_list_components",
    {
      title: "List design-system components",
      description: `List components in the Edwson Design System, optionally filtered by category, with pagination.

Returns each component's identity (name, slug, category, key) and a brief summary line — not full source.
Use eds_get_component to fetch metadata for one component, or eds_get_component_source for raw files.

Args:
  - category (optional): one of foundations, primitives, components, financial, compliance, aml, b2b, patterns
  - limit (number): max results (1–100, default 25)
  - offset (number): skip count for pagination (default 0)
  - response_format: 'markdown' (default) or 'json'

Returns (JSON shape):
  {
    "total": number,           // total components matching filter
    "count": number,           // number returned in this page
    "offset": number,
    "items": [
      {
        "name": string,        // e.g. "Button"
        "slug": string,        // e.g. "button"
        "category": string,    // e.g. "primitives"
        "key": string,         // e.g. "primitives/button"
        "summary": string?     // first JSDoc line if present
      }
    ],
    "has_more": boolean,
    "next_offset": number?
  }

Examples:
  - 'List all primitives' → category='primitives'
  - 'Show me page 2 of components, 20 per page' → limit=20, offset=20
  - 'How many financial components are there?' → category='financial', read 'total'`,
      inputSchema: ListComponentsInput.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      const all = await scanComponents();
      const filtered = params.category
        ? all.filter((c) => c.category === params.category)
        : all;
      const total = filtered.length;
      const slice = filtered.slice(params.offset, params.offset + params.limit);
      const items = slice.map((c) => ({
        name: c.name,
        slug: c.slug,
        category: c.category,
        key: c.key,
        summary: c.summary,
      }));
      const hasMore = total > params.offset + items.length;
      const payload = {
        total,
        count: items.length,
        offset: params.offset,
        items,
        has_more: hasMore,
        ...(hasMore ? { next_offset: params.offset + items.length } : {}),
      };
      return formatEnvelope(params.response_format, payload, (p) => {
        const lines = [
          `# Components ${params.category ? `· ${params.category}` : ""}`,
          "",
          `Found ${p.total} component${p.total === 1 ? "" : "s"} (showing ${p.count} from offset ${p.offset}).`,
          "",
        ];
        for (const it of p.items as typeof items) {
          lines.push(`## ${it.name} \`${it.key}\``);
          if (it.summary) lines.push(`${it.summary}`);
          lines.push("");
        }
        if (p.has_more) {
          lines.push(`*${p.total - (p.offset + p.count)} more available — call again with offset=${p.next_offset}.*`);
        }
        return lines.join("\n");
      });
    },
  );

  // ── eds_get_component ───────────────────────────────────────────
  server.registerTool(
    "eds_get_component",
    {
      title: "Get full component metadata",
      description: `Get the full metadata record for one component: file paths, BEM classes, variants, sizes, states, and exported story names.

Args:
  - component (string): fully-qualified key ('primitives/button') OR bare slug ('button'); case-insensitive
  - response_format: 'markdown' (default) or 'json'

Returns (JSON shape):
  {
    "name": string,
    "slug": string,
    "category": string,
    "key": string,
    "summary": string?,        // first JSDoc summary line
    "paths": {                 // absolute paths on disk (only those that exist)
      "js": string?,
      "css": string?,
      "stories": string?,
      "mdx": string?
    },
    "bem_classes": string[],   // every '.eds-…' selector seen in the CSS
    "variants": string[],      // e.g. ["primary","secondary","ghost","danger","link"]
    "sizes": string[],         // e.g. ["sm","md","lg"]
    "states": string[],        // e.g. ["disabled","loading","hover"]
    "stories": string[]        // exported story names
  }

Examples:
  - 'Show me the Button component' → component='button'
  - 'What variants does the disclosure banner support?' → component='compliance/disclosure-banner'
  - 'List the regime chip's states' → component='regime-chip'

Error handling:
  - If the slug is ambiguous across categories you'll see a list of fully-qualified keys to retry with.`,
      inputSchema: GetComponentInput.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      const meta = await findComponent(params.component);
      if (!meta) {
        const all = await scanComponents();
        const ambiguous = all
          .filter((c) => c.slug === params.component.toLowerCase().trim())
          .map((c) => c.key);
        if (ambiguous.length > 1) {
          return err(
            `Component slug '${params.component}' is ambiguous. Found in: ${ambiguous.join(", ")}. ` +
              `Re-run with the fully-qualified key.`,
          );
        }
        return err(
          `Component '${params.component}' not found. ` +
            `Use eds_list_components or eds_search_components to discover available components.`,
        );
      }
      const payload = serialiseComponent(meta);
      return formatEnvelope(params.response_format, payload, (p) =>
        renderComponentMarkdown(p as ReturnType<typeof serialiseComponent>),
      );
    },
  );

  // ── eds_get_component_source ────────────────────────────────────
  server.registerTool(
    "eds_get_component_source",
    {
      title: "Get raw component source",
      description: `Return the raw source file(s) for a component: render function (.js), styles (.css), and/or stories (.stories.js).

Use this when you need to read the actual code — for code review, refactor, or generating a similar component.

Args:
  - component (string): fully-qualified key or slug
  - kind: 'js' | 'css' | 'stories' | 'all' (default: 'all')
  - response_format: 'markdown' (default; renders fenced code blocks) or 'json' (raw strings)

Returns (JSON shape):
  {
    "component": string,       // resolved key
    "files": {
      "js": string?,           // raw file contents
      "css": string?,
      "stories": string?
    }
  }

Examples:
  - 'Show me the Button CSS' → component='button', kind='css'
  - 'Get all source for the PnL Cell' → component='pnl-cell', kind='all'
  - 'Read the disclosure banner stories file' → component='disclosure-banner', kind='stories'

Note: Responses are capped at ~25k chars. If a file is larger, request a single kind instead of 'all'.`,
      inputSchema: GetComponentSourceInput.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      const meta = await findComponent(params.component);
      if (!meta) {
        return err(
          `Component '${params.component}' not found. Use eds_list_components to discover identifiers.`,
        );
      }

      const wanted = new Set<keyof ComponentMeta["paths"]>(
        params.kind === "all" ? ["js", "css", "stories"] : [params.kind as keyof ComponentMeta["paths"]],
      );

      const files: Record<string, string> = {};
      for (const k of wanted) {
        const path = meta.paths[k];
        if (!path) continue;
        try {
          files[k] = await readFile(path, "utf8");
        } catch {
          files[k] = `// Failed to read ${path}`;
        }
      }
      if (Object.keys(files).length === 0) {
        return err(
          `Component '${meta.key}' has no '${params.kind}' file. Available: ${Object.keys(
            meta.paths,
          ).join(", ") || "(none)"}.`,
        );
      }

      const payload = { component: meta.key, files };
      if (params.response_format === ResponseFormat.JSON) {
        return ok(JSON.stringify(payload, null, 2), payload);
      }
      const lines = [`# Source · ${meta.key}`, ""];
      for (const [k, src] of Object.entries(files)) {
        const lang = k === "css" ? "css" : "javascript";
        lines.push(`## ${k}\n\n\`\`\`${lang}\n${src}\n\`\`\``, "");
      }
      return ok(lines.join("\n"), payload);
    },
  );

  // ── eds_search_components ───────────────────────────────────────
  server.registerTool(
    "eds_search_components",
    {
      title: "Search components by query",
      description: `Token-based fuzzy search across component name, slug, category, BEM classes, and JSDoc summary.

Scoring: exact=100 / prefix=50 / substring=20 / per-word match=5. Results are sorted high → low.

Args:
  - query (string): search string (1–200 chars). Multi-word queries are AND-matched: every token must match somewhere.
  - limit (number): max matches (1–100, default 10)
  - response_format: 'markdown' (default) or 'json'

Returns (JSON shape):
  {
    "query": string,
    "count": number,
    "items": [
      {
        "name": string,
        "key": string,
        "category": string,
        "score": number,
        "summary": string?
      }
    ]
  }

Examples:
  - 'find a status pill' → query='status pill' → returns Badge
  - 'show me regime stuff' → query='regime' → returns Regime Chip
  - 'something for compliance disclosures' → query='compliance disclosure' → returns Disclosure Banner

Returns an empty list (not an error) when nothing matches.`,
      inputSchema: SearchComponentsInput.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      const all = await scanComponents();
      const tokens = params.query.toLowerCase().split(/\s+/).filter(Boolean);
      const scored = all
        .map((c) => ({ c, score: scoreComponent(c, tokens) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, params.limit);

      const items = scored.map(({ c, score }) => ({
        name: c.name,
        key: c.key,
        category: c.category,
        score,
        summary: c.summary,
      }));
      const payload = { query: params.query, count: items.length, items };
      return formatEnvelope(params.response_format, payload, (p) => {
        const lines = [`# Search: '${params.query}'`, "", `${p.count} match${p.count === 1 ? "" : "es"}`, ""];
        for (const it of p.items as typeof items) {
          lines.push(`- **${it.name}** \`${it.key}\` (score ${it.score})${it.summary ? ` — ${it.summary}` : ""}`);
        }
        return lines.join("\n");
      });
    },
  );
}

// ─────────────────────────────────────────────────────────────────────

function serialiseComponent(meta: ComponentMeta) {
  return {
    name: meta.name,
    slug: meta.slug,
    category: meta.category,
    key: meta.key,
    summary: meta.summary,
    paths: meta.paths,
    bem_classes: meta.bemClasses,
    variants: meta.variants,
    sizes: meta.sizes,
    states: meta.states,
    stories: meta.stories,
  };
}

function renderComponentMarkdown(p: ReturnType<typeof serialiseComponent>): string {
  const lines = [`# ${p.name}  \`${p.key}\``, ""];
  if (p.summary) lines.push(p.summary, "");
  lines.push("## Files");
  for (const [k, v] of Object.entries(p.paths)) {
    if (v) lines.push(`- **${k}**: \`${v}\``);
  }
  lines.push("");
  if (p.variants.length) lines.push("## Variants", p.variants.map((v) => `\`${v}\``).join(" · "), "");
  if (p.sizes.length) lines.push("## Sizes", p.sizes.map((v) => `\`${v}\``).join(" · "), "");
  if (p.states.length) lines.push("## States", p.states.map((v) => `\`${v}\``).join(" · "), "");
  if (p.stories.length) lines.push("## Stories", p.stories.map((v) => `- ${v}`).join("\n"), "");
  if (p.bem_classes.length) {
    lines.push(`## BEM classes (${p.bem_classes.length})`, p.bem_classes.map((c) => `\`${c}\``).join(" · "), "");
  }
  return lines.join("\n");
}

function scoreComponent(c: ComponentMeta, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const haystack = [
    c.name.toLowerCase(),
    c.slug,
    c.category,
    c.summary?.toLowerCase() ?? "",
    c.bemClasses.join(" "),
  ];
  let total = 0;
  for (const t of tokens) {
    let best = 0;
    for (const h of haystack) {
      if (h === t) best = Math.max(best, 100);
      else if (h.startsWith(t)) best = Math.max(best, 50);
      else if (h.includes(t)) best = Math.max(best, 20);
      else if (h.split(/\W+/).some((w) => w.startsWith(t))) best = Math.max(best, 5);
    }
    if (best === 0) return 0; // every token must match somewhere
    total += best;
  }
  return total;
}

// We export this for unit testing; it's not registered as a tool.
export const _internals = { scoreComponent };

// Note: ResponseFormat is imported at top of file.
