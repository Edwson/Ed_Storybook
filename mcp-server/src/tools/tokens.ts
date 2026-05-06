/**
 * Token-domain tools: list + get (with optional usage reverse-lookup).
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { GetTokenInput, ListTokensInput } from "../schemas.js";
import { findToken, findTokenUsage, scanTokens } from "../services/tokens.js";
import { err, formatEnvelope } from "../services/format.js";

export function registerTokenTools(server: McpServer): void {
  // ── eds_list_tokens ─────────────────────────────────────────────
  server.registerTool(
    "eds_list_tokens",
    {
      title: "List design tokens",
      description: `List CSS custom-property tokens from the design system, optionally filtered by group.

The token registry is parsed from /css/tokens.css (portfolio source of truth) plus the Storybook overlay (storybook-next/.storybook/tokens.css). Last-write-wins on conflict.

Groups (inferred from token name prefix):
  - color      → --bg-*, --text-*, --accent*, --color-*, --status-*, --border*, --success, --danger, …
  - space      → --space-*
  - type       → --font-*
  - motion     → --duration-*, --ease*
  - elevation  → --shadow-*
  - radius     → --radius-*
  - size       → --container-*, --gutter*, --width-*, --height-*
  - other      → anything not matching the above

Args:
  - group (optional): one of color, space, type, motion, elevation, radius, size, other
  - limit (number): max results (1–100, default 25)
  - offset (number): skip count (default 0)
  - response_format: 'markdown' (default) or 'json'

Returns (JSON shape):
  {
    "total": number,
    "count": number,
    "offset": number,
    "items": [{ "name": string, "value": string, "group": string }],
    "has_more": boolean,
    "next_offset": number?
  }

Examples:
  - 'List all color tokens' → group='color'
  - 'Show me motion tokens' → group='motion'
  - 'How many spacing tokens are there?' → group='space', read 'total'`,
      inputSchema: ListTokensInput.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      const all = await scanTokens();
      const filtered = params.group ? all.filter((t) => t.group === params.group) : all;
      const total = filtered.length;
      const slice = filtered.slice(params.offset, params.offset + params.limit);
      const items = slice.map((t) => ({ name: t.name, value: t.value, group: t.group }));
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
          `# Design tokens${params.group ? ` · ${params.group}` : ""}`,
          "",
          `Total ${p.total} (showing ${p.count} from offset ${p.offset}).`,
          "",
          "| Name | Value | Group |",
          "| --- | --- | --- |",
        ];
        for (const t of p.items as typeof items) {
          lines.push(`| \`${t.name}\` | \`${t.value}\` | ${t.group} |`);
        }
        if (p.has_more) lines.push("", `*${p.total - (p.offset + p.count)} more — offset=${p.next_offset}.*`);
        return lines.join("\n");
      });
    },
  );

  // ── eds_get_token ───────────────────────────────────────────────
  server.registerTool(
    "eds_get_token",
    {
      title: "Get design token by name",
      description: `Look up a design token's value, group, and (optionally) the list of components that reference it.

Args:
  - name (string): token name. Leading '--' is optional ('accent' and '--accent' both resolve).
  - include_usage (boolean, default false): when true, scan every component CSS file and return the keys of components that reference this token (e.g., ['primitives/button', 'financial/pnl-cell']). Slower — use only when you actually need the reverse-lookup.
  - response_format: 'markdown' (default) or 'json'

Returns (JSON shape):
  {
    "name": string,
    "value": string,
    "group": string,
    "used_by": string[]?       // present only when include_usage=true
  }

Examples:
  - 'What's the value of --accent?' → name='accent'
  - 'Which components use --space-3?' → name='space-3', include_usage=true
  - 'Show me the shadow-lg definition' → name='shadow-lg'`,
      inputSchema: GetTokenInput.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      const token = await findToken(params.name);
      if (!token) {
        return err(
          `Token '${params.name}' not found. Use eds_list_tokens to discover available tokens.`,
        );
      }
      const usage = params.include_usage ? await findTokenUsage(token.name) : undefined;
      const payload = {
        name: token.name,
        value: token.value,
        group: token.group,
        ...(usage ? { used_by: usage } : {}),
      };
      return formatEnvelope(params.response_format, payload, (p) => {
        const lines = [
          `# ${p.name}`,
          "",
          `- **Value**: \`${p.value}\``,
          `- **Group**: ${p.group}`,
        ];
        if (Array.isArray(p.used_by)) {
          lines.push("", `## Used by (${p.used_by.length} component${p.used_by.length === 1 ? "" : "s"})`);
          for (const c of p.used_by) lines.push(`- \`${c}\``);
        }
        return lines.join("\n");
      });
    },
  );
}
