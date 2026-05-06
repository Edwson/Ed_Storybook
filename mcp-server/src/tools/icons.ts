/**
 * Icon-domain tools: list + render-svg.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { GetIconSvgInput, ListIconsInput } from "../schemas.js";
import { renderIconSvg, scanIcons } from "../services/icons.js";
import { err, formatEnvelope, ok } from "../services/format.js";

export function registerIconTools(server: McpServer): void {
  // ── eds_list_icons ──────────────────────────────────────────────
  server.registerTool(
    "eds_list_icons",
    {
      title: "List icon registry names",
      description: `List every icon name registered in src/foundations/icons/icons.js.

Icons are 24×24 viewBox, 2px stroke, currentColor — they inherit colour from the parent text.

Args:
  - limit (number): max results (1–100, default 25)
  - offset (number): skip count (default 0)
  - response_format: 'markdown' (default) or 'json'

Returns (JSON shape):
  {
    "total": number,
    "count": number,
    "offset": number,
    "items": string[],         // icon names, e.g. ["arrow-right", "shield-check", ...]
    "has_more": boolean,
    "next_offset": number?
  }

Examples:
  - 'What icons are available?' → no args
  - 'Page through icons 25 at a time' → limit=25, offset=0 then offset=25 …`,
      inputSchema: ListIconsInput.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      const map = await scanIcons();
      const names = Array.from(map.keys()).sort();
      const total = names.length;
      const slice = names.slice(params.offset, params.offset + params.limit);
      const hasMore = total > params.offset + slice.length;
      const payload = {
        total,
        count: slice.length,
        offset: params.offset,
        items: slice,
        has_more: hasMore,
        ...(hasMore ? { next_offset: params.offset + slice.length } : {}),
      };
      return formatEnvelope(params.response_format, payload, (p) => {
        const lines = [
          `# Icons`,
          "",
          `Registry has ${p.total} icon${p.total === 1 ? "" : "s"} (showing ${p.count} from offset ${p.offset}).`,
          "",
        ];
        for (const n of p.items as string[]) lines.push(`- \`${n}\``);
        if (p.has_more) lines.push("", `*${p.total - (p.offset + p.count)} more — offset=${p.next_offset}.*`);
        return lines.join("\n");
      });
    },
  );

  // ── eds_get_icon_svg ────────────────────────────────────────────
  server.registerTool(
    "eds_get_icon_svg",
    {
      title: "Render an icon as SVG",
      description: `Render a registered icon as a complete <svg> string at the requested size and stroke width.

The output uses currentColor for stroke so the caller can colour it via CSS or inline.

Args:
  - name (string): icon name as registered (use eds_list_icons to discover)
  - size (number, default 24): SVG width and height in pixels (8–96)
  - stroke (number, default 2): stroke width in pixels (0.5–4)

Returns (text content):
  A complete <svg …> string ready to embed in HTML.

Returns (structuredContent JSON):
  {
    "name": string,
    "size": number,
    "stroke": number,
    "svg": string
  }

Examples:
  - 'Get the shield-check icon at 32px' → name='shield-check', size=32
  - 'Render arrow-right with thicker stroke' → name='arrow-right', stroke=3

Error handling:
  - If the icon name is not in the registry, returns an error with the suggestion to call eds_list_icons.`,
      inputSchema: GetIconSvgInput.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      const svg = await renderIconSvg(params.name, params.size, params.stroke);
      if (!svg) {
        return err(
          `Icon '${params.name}' not found. Call eds_list_icons to see the registry.`,
        );
      }
      const payload = {
        name: params.name,
        size: params.size,
        stroke: params.stroke,
        svg,
      };
      return ok(svg, payload);
    },
  );
}
