/**
 * Shared formatting helpers — JSON / Markdown response builders and a
 * character-limit guard.
 */

import { CHARACTER_LIMIT } from "../constants.js";
import { ResponseFormat } from "../types.js";

export interface ToolResult {
  content: { type: "text"; text: string }[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
  /**
   * The MCP SDK's tool-handler return type carries an index signature
   * (`[k: string]: unknown`) so frameworks can attach future metadata
   * fields without bumping the type. Mirror that here so our helpers
   * stay assignable to it.
   */
  [key: string]: unknown;
}

/**
 * Build a tool result. Always returns text content; emits
 * structuredContent for clients that consume it.
 */
export function ok(
  text: string,
  structured?: Record<string, unknown>,
): ToolResult {
  const safe = capText(text);
  return structured
    ? { content: [{ type: "text", text: safe }], structuredContent: structured }
    : { content: [{ type: "text", text: safe }] };
}

/** Build an error result with an actionable message. */
export function err(message: string): ToolResult {
  return {
    content: [{ type: "text", text: `Error: ${message}` }],
    isError: true,
  };
}

/**
 * Format an envelope as either JSON or Markdown.
 *
 * `markdownFn` is invoked only when the caller asked for markdown, so
 * tools never pay the rendering cost for the wrong format.
 */
export function formatEnvelope<T extends Record<string, unknown>>(
  format: ResponseFormat,
  payload: T,
  markdownFn: (payload: T) => string,
): ToolResult {
  if (format === ResponseFormat.JSON) {
    return ok(JSON.stringify(payload, null, 2), payload);
  }
  return ok(markdownFn(payload), payload);
}

/** Cap a text response at CHARACTER_LIMIT, appending a truncation hint. */
function capText(text: string): string {
  if (text.length <= CHARACTER_LIMIT) return text;
  const head = text.slice(0, CHARACTER_LIMIT - 200);
  return (
    head +
    `\n\n…[truncated; ${text.length - head.length} more chars] ` +
    `Use a more specific filter, paginate with offset, or request response_format='json' for a leaner payload.`
  );
}
