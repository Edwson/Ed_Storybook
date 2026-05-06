#!/usr/bin/env node
/**
 * Edwson Design System — MCP server (stdio).
 *
 * Exposes the storybook-next/ component library to LLM clients via the
 * Model Context Protocol. Read-only: no filesystem mutation, no network
 * I/O, no shell execution. Logs go to stderr (stdout is reserved for the
 * MCP protocol stream).
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { SERVER_NAME, SERVER_VERSION, STORYBOOK_ROOT } from "./constants.js";
import { registerBrandRuleTools } from "./tools/brand-rules.js";
import { registerComponentTools } from "./tools/components.js";
import { registerIconTools } from "./tools/icons.js";
import { registerStoryTools } from "./tools/stories.js";
import { registerTokenTools } from "./tools/tokens.js";

function main(): void {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  registerComponentTools(server);
  registerTokenTools(server);
  registerIconTools(server);
  registerStoryTools(server);
  registerBrandRuleTools(server);

  const transport = new StdioServerTransport();
  server
    .connect(transport)
    .then(() => {
      // stderr only — stdout is the protocol channel.
      process.stderr.write(
        `[${SERVER_NAME} ${SERVER_VERSION}] connected · root=${STORYBOOK_ROOT}\n`,
      );
    })
    .catch((error: unknown) => {
      const msg = error instanceof Error ? error.message : String(error);
      process.stderr.write(`[${SERVER_NAME}] FATAL: ${msg}\n`);
      process.exit(1);
    });
}

main();
