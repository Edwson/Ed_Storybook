/**
 * Brand-rule tool: lookup discipline rules by id, or list available ids.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { GetBrandRuleInput } from "../schemas.js";
import {
  BRAND_RULES,
  findBrandRule,
  listBrandRuleIds,
} from "../services/brand-rules.js";
import { err, formatEnvelope } from "../services/format.js";

export function registerBrandRuleTools(server: McpServer): void {
  server.registerTool(
    "eds_get_brand_rule",
    {
      title: "Get a design-discipline rule",
      description: `Look up one of the design-system's discipline rules — distilled constraints from the portfolio's CLAUDE.md and the Storybook README. Use this when reviewing or generating component code to confirm the rule before quoting it.

Available rule ids (call this tool with no rule_id to see them):
  - no-inline-styles, no-important, token-first, bem-naming, mobile-first
  - wcag-aa-floor, voice-no-incumbent, voice-acy-footnote
  - live-data-not-animated, single-accent

Args:
  - rule_id (string, optional): which rule to fetch. If omitted, returns the catalogue.
  - response_format: 'markdown' (default) or 'json'

Returns (JSON shape, single rule):
  {
    "id": string,
    "title": string,
    "body": string,
    "examples": string[]?,
    "source": string             // where the rule lives in the portfolio docs
  }

Returns (JSON shape, catalogue):
  {
    "available": [{ "id": string, "title": string }]
  }

Examples:
  - 'Show me the inline-styles rule' → rule_id='no-inline-styles'
  - 'List every brand rule' → no args
  - 'What's the voice convention?' → rule_id='voice-no-incumbent'`,
      inputSchema: GetBrandRuleInput.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      if (!params.rule_id) {
        const payload = {
          available: BRAND_RULES.map((r) => ({ id: r.id, title: r.title })),
        };
        return formatEnvelope(params.response_format, payload, (p) => {
          const lines = ["# Brand & design-discipline rules", ""];
          for (const r of p.available as { id: string; title: string }[]) {
            lines.push(`- \`${r.id}\` — ${r.title}`);
          }
          lines.push("", "*Call with `rule_id` to fetch a specific rule's body and examples.*");
          return lines.join("\n");
        });
      }

      const rule = findBrandRule(params.rule_id);
      if (!rule) {
        return err(
          `Rule '${params.rule_id}' not found. Available: ${listBrandRuleIds().join(", ")}.`,
        );
      }
      const payload = {
        id: rule.id,
        title: rule.title,
        body: rule.body,
        examples: rule.examples,
        source: rule.source,
      };
      return formatEnvelope(params.response_format, payload, (p) => {
        const lines = [`# ${p.title}  \`${p.id}\``, "", p.body as string];
        const examples = p.examples as string[] | undefined;
        if (examples?.length) {
          lines.push("", "## Examples", ...examples.map((e) => `\`\`\`\n${e}\n\`\`\``));
        }
        lines.push("", `*Source: ${p.source}*`);
        return lines.join("\n");
      });
    },
  );
}
