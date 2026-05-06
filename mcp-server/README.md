# `eds-mcp-server`

> MCP server exposing the **Edwson Design System** (component library, design
> tokens, icons, and brand-discipline rules) to LLM clients via stdio.

This sits inside [`storybook-next/`](../) and reads the same source tree
that Storybook serves — so anything you can see in the Storybook UI, an
agent can query through this MCP.

---

## Why

When an LLM helps you build UI in this design system, it needs to know
three things this MCP makes addressable:

1. **What components exist**, what variants/sizes/states they support,
   and what the source looks like — for code review and generation.
2. **What design tokens exist** and which components reference them —
   for refactors, theme adjustments, and "is this token-first?" checks.
3. **What discipline rules apply** — BEM, no inline styles, no incumbent
   product names, etc. — so generated code passes review on the first try.

Without an MCP, the agent has to guess. With one, the agent can quote
the actual source, the actual token value, and the actual rule body.

---

## Tools (10, all read-only)

| Tool | Purpose |
| --- | --- |
| `eds_list_components` | Paginated list, optional category filter (`foundations` / `primitives` / `components` / `financial` / `compliance` / `aml` / `b2b` / `patterns`) |
| `eds_get_component` | Full metadata: paths, BEM classes, variants, sizes, states, exported story names |
| `eds_get_component_source` | Raw `.js` / `.css` / `.stories.js` source files |
| `eds_search_components` | Token-based fuzzy search across name, slug, category, BEM, JSDoc summary |
| `eds_list_tokens` | Paginated tokens, optional group filter (`color` / `space` / `type` / `motion` / `elevation` / `radius` / `size`) |
| `eds_get_token` | Single token value + group + (optional) reverse-lookup of components using it |
| `eds_list_icons` | Paginated icon name list |
| `eds_get_icon_svg` | Render a registered icon as a complete `<svg>` at custom size + stroke |
| `eds_get_story` | Single story's parsed args + description + the component's available stories |
| `eds_get_brand_rule` | Look up a discipline rule by id, or list available rule ids |

Every tool is annotated with `readOnlyHint: true`, `destructiveHint:
false`, `idempotentHint: true`, `openWorldHint: false`. The server makes
no network calls and writes nothing — it only reads files inside the
storybook-next workspace.

---

## Install

```bash
cd storybook-next/mcp-server
npm install
npm run build
```

That produces `dist/index.js`. The server is now ready.

## Smoke test

```bash
# List the 10 tools without running a real client.
(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}'
 echo '{"jsonrpc":"2.0","method":"notifications/initialized"}'
 echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
 sleep 1) | node dist/index.js
```

You should see ten `eds_*` tools in the response.

## Use it from Claude Desktop

Open `~/Library/Application Support/Claude/claude_desktop_config.json`
(create it if it doesn't exist) and add an entry under `mcpServers`:

```jsonc
{
  "mcpServers": {
    "edwson-design-system": {
      "command": "node",
      "args": [
        "/Users/edchen/Desktop/Ed_portfolio_May_01/storybook-next/mcp-server/dist/index.js"
      ]
    }
  }
}
```

Restart Claude Desktop. Open a new conversation and try:

- *List the primitives in the design system.*
- *Show me the source for the Button component's CSS.*
- *Which components use the `--accent` token?*
- *What's the `token-first` brand rule?*
- *Render the `shield-check` icon at 32px.*

## Use it from Claude Code

Add to `~/.claude.json` (or your workspace `.claude.json`):

```jsonc
{
  "mcpServers": {
    "eds": {
      "command": "node",
      "args": [
        "/Users/edchen/Desktop/Ed_portfolio_May_01/storybook-next/mcp-server/dist/index.js"
      ]
    }
  }
}
```

Or run `claude mcp add eds -- node /path/to/dist/index.js`.

---

## Architecture

```
mcp-server/
├── package.json
├── tsconfig.json
├── README.md         ← this file
├── LICENSE
├── src/
│   ├── index.ts      ← stdio entry point + server registration
│   ├── constants.ts  ← paths, limits, server identity
│   ├── types.ts      ← shared TS types + ResponseFormat enum
│   ├── schemas.ts    ← Zod input schemas for every tool
│   ├── services/
│   │   ├── components.ts    ← scan + extract variant/size/state metadata
│   │   ├── tokens.ts        ← parse tokens.css, infer group, find usage
│   │   ├── icons.ts         ← parse the ICONS object literal, render SVG
│   │   ├── stories.ts       ← extract args + description from .stories.js
│   │   ├── brand-rules.ts   ← in-code BrandRule[] catalogue
│   │   └── format.ts        ← ToolResult + JSON/Markdown envelope helpers
│   └── tools/
│       ├── components.ts    ← list / get / get_source / search
│       ├── tokens.ts        ← list / get
│       ├── icons.ts         ← list / get_svg
│       ├── stories.ts       ← get
│       └── brand-rules.ts   ← get (or list ids)
└── dist/             ← built JavaScript (entry: dist/index.js)
```

## Conventions

- **Tool naming**: snake_case with `eds_` prefix to avoid collision with
  other MCPs (`eds_list_components`, never bare `list_components`).
- **Validation**: every input is a Zod schema with `.strict()` (unknown
  keys are rejected, not silently dropped).
- **Output**: every tool returns both `content` (text — markdown or JSON
  string per `response_format`) and `structuredContent` (object) so
  modern clients can consume structured data without re-parsing.
- **Pagination**: `limit` (default 25, max 100) + `offset` + envelope
  `{ total, count, offset, items, has_more, next_offset }`.
- **Errors**: returned as a tool result with `isError: true` and a
  message that says *what* went wrong + *what to do next* (e.g.,
  *"Component slug 'foo' is ambiguous. Found in: …"*).
- **Logs**: stdout is the protocol channel — log to stderr only.

## Security posture

- **No filesystem mutation.** Every tool is read-only. Annotations
  declare `readOnlyHint: true` + `destructiveHint: false`.
- **No network.** `openWorldHint: false`. The server reads local files
  inside the storybook-next workspace; no API calls, no fetches.
- **No eval.** Stories and the icon registry are parsed via regex +
  balanced-brace walking, not executed. Removing eval from the surface
  is what makes the read-only guarantee meaningful.
- **Path containment.** All paths are derived from `STORYBOOK_ROOT`
  (resolved relative to the built `dist/` directory). The server
  doesn't accept arbitrary paths from tool inputs — only component
  identifiers, token names, and icon names.

---

## Maintenance

When you add or remove a component, no code change is needed: the next
tool call re-scans the filesystem (cached for the duration of the
process). Restart the server to refresh the cache.

When you add a new brand-discipline rule:

1. Add an entry to `src/services/brand-rules.ts`.
2. Update the `available_rule_ids` listed in `eds_get_brand_rule`'s
   description (in `src/tools/brand-rules.ts`).
3. `npm run build`.

---

*Maintained alongside the design system. ed@edwson.com*
